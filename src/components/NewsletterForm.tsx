"use client";

import { useActionState } from "react";
import { subscribeToNewsletter, type NewsletterState } from "@/lib/newsletter";
import { WhatsAppIcon } from "./WhatsAppIcon";

/**
 * Captura de baja fricción: un campo. El `source` viaja oculto para saber qué
 * punto del sitio capta más — la bolsa vacía y la portada convierten distinto.
 */
export function NewsletterForm({ source }: { source: string }) {
  const [state, formAction, pending] = useActionState<NewsletterState | undefined, FormData>(
    subscribeToNewsletter,
    undefined
  );

  if (state?.ok) {
    return (
      <p className="m-0 max-w-[46ch] text-[13.5px] leading-[1.8] text-ink" role="status">
        ¡Listo! Te escribimos por WhatsApp cuando lleguen piezas nuevas. Nada de spam.
      </p>
    );
  }

  return (
    <form action={formAction} className="grid w-full max-w-[420px] gap-2.5">
      <input type="hidden" name="source" value={source} />
      <div className="flex flex-wrap gap-2.5">
        <input
          type="tel"
          name="phone"
          required
          autoComplete="tel"
          placeholder="Tu WhatsApp — ej. 300 000 0000"
          aria-label="Tu número de WhatsApp"
          className="min-w-0 flex-1 border border-ink/20 bg-transparent px-3.5 py-3 text-[14px] placeholder:text-ink/30 focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex shrink-0 cursor-pointer items-center gap-2 bg-ink px-6 py-3 text-[10.5px] tracking-[0.2em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold disabled:cursor-default disabled:opacity-60"
        >
          <WhatsAppIcon className="size-4" />
          {pending ? "Enviando…" : "Avísame"}
        </button>
      </div>

      {state?.error && (
        <p className="m-0 text-[12px] text-red-700" role="alert">
          {state.error}
        </p>
      )}
      <p className="m-0 text-[11px] leading-[1.6] text-muted">
        Solo te escribimos cuando entran piezas nuevas. Sin cuenta ni contraseña.
      </p>
    </form>
  );
}
