"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./auth";
import { slugify } from "./slugify";
import { saveImageFile, deleteImageFile } from "./image-utils";

/** Código de error de Postgres/Prisma para violación de índice único. */
const UNIQUE_CONSTRAINT = "P2002";

function uniqueFieldConflict(error: unknown): string | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== UNIQUE_CONSTRAINT) {
    return null;
  }
  // Prisma "clásico" pone el campo en meta.target. El adapter de Neon (el que
  // usa este proyecto) no llena target — el campo real queda anidado en
  // meta.driverAdapterError.cause.constraint.fields, entre comillas dobles
  // (así lo devuelve Postgres). Se prueban ambas formas por si el adapter
  // cambia de shape en una futura versión.
  const target = error.meta?.target;
  if (Array.isArray(target) && target.length > 0) return String(target[0]);

  const meta = error.meta as
    | { driverAdapterError?: { cause?: { constraint?: { fields?: unknown } } } }
    | undefined;
  const fields = meta?.driverAdapterError?.cause?.constraint?.fields;
  if (Array.isArray(fields) && fields.length > 0) {
    return String(fields[0]).replace(/^"+|"+$/g, "");
  }
  return null;
}

/** Mensaje legible cuando falla el guardado — el real si se puede identificar, si no, el crudo de Prisma. */
function saveErrorMessage(error: unknown, fallback: string): string {
  const field = uniqueFieldConflict(error);
  if (field === "referenceCode") return "Ya existe otra pieza con esa referencia.";
  if (field === "slug") return "Ya existe otra pieza con ese nombre.";
  if (field) return `Ya existe otra pieza con ese ${field}.`;
  // El mensaje de Prisma trae el volcado completo del invocation (archivo,
  // línea, snippet de código); la razón real siempre queda en la última
  // línea no vacía, así que solo esa es la que vale la pena mostrar.
  const raw = error instanceof Error ? error.message : String(error);
  const lines = raw.trim().split("\n");
  const message = lines[lines.length - 1].trim();
  return `${fallback}: ${message}`;
}

type FormValues = {
  name: string;
  categoryId: string;
  referenceCode: string;
  price: string;
  tag: string;
  description: string;
  measurements: string;
  stock: string;
  available: boolean;
  customizable: boolean;
  maxCharms: string;
  dropPointX: string;
  dropPointY: string;
};

export type ProductFormState = {
  error?: string;
  values?: FormValues;
  attempt?: number;
};

function extractFormValues(formData: FormData): FormValues {
  return {
    name: String(formData.get("name") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    referenceCode: String(formData.get("referenceCode") ?? ""),
    price: String(formData.get("price") ?? ""),
    tag: String(formData.get("tag") ?? ""),
    description: String(formData.get("description") ?? ""),
    measurements: String(formData.get("measurements") ?? ""),
    stock: String(formData.get("stock") ?? ""),
    available: formData.get("available") === "on",
    customizable: formData.get("customizable") === "on",
    maxCharms: String(formData.get("maxCharms") ?? "1"),
    dropPointX: String(formData.get("dropPointX") ?? ""),
    dropPointY: String(formData.get("dropPointY") ?? ""),
  };
}

const IMAGE_SLOTS = [1, 2, 3, 4] as const;

function revalidateStorefront(slug?: string) {
  revalidatePath("/admin/productos");
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/arma-tu-cadena");
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
  const stockRaw = String(formData.get("stock") ?? "").trim();
  let available = formData.get("available") === "on";
  const customizable = formData.get("customizable") === "on";
  const maxCharmsRaw = String(formData.get("maxCharms") ?? "").trim();
  const maxCharms = maxCharmsRaw !== "" && Number.isInteger(Number(maxCharmsRaw)) && Number(maxCharmsRaw) >= 1
    ? Number(maxCharmsRaw) : 1;
  const dpXRaw = String(formData.get("dropPointX") ?? "").trim();
  const dpYRaw = String(formData.get("dropPointY") ?? "").trim();
  const dropPointX = dpXRaw !== "" ? Number(dpXRaw) : null;
  const dropPointY = dpYRaw !== "" ? Number(dpYRaw) : null;

  if (!name || !categoryId || !referenceCode || !description) {
    return { error: "Nombre, categoría, referencia y descripción son obligatorios." } as const;
  }
  if (!Number.isFinite(price) || price <= 0) {
    return { error: "El precio debe ser un número mayor a 0." } as const;
  }

  // Vacío = sin seguimiento de stock, se comporta como hoy (solo el check de
  // disponible). Con un número, 0 unidades siempre implica agotado — evita
  // que quede marcada "disponible" con 0 en existencia.
  let stock: number | null = null;
  if (stockRaw !== "") {
    const parsed = Number(stockRaw);
    if (!Number.isInteger(parsed) || parsed < 0) {
      return { error: "El stock debe ser un número entero de 0 en adelante (o déjalo vacío)." } as const;
    }
    stock = parsed;
    if (stock === 0) available = false;
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
      stock,
      available,
      customizable,
      maxCharms,
      dropPointX,
      dropPointY,
    },
  } as const;
}

export async function createProduct(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const fields = readProductFields(formData);
  const values = extractFormValues(formData);
  const attempt = (prevState.attempt ?? 0) + 1;
  if ("error" in fields) return { ...fields, values, attempt };

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
  } catch (error) {
    return { error: saveErrorMessage(error, "No se pudo crear la pieza"), values, attempt };
  }

  for (const order of IMAGE_SLOTS) {
    const file = formData.get(`image${order}`);
    if (!(file instanceof File) || file.size === 0) continue;
    const url = await saveImageFile(file, slug, order);
    await prisma.productImage.create({ data: { productId: product.id, url, order } });
  }

  revalidateStorefront();
  redirect(`/admin/productos/${product.id}`);
}

export async function updateProduct(
  id: string,
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const fields = readProductFields(formData);
  const values = extractFormValues(formData);
  const attempt = (prevState.attempt ?? 0) + 1;
  if ("error" in fields) return { ...fields, values, attempt };

  const existing = await prisma.product.findUnique({ where: { id }, select: { slug: true } });
  if (!existing) return { error: "Esta pieza ya no existe.", values, attempt };

  try {
    // Las fotos se gestionan aparte (ver addProductImage / moveProductImage),
    // porque reordenarlas no debería obligar a reenviar todo el formulario.
    await prisma.product.update({ where: { id }, data: fields.data });
  } catch (error) {
    return { error: saveErrorMessage(error, "No se pudo guardar la pieza"), values, attempt };
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
