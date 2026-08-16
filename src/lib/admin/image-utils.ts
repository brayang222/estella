import { unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";

export const EXTENSION_BY_MIME: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

/**
 * Tope de subida. No había ninguno: el archivo se carga entero en memoria
 * antes de guardarse, así que uno muy grande tumbaba la función. 6 MB deja
 * pasar cualquier foto de catálogo con holgura.
 */
export const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

/**
 * Guarda la foto en la base y devuelve la fila creada.
 *
 * Antes esto escribía en `public/products/`. En Vercel eso no funciona por dos
 * motivos independientes: el sistema de archivos es de solo lectura en
 * ejecución, y aunque no lo fuera, /public se sirve desde la salida del build
 * en el CDN — un archivo escrito en caliente nunca llegaría al visitante. Por
 * eso los bytes van a Postgres y se sirven desde /api/imagen/[id].
 *
 * ponytail: Postgres como almacén de imágenes está bien a esta escala (20
 * fotos) y evita depender de un servicio más. El techo es el tamaño de la
 * base: con un catálogo de cientos de piezas a 4 fotos conviene mover esto a
 * almacenamiento de objetos, y el punto de cambio es esta función más la ruta
 * que las sirve.
 */
export async function saveProductImage(
  file: File,
  productId: string,
  order: number
): Promise<{ id: string; url: string }> {
  if (!EXTENSION_BY_MIME[file.type]) {
    throw new Error("Formato de imagen no soportado (usa WEBP, JPG o PNG).");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error(`La imagen supera el máximo de ${MAX_IMAGE_BYTES / 1024 / 1024} MB.`);
  }

  const data = Buffer.from(await file.arrayBuffer());
  const image = await prisma.productImage.create({
    data: { productId, order, data, mimeType: file.type, url: "" },
    select: { id: true },
  });

  // La URL solo se puede armar con el id ya asignado.
  const url = `/api/imagen/${image.id}`;
  await prisma.productImage.update({ where: { id: image.id }, data: { url } });
  return { id: image.id, url };
}

/**
 * Borra el archivo de /public si la foto era de las que llegaron en el repo.
 * Las guardadas en la base se van solas al borrar la fila.
 */
export async function deleteImageFile(url: string) {
  if (!url.startsWith("/products/")) return;
  try {
    await unlink(path.join(process.cwd(), "public", url));
  } catch {
    // Ya no existe — está bien.
  }
}
