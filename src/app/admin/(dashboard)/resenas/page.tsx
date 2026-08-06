import { ReviewRow, type AdminReviewRow } from "@/components/admin/ReviewRow";
import { prisma } from "@/lib/db";

export const metadata = { title: "Reseñas" };

const dateFormat = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
    include: { product: { select: { name: true, slug: true } } },
  });

  const rows: AdminReviewRow[] = reviews.map((review) => ({
    id: review.id,
    productName: review.product.name,
    productSlug: review.product.slug,
    authorName: review.authorName,
    rating: review.rating,
    comment: review.comment,
    approved: review.approved,
    createdAt: dateFormat.format(review.createdAt),
  }));

  const pendingCount = rows.filter((row) => !row.approved).length;

  return (
    <div className="grid max-w-[680px] gap-8">
      <div className="grid gap-1">
        <h1 className="m-0 font-display text-[26px]">Reseñas</h1>
        <p className="m-0 text-[12px] text-muted">
          {pendingCount > 0
            ? `${pendingCount} ${pendingCount === 1 ? "reseña pendiente" : "reseñas pendientes"} de aprobar.`
            : "No hay reseñas pendientes."}
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="m-0 text-[13px] text-muted">Todavía no hay reseñas.</p>
      ) : (
        <div className="grid gap-px overflow-hidden border border-ink/12 bg-ink/12">
          {rows.map((review) => (
            <ReviewRow key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
