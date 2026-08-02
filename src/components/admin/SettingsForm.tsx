"use client";

import { useActionState } from "react";
import { updateSiteSettings, type SettingsFormState } from "@/lib/admin/settings";
import { normalizeWhatsappNumber, type SiteSettings } from "@/lib/settings";
import { waLink } from "@/lib/whatsapp";

const inputClass =
  "border border-ink/20 bg-transparent px-3 py-2 text-[14px] focus:border-ink focus:outline-none";
const labelClass = "text-[10px] tracking-[0.15em] text-muted uppercase";
const hintClass = "text-[11px] leading-[1.6] text-muted";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState<SettingsFormState | undefined, FormData>(
    updateSiteSettings,
    undefined
  );

  return (
    <form action={formAction} className="grid max-w-[640px] gap-7">
      {state?.error && <p className="m-0 bg-red-50 p-3 text-[13px] text-red-700">{state.error}</p>}
      {state?.ok && (
        <p className="m-0 bg-paper-alt p-3 text-[13px] text-ink">
          Ajustes guardados. Ya están aplicados en toda la tienda.
        </p>
      )}

      <fieldset className="m-0 grid gap-5 border-0 p-0">
        <legend className="mb-1 p-0 font-display text-[18px]">WhatsApp</legend>

        <label className="grid gap-1.5">
          <span className={labelClass}>Número (con indicativo del país)</span>
          <input
            name="whatsappNumber"
            defaultValue={settings.whatsappNumber}
            required
            inputMode="tel"
            className={inputClass}
          />
          <span className={hintClass}>
            Puedes escribirlo con espacios o “+”; se guardan solo los dígitos. Colombia empieza por
            57 — por ejemplo, 57 312 617 7800. A este número llegan todos los botones de la tienda
            y los pedidos de la bolsa.
          </span>
        </label>

        <label className="grid gap-1.5">
          <span className={labelClass}>Mensaje con el que abre el chat</span>
          <input
            name="whatsappGreeting"
            defaultValue={settings.whatsappGreeting}
            required
            className={inputClass}
          />
          <span className={hintClass}>
            Es el texto que el cliente ve ya escrito al tocar “Escríbenos” o “Asesoría”.
          </span>
        </label>

        <p className={`m-0 ${hintClass}`}>
          Enlace actual:{" "}
          <a
            href={waLink(settings.whatsappGreeting, settings.whatsappNumber)}
            target="_blank"
            rel="noopener"
            className="break-all text-ink underline underline-offset-2"
          >
            wa.me/{normalizeWhatsappNumber(settings.whatsappNumber)}
          </a>
        </p>
      </fieldset>

      <fieldset className="m-0 grid gap-5 border-0 border-t border-ink/12 p-0 pt-7">
        <legend className="mb-1 p-0 font-display text-[18px]">Redes</legend>

        <label className="grid gap-1.5">
          <span className={labelClass}>Instagram</span>
          <input
            name="instagramUrl"
            type="url"
            defaultValue={settings.instagramUrl}
            placeholder="https://instagram.com/estella"
            className={inputClass}
          />
        </label>

        <label className="grid gap-1.5">
          <span className={labelClass}>TikTok</span>
          <input
            name="tiktokUrl"
            type="url"
            defaultValue={settings.tiktokUrl}
            placeholder="https://tiktok.com/@estella"
            className={inputClass}
          />
        </label>
      </fieldset>

      <fieldset className="m-0 grid gap-5 border-0 border-t border-ink/12 p-0 pt-7">
        <legend className="mb-1 p-0 font-display text-[18px]">Textos de la tienda</legend>

        <label className="grid gap-1.5">
          <span className={labelClass}>Letrero deslizante (una frase por línea)</span>
          <textarea
            name="marqueeItems"
            defaultValue={settings.marqueeItems}
            required
            rows={5}
            className={inputClass}
          />
          <span className={hintClass}>
            Es la cinta que cruza la página de inicio bajo el hero.
          </span>
        </label>

        <label className="grid gap-1.5">
          <span className={labelClass}>Nota al pie de cada ficha de producto</span>
          <textarea
            name="productNote"
            defaultValue={settings.productNote}
            required
            rows={3}
            className={inputClass}
          />
          <span className={hintClass}>
            Aparece después de la referencia: envíos, empaque, series limitadas…
          </span>
        </label>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="cursor-pointer justify-self-start bg-ink px-8 py-3 text-[11px] tracking-[0.2em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold disabled:cursor-default disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Guardar ajustes"}
      </button>
    </form>
  );
}
