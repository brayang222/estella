"use client";

import { useState } from "react";
import { PlaceholderImage } from "./PlaceholderImage";
import { Reveal } from "./Reveal";
import { categoryFilters, formatPrice, type Product, type ProductCategory } from "@/lib/products";
import { staggerDelay } from "@/lib/stagger";
import { waLink, waProductMessage } from "@/lib/whatsapp";

export function Collection({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<"todo" | ProductCategory>("todo");

  const visibleProducts = products.filter(
    (p) => category === "todo" || p.category === category
  );

  return (
    <section id="coleccion" className="grid gap-[clamp(26px,3.4vw,44px)] py-section-y px-gutter">
      <Reveal className="flex flex-wrap items-end justify-between gap-5">
        <div className="grid gap-3">
          <span className="text-[10px] tracking-[0.34em] text-gold uppercase">La colección</span>
          <h2 className="m-0 font-display text-[clamp(28px,4.2vw,56px)] leading-[1.06] tracking-[-0.01em]">
            Selección Estella
          </h2>
        </div>
        <div className="flex flex-wrap gap-[18px]">
          {categoryFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`cursor-pointer border-0 border-b bg-transparent py-1.5 text-[10.5px] font-light tracking-[0.2em] uppercase transition-[color,border-color] duration-300 ease-out ${
                category === f.key ? "border-ink text-ink" : "border-transparent text-muted"
              }`}
              onClick={() => setCategory(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(clamp(165px,22vw,300px),1fr))] gap-x-[clamp(10px,1.6vw,24px)] gap-y-[clamp(16px,2.2vw,34px)]">
        {visibleProducts.map((p, index) => (
          <Reveal key={p.id} delay={staggerDelay(index)} className="grid gap-3.5">
            <div className="group relative aspect-[4/5] overflow-hidden bg-img-1">
              <PlaceholderImage
                label={p.placeholderLabel}
                angle={128}
                spacing={10}
                tone={1}
                labelPosition="center"
                className="transition-transform duration-[1100ms] ease-estella group-hover:scale-[1.04]"
                src={p.image ?? undefined}
                alt={p.name}
              />
              <span className="absolute top-2.5 left-2.5 z-[1] text-[9px] tracking-[0.2em] text-muted uppercase">
                {p.tag}
              </span>
              <div className="absolute inset-x-2.5 bottom-2.5 translate-y-1.5 opacity-0 transition-[opacity,transform] duration-500 ease-estella group-hover:translate-y-0 group-hover:opacity-100">
                <a
                  href={waLink(waProductMessage(p.name, formatPrice(p.price)))}
                  target="_blank"
                  rel="noopener"
                  className="block bg-paper p-[13px] text-center text-[10px] tracking-[0.2em] text-ink uppercase transition-colors duration-300 ease-out hover:bg-ink hover:text-paper"
                >
                  Consultar pieza
                </a>
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-2.5 border-t border-ink/12 pt-0.5">
              <h3 className="mt-2 text-[11px] font-normal tracking-[0.18em] uppercase">{p.name}</h3>
              <span className="mt-2 text-[11.5px] tracking-[0.06em] text-muted whitespace-nowrap">
                {formatPrice(p.price)}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
