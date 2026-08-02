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

  revalidatePath("/admin/productos");
  revalidatePath("/");
  revalidatePath("/productos");
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

  const existing = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing) return { error: "Esta pieza ya no existe." };

  try {
    await prisma.product.update({ where: { id }, data: fields.data });
  } catch {
    return { error: "Ya existe otra pieza con esa referencia." };
  }

  for (const order of IMAGE_SLOTS) {
    const current = existing.images.find((image) => image.order === order);
    const shouldRemove = formData.get(`remove${order}`) === "on";
    const file = formData.get(`image${order}`);
    const hasNewFile = file instanceof File && file.size > 0;

    if (!shouldRemove && !hasNewFile) continue;

    if (current) {
      await prisma.productImage.delete({ where: { id: current.id } });
      await deleteImageFile(current.url);
    }
    if (hasNewFile) {
      const url = await saveImageFile(file, existing.slug, order);
      await prisma.productImage.create({ data: { productId: id, url, order } });
    }
  }

  revalidatePath("/admin/productos");
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath(`/producto/${existing.slug}`);
  redirect("/admin/productos");
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  const product = await prisma.product.findUnique({ where: { id }, include: { images: true } });
  if (!product) return;

  await Promise.all(product.images.map((image) => deleteImageFile(image.url)));
  await prisma.product.delete({ where: { id } });

  revalidatePath("/admin/productos");
  revalidatePath("/");
  revalidatePath("/productos");
}
