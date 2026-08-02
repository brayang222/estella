"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./auth";
import { slugify } from "./slugify";

export type ProductFormState = { error?: string };

const IMAGE_SLOTS = [1, 2, 3, 4] as const;
const PRODUCTS_DIR = path.join(process.cwd(), "public", "products");
const EXTENSION_BY_MIME: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

async function saveImageFile(file: File, slug: string, order: number): Promise<string> {
  const ext = EXTENSION_BY_MIME[file.type];
  if (!ext) throw new Error("Formato de imagen no soportado (usa WEBP, JPG o PNG).");

  await mkdir(PRODUCTS_DIR, { recursive: true });
  const filename = `${slug}-${order}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(PRODUCTS_DIR, filename), buffer);
  return `/products/${filename}`;
}

async function deleteImageFile(url: string) {
  // Only ever deletes local /public files — remote CDN URLs (once
  // NEXT_PUBLIC_IMAGE_BASE_URL is set) have nothing on this disk to remove.
  if (!url.startsWith("/products/")) return;
  try {
    await unlink(path.join(process.cwd(), "public", url));
  } catch {
    // Already gone — fine.
  }
}

function revalidateStorefront(slug?: string) {
  revalidatePath("/admin/productos");
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/bolsa");
  revalidatePath("/favoritos");
  if (slug) revalidatePath(`/producto/${slug}`);
}

function readProductFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const referenceCode = String(formData.get("referenceCode") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const price = Number(priceRaw);
  const tag = String(formData.get("tag") ?? "").trim() || "Nuevo";
  const description = String(formData.get("description") ?? "").trim();
  const measurements = String(formData.get("measurements") ?? "").trim();
  const available = formData.get("available") === "on";

  if (!name || !categoryId || !referenceCode || !description) {
    return { error: "Nombre, categoría, referencia y descripción son obligatorios." } as const;
  }
  if (!Number.isFinite(price) || price <= 0) {
    return { error: "El precio debe ser un número mayor a 0." } as const;
  }

  return {
    data: {
      name,
      categoryId,
      referenceCode,
      price: Math.round(price),
      tag,
      description,
      measurements: measurements || null,
      available,
    },
  } as const;
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const fields = readProductFields(formData);
  if ("error" in fields) return fields;

  const slug = slugify(fields.data.name);
  const count = await prisma.product.count();

  let product;
  try {
    product = await prisma.product.create({
      data: {
        ...fields.data,
        slug,
        placeholderLabel: fields.data.name.toLowerCase(),
        sortOrder: count,
      },
    });
  } catch {
    return { error: "Ya existe una pieza con ese nombre o esa referencia." };
  }

  for (const order of IMAGE_SLOTS) {
    const file = formData.get(`image${order}`);
    if (!(file instanceof File) || file.size === 0) continue;
    const url = await saveImageFile(file, slug, order);
    await prisma.productImage.create({ data: { productId: product.id, url, order } });
  }

  revalidateStorefront();
  redirect("/admin/productos");
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const fields = readProductFields(formData);
  if ("error" in fields) return fields;

  const existing = await prisma.product.findUnique({ where: { id }, select: { slug: true } });
  if (!existing) return { error: "Esta pieza ya no existe." };

  try {
    // Las fotos se gestionan aparte (ver addProductImage / moveProductImage),
    // porque reordenarlas no debería obligar a reenviar todo el formulario.
    await prisma.product.update({ where: { id }, data: fields.data });
  } catch {
    return { error: "Ya existe otra pieza con esa referencia." };
  }

  revalidateStorefront(existing.slug);
  redirect("/admin/productos");
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  const product = await prisma.product.findUnique({ where: { id }, include: { images: true } });
  if (!product) return;

  await Promise.all(product.images.map((image) => deleteImageFile(image.url)));
  await prisma.product.delete({ where: { id } });

  revalidateStorefront(product.slug);
}

/* -------------------------------------------------------------------------
 * Prioridad (orden en que se muestran las piezas en la tienda)
 * ---------------------------------------------------------------------- */

/**
 * Sube o baja una pieza una posición. Renumera toda la lista de 0 en
 * adelante, así los empates heredados (varias piezas con el mismo
 * sortOrder) quedan resueltos en cuanto se toca el orden una vez.
 */
export async function moveProduct(id: string, direction: "up" | "down") {
  await requireAdmin();

  const all = await prisma.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true },
  });
  const index = all.findIndex((product) => product.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= all.length) return;

  const reordered = [...all];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

  await prisma.$transaction(
    reordered.map((product, position) =>
      prisma.product.update({ where: { id: product.id }, data: { sortOrder: position } })
    )
  );

  revalidateStorefront();
}

/* -------------------------------------------------------------------------
 * Fotos de una pieza ya creada
 * ---------------------------------------------------------------------- */

/**
 * Reasigna los `order` en dos pasadas dentro de una transacción: primero a
 * negativos y luego a 1..n. El índice único (productId, order) impide
 * intercambiar dos posiciones de una sola pasada.
 */
async function renumberImages(orderedIds: string[]) {
  await prisma.$transaction([
    ...orderedIds.map((id, i) =>
      prisma.productImage.update({ where: { id }, data: { order: -(i + 1) } })
    ),
    ...orderedIds.map((id, i) =>
      prisma.productImage.update({ where: { id }, data: { order: i + 1 } })
    ),
  ]);
}

export async function addProductImage(productId: string, formData: FormData) {
  await requireAdmin();

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!product) return;
  if (product.images.length >= IMAGE_SLOTS.length) return;

  // Primer hueco libre entre 1 y 4.
  const used = new Set(product.images.map((image) => image.order));
  const slot = IMAGE_SLOTS.find((order) => !used.has(order));
  if (!slot) return;

  const url = await saveImageFile(file, product.slug, slot);
  await prisma.productImage.create({ data: { productId, url, order: slot } });

  revalidatePath(`/admin/productos/${productId}`);
  revalidateStorefront(product.slug);
}

export async function removeProductImage(imageId: string) {
  await requireAdmin();

  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
    include: { product: { select: { id: true, slug: true } } },
  });
  if (!image) return;

  await prisma.productImage.delete({ where: { id: imageId } });
  await deleteImageFile(image.url);

  // Sin huecos: la siguiente foto pasa a ser la miniatura.
  const rest = await prisma.productImage.findMany({
    where: { productId: image.product.id },
    orderBy: { order: "asc" },
    select: { id: true },
  });
  await renumberImages(rest.map((row) => row.id));

  revalidatePath(`/admin/productos/${image.product.id}`);
  revalidateStorefront(image.product.slug);
}

/** La foto en primera posición es la miniatura de la tienda. */
export async function moveProductImage(imageId: string, direction: "up" | "down") {
  await requireAdmin();

  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
    include: { product: { select: { id: true, slug: true } } },
  });
  if (!image) return;

  const images = await prisma.productImage.findMany({
    where: { productId: image.product.id },
    orderBy: { order: "asc" },
    select: { id: true },
  });
  const index = images.findIndex((row) => row.id === imageId);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= images.length) return;

  const reordered = [...images];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
  await renumberImages(reordered.map((row) => row.id));

  revalidatePath(`/admin/productos/${image.product.id}`);
  revalidateStorefront(image.product.slug);
}
