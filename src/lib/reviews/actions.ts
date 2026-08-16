"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCustomer } from "@/lib/account/session";
import { superaElCupo } from "@/lib/rate-limit";

export type ReviewFormState = { error?: string; ok?: boolean };

/** Escribir reseñas es público: 5 envíos por IP cada 10 minutos alcanzan de sobra. */
const CUPO_RESENAS = { limite: 5, ventanaMs: 10 * 60 * 1000 };
const MENSAJE_CUPO = "Recibimos varias reseñas tuyas seguidas. Espera un momento y vuelve a intentar.";

/** Mismas reglas para el formulario de la ficha y el de /calificar. */
function validate(authorName: string, rating: number, comment: string): string | null {
  if (authorName.length < 2 || authorName.length > 60) {
    return "Escribe tu nombre (2-60 caracteres).";
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return "Elige una calificación de 1 a 5.";
  }
  if (comment.length < 5 || comment.length > 1000) {
    return "La reseña debe tener entre 5 y 1000 caracteres.";
  }
  return null;
}

/**
 * Una misma reseña aplicada a varias piezas, desde /calificar. Guarda una fila
 * por pieza para que cada ficha muestre su propia calificación y su promedio.
 *
 * Los slugs se vuelven a resolver contra la base aquí: llegan de un formulario
 * público, así que lo que diga el cliente sobre qué existe y qué está
 * publicado no se toma por cierto.
 */
export async function submitMultiReview(
  _prevState: ReviewFormState | undefined,
  formData: FormData
): Promise<ReviewFormState> {
  if (await superaElCupo("resenas", CUPO_RESENAS)) return { error: MENSAJE_CUPO };

  const customer = await getCustomer();
  const authorName = String(formData.get("authorName") ?? "").trim();
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();
  const slugs = formData.getAll("slugs").map(String);

  if (slugs.length === 0) return { error: "Selecciona al menos una pieza." };

  const invalid = validate(authorName, rating, comment);
  if (invalid) return { error: invalid };

  const products = await prisma.product.findMany({
    where: { slug: { in: slugs }, published: true },
    select: { id: true, slug: true },
  });
  if (products.length === 0) {
    return { error: "No encontramos esas piezas. Vuelve a seleccionarlas." };
  }

  await prisma.review.createMany({
    data: products.map((product) => ({
      productId: product.id,
      userId: customer?.id,
      authorName,
      rating,
      comment,
    })),
  });

  products.forEach((product) => revalidatePath(`/producto/${product.slug}`));
  return { ok: true };
}

export async function submitReview(
  productId: string,
  slug: string,
  _prevState: ReviewFormState | undefined,
  formData: FormData
): Promise<ReviewFormState> {
  if (await superaElCupo("resenas", CUPO_RESENAS)) return { error: MENSAJE_CUPO };

  const customer = await getCustomer();
  const authorName = String(formData.get("authorName") ?? "").trim();
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();

  const invalid = validate(authorName, rating, comment);
  if (invalid) return { error: invalid };

  await prisma.review.create({
    data: { productId, userId: customer?.id, authorName, rating, comment },
  });

  revalidatePath(`/producto/${slug}`);
  return { ok: true };
}
