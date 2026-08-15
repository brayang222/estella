import "server-only";
import { prisma } from "@/lib/db";

/**
 * Promedio y total de reseñas aprobadas, para el aggregateRating del JSON-LD
 * (las estrellas que Google puede mostrar en los resultados). Agrega en la
 * base en vez de traer las filas: la ficha ya las carga aparte en
 * ReviewsSection y aquí solo hacen falta los dos números.
 */
export async function getReviewStats(productId: string) {
  const { _avg, _count } = await prisma.review.aggregate({
    where: { productId, approved: true },
    _avg: { rating: true },
    _count: true,
  });
  return { average: _avg.rating, count: _count };
}

export function getApprovedReviews(productId: string) {
  return prisma.review.findMany({
    where: { productId, approved: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, authorName: true, rating: true, comment: true, createdAt: true },
  });
}
