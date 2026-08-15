"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./auth";

function revalidateReviewPages(slug?: string) {
  revalidatePath("/admin/resenas");
  if (slug) revalidatePath(`/producto/${slug}`);
}

export async function approveReview(id: string) {
  await requireAdmin();
  const review = await prisma.review.update({
    where: { id },
    data: { approved: true },
    include: { product: { select: { slug: true } } },
  });
  revalidateReviewPages(review.product.slug);
}

export async function deleteReview(id: string) {
  await requireAdmin();
  const review = await prisma.review.delete({
    where: { id },
    include: { product: { select: { slug: true } } },
  });
  revalidateReviewPages(review.product.slug);
}
