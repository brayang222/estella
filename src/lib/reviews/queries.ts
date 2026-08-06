import "server-only";
import { prisma } from "@/lib/db";

export function getApprovedReviews(productId: string) {
  return prisma.review.findMany({
    where: { productId, approved: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, authorName: true, rating: true, comment: true, createdAt: true },
  });
}
