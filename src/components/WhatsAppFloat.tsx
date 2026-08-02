"use client";

import { useSiteSettings } from "@/lib/settings-context";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { waLink } from "@/lib/whatsapp";

/**
 * En /producto/[slug] y /bolsa el móvil ya trae su propia barra fija de
 * compra (ver ProductOrderPanel/BagList) — este botón se aparta ahí para no
 * competir con ella, pero sigue visible en desktop, donde no hay tal barra.
 */
export function WhatsAppFloat({ hiddenOnMobile = false }: { hiddenOnMobile?: boolean }) {
  const settings = useSiteSettings();

  return (
    <a
      href={waLink(settings.whatsappGreeting, settings.whatsappNumber)}
      target="_blank"
      rel="noopener"
      aria-label="Escríbenos por WhatsApp"
      className={`fixed right-[clamp(14px,2vw,28px)] bottom-[clamp(14px,2vw,28px)] z-[70] size-14 items-center justify-center rounded-full bg-ink text-gold shadow-[0_14px_34px_-18px_rgba(20,18,15,.7)] transition-transform duration-[350ms] ease-estella hover:-translate-y-0.5 ${
        hiddenOnMobile ? "hidden md:flex" : "flex"
      }`}
    >
      <WhatsAppIcon className="size-6 text-white" />
    </a>
  );
}
