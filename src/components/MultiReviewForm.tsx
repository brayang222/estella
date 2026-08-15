"use client";

import { useActionState, useState } from "react";
import { submitMultiReview, type ReviewFormState } from "@/lib/reviews/actions";

const inputClass =
  "border border-ink/20 bg-transparent px-3.5 py-3 text-[14px] focus:border-ink focus:outline-none";
const labelClass = "text-[10px] tracking-[0.15em] text-muted uppercase";

type Piece = { slug: string; name: string };

export function MultiReviewForm({
  pieces,
  preselected,
  defaultName,
}: {
  pieces: Piece[];
  /** Piezas del pedido, que llegan marcadas desde el enlace de WhatsApp. */
  preselected: string[];
  defaultName?: string | null;
}) {
  const [state, formAction, pending] = useActionState<ReviewFormState | undefined, FormData>(
    submitMultiReview,
    undefined
  );
  // Estado propio para poder deshabilitar el envío sin nada seleccionado; el
  // servidor lo valida igual, esto solo evita el viaje en vano.
  const [selected, setSelected] = useState<string[]>(preselected);

  const toggle = (slug: string) =>
    setSelected((current) =>
      current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]
    );

  if (state?.ok) {
    return (
      <div className="grid gap-3" role="status">
        <p className="m-0 text-[15px] leading-[1.8]">
          ¡Gracias! Tu reseña ya nos llegó y se publica en cuanto la revisemos.
        </p>
        <p className="m-0 text-[13px] leading-[1.8] text-muted">
          Significa mucho para una marca pequeña como la nuestra.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-6">
      <fieldset className="m-0 grid gap-2.5 border-0 p-0">
        <legend className={`${labelClass} mb-1 p-0`}>¿Qué piezas quieres calificar?</legend>
        <div className="grid max-h-[280px] gap-1.5 overflow-y-auto pr-1">
          {pieces.map((piece) => (
            <label key={piece.slug} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                name="slugs"
                value={piece.slug}
                checked={selected.includes(piece.slug)}
                onChange={() => toggle(piece.slug)}
              />
              <span className="text-[13.5px]">{piece.name}</span>
            </label>
          ))}
        </div>
        <span className="text-[11px] text-muted">
          Tu reseña queda en cada pieza que marques. Puedes elegir varias.
        </span>
      </fieldset>

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
          rows={5}
          placeholder="¿Cómo te llegó? ¿Cómo se siente al usarla?"
          className={`${inputClass} resize-none placeholder:text-ink/25`}
        />
      </label>

      {state?.error && (
        <p className="m-0 text-[12px] text-red-700" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || selected.length === 0}
        className="w-fit cursor-pointer bg-ink px-8 py-3.5 text-[11px] tracking-[0.2em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold disabled:cursor-default disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar reseña"}
      </button>
    </form>
  );
}
