import { ReviewForm } from "./ReviewForm";
import { ReviewStars } from "./ReviewStars";
import { getApprovedReviews } from "@/lib/reviews/queries";
import { getCustomer } from "@/lib/account/session";

const dateFormat = new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" });

export async function ReviewsSection({ productId, slug }: { productId: string; slug: string }) {
  const [reviews, customer] = await Promise.all([getApprovedReviews(productId), getCustomer()]);
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <section className="grid gap-[clamp(20px,2.6vw,32px)] border-t border-ink/12 pt-[clamp(40px,5vw,64px)] md:col-span-2 md:max-w-[560px]">
      <div className="grid gap-2">
        <h2 className="m-0 font-display text-[clamp(22px,3vw,32px)] leading-[1.1]">Reseñas</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 text-[13px] text-muted">
            <ReviewStars rating={Math.round(average)} />
            <span>
              {average.toFixed(1)} de 5 · {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}
            </span>
          </div>
        )}
      </div>

      {reviews.length > 0 && (
        <ul className="m-0 grid list-none gap-5 p-0">
          {reviews.map((review) => (
            <li key={review.id} className="grid gap-1.5 border-b border-ink/10 pb-5 last:border-0 last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] tracking-[0.02em]">{review.authorName}</span>
                <span className="text-[11px] text-muted">{dateFormat.format(review.createdAt)}</span>
              </div>
              <ReviewStars rating={review.rating} className="text-[13px]" />
              <p className="m-0 text-[13px] leading-[1.7] text-muted text-pretty">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}

      <ReviewForm productId={productId} slug={slug} defaultName={customer?.name} />
    </section>
  );
}
