"use client";

import { useActionState } from "react";
import { submitReview, type ReviewFormState } from "@/lib/reviews/actions";

const inputClass =
  "border border-ink/20 bg-transparent px-3.5 py-3 text-[14px] focus:border-ink focus:outline-none";
const labelClass = "text-[10px] tracking-[0.15em] text-muted uppercase";

export function ReviewForm({
  productId,
  slug,
  defaultName,
}: {
  productId: string;
  slug: string;
  defaultName?: string | null;
}) {
  const action = submitReview.bind(null, productId, slug);
  const [state, formAction, pending] = useActionState<ReviewFormState | undefined, FormData>(
    action,
    undefined
  );

  if (state?.ok) {
    return (
      <p className="m-0 max-w-[420px] text-[13px] leading-[1.7] text-muted" role="status">
        ¡Gracias por tu reseña! Se publicará en cuanto la revisemos.
      </p>
    );
  }

  return (
    <form action={formAction} className="grid max-w-[420px] gap-4">
      <label className="grid gap-1.5">
        <span className={labelClass}>Tu nombre</span>
        <input
          type="text"
          name="authorName"
          defaultValue={defaultName ?? ""}
          required
          minLength={2}
          maxLength={60}
          className={inputClass}
        />
      </label>

      <label className="grid gap-1.5">
        <span className={labelClass}>Calificación</span>
        <select name="rating" defaultValue="5" required className={inputClass}>
          <option value="5">★★★★★ — Excelente</option>
          <option value="4">★★★★☆ — Muy buena</option>
          <option value="3">★★★☆☆ — Buena</option>
          <option value="2">★★☆☆☆ — Regular</option>
          <option value="1">★☆☆☆☆ — Mala</option>
        </select>
      </label>

      <label className="grid gap-1.5">
        <span className={labelClass}>Tu reseña</span>
        <textarea
          name="comment"
          required
          minLength={5}
          maxLength={1000}
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </label>

      {state?.error && (
        <p className="m-0 text-[12px] text-red-700" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 w-fit cursor-pointer bg-ink px-8 py-3.5 text-[11px] tracking-[0.2em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold disabled:cursor-default disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar reseña"}
      </button>
    </form>
  );
}
