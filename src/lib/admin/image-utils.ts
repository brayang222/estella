import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export const PRODUCTS_DIR = path.join(process.cwd(), "public", "products");

export const EXTENSION_BY_MIME: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

export async function saveImageFile(file: File, slug: string, order: number): Promise<string> {
  const ext = EXTENSION_BY_MIME[file.type];
  if (!ext) throw new Error("Formato de imagen no soportado (usa WEBP, JPG o PNG).");

  await mkdir(PRODUCTS_DIR, { recursive: true });
  const filename = `${slug}-${order}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(PRODUCTS_DIR, filename), buffer);
  return `/products/${filename}`;
}

export async function deleteImageFile(url: string) {
  if (!url.startsWith("/products/")) return;
  try {
    await unlink(path.join(process.cwd(), "public", url));
  } catch {
    // Ya no existe — está bien.
  }
}
