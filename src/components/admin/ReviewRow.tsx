"use client";

import { useTransition } from "react";
import Link from "next/link";
import { ReviewStars } from "../ReviewStars";
import { approveReview, deleteReview } from "@/lib/admin/reviews";

export type AdminReviewRow = {
  id: string;
  productName: string;
  productSlug: string;
  authorName: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
};

export function ReviewRow({ review }: { review: AdminReviewRow }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-2 bg-paper px-4 py-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/producto/${review.productSlug}`} target="_blank" className="text-[13px] hover:text-gold">
            {review.productName}
          </Link>
          {!review.approved && (
            <span className="bg-gold px-1.5 py-0.5 text-[8px] tracking-[0.15em] text-ink uppercase">
              Pendiente
            </span>
          )}
        </div>
        <span className="text-[11px] text-muted">{review.createdAt}</span>
      </div>
      <div className="flex items-center gap-2 text-[12px] text-muted">
        <ReviewStars rating={review.rating} />
        <span>{review.authorName}</span>
      </div>
      <p className="m-0 text-[13px] leading-[1.6] text-muted">{review.comment}</p>
      <div className="flex items-center gap-4">
        {!review.approved && (
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => approveReview(review.id))}
            className="cursor-pointer border border-ink/20 px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase transition-colors duration-200 ease-out hover:border-ink disabled:cursor-default disabled:opacity-40"
          >
            Aprobar
          </button>
        )}
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (!window.confirm("¿Eliminar esta reseña?")) return;
            startTransition(() => deleteReview(review.id));
          }}
          className="cursor-pointer border-0 bg-transparent text-[10px] tracking-[0.1em] text-red-700 uppercase underline-offset-4 hover:underline disabled:cursor-default disabled:opacity-40"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
