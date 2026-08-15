"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCustomer } from "@/lib/account/session";

export type ReviewFormState = { error?: string; ok?: boolean };

export async function submitReview(
  productId: string,
  slug: string,
  _prevState: ReviewFormState | undefined,
  formData: FormData
): Promise<ReviewFormState> {
  const customer = await getCustomer();
  const authorName = String(formData.get("authorName") ?? "").trim();
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();

  if (authorName.length < 2 || authorName.length > 60) {
    return { error: "Escribe tu nombre (2-60 caracteres)." };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Elige una calificación de 1 a 5." };
  }
  if (comment.length < 5 || comment.length > 1000) {
    return { error: "La reseña debe tener entre 5 y 1000 caracteres." };
  }

  await prisma.review.create({
    data: { productId, userId: customer?.id, authorName, rating, comment },
  });

  revalidatePath(`/producto/${slug}`);
  return { ok: true };
}
