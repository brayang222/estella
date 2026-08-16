import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

/**
 * Sirve las fotos guardadas en la base (ver src/lib/admin/image-utils.ts).
 *
 * Es pública a propósito: son las fotos del catálogo, lo mismo que hoy vive en
 * /public. No expone nada más — solo devuelve bytes de una fila de
 * ProductImage buscada por id.
 *
 * La caché es lo que hace que esto no le pegue a la base en cada visita: el id
 * es inmutable y una foto nunca cambia de contenido (subir otra crea otra
 * fila), así que el CDN puede quedársela para siempre.
 */
export async function GET(_request: Request, { params }: Props) {
  const { id } = await params;

  const image = await prisma.productImage.findUnique({
    where: { id },
    select: { data: true, mimeType: true },
  });

  if (!image?.data || !image.mimeType) {
    return new NextResponse("No encontrada", { status: 404 });
  }

  return new NextResponse(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
