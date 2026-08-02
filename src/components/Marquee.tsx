"use client";

import { useSiteSettings } from "@/lib/settings-context";
import { marqueeLines } from "@/lib/settings";

function Group({ items }: { items: string[] }) {
  return (
    <div className="flex gap-11 pr-11 text-[10px] tracking-[0.28em] text-muted uppercase whitespace-nowrap">
      {items.map((item) => (
        <span key={item}>
          {item} <span className="text-gold">◇</span>
        </span>
      ))}
    </div>
  );
}

/**
 * Las frases se editan en /admin/ajustes, una por línea. Lee del contexto y
 * no del servidor porque lo monta <Hero>, que es un componente de cliente.
 */
export function Marquee() {
  const items = marqueeLines(useSiteSettings());

  return (
    <div className="overflow-hidden border-y border-ink/12 py-3.5">
      <div className="flex w-max animate-marquee will-change-transform">
        <Group items={items} />
        <Group items={items} />
      </div>
    </div>
  );
}
