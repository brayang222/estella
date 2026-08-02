"use client";

import { useSiteSettings } from "@/lib/settings-context";
import { waLink } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  const settings = useSiteSettings();

  return (
    <a
      href={waLink(settings.whatsappGreeting, settings.whatsappNumber)}
      target="_blank"
      rel="noopener"
      aria-label="WhatsApp"
      className="fixed right-[clamp(14px,2vw,28px)] bottom-[clamp(14px,2vw,28px)] z-[70] inline-flex items-center gap-[9px] rounded-full bg-ink px-5 py-3.5 text-[10px] tracking-[0.2em] text-paper uppercase shadow-[0_14px_34px_-18px_rgba(20,18,15,.7)] transition-[background-color,transform] duration-[350ms] ease-estella hover:-translate-y-0.5 hover:bg-gold"
    >
      <span className="size-[7px] rounded-full bg-dot-online" />
      Escríbenos
    </a>
  );
}
