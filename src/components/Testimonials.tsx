"use client";

import { useRef } from "react";
import gsap from "gsap";
import { Reveal } from "./Reveal";
import { testimonials } from "@/lib/testimonials";

export function Testimonials() {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollRail = (dir: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 20;
    const step = (card?.getBoundingClientRect().width ?? 360) + gap;
    const max = rail.scrollWidth - rail.clientWidth;
    const targetIndex = Math.round(rail.scrollLeft / step) + dir;
    const target = Math.max(0, Math.min(targetIndex * step, max));
    gsap.to(rail, { scrollLeft: target, duration: 0.46, ease: "power3.out" });
  };

  return (
    <section className="grid gap-[clamp(24px,3.2vw,40px)] bg-paper-alt py-section-y px-gutter">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="m-0 font-display text-[clamp(26px,3.8vw,50px)]">Ellas ya la llevan</h2>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Anterior"
            className="size-[42px] cursor-pointer border border-ink/20 bg-transparent text-[14px] text-ink transition-all duration-300 ease-out hover:border-ink hover:bg-ink hover:text-paper"
            onClick={() => scrollRail(-1)}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            className="size-[42px] cursor-pointer border border-ink/20 bg-transparent text-[14px] text-ink transition-all duration-300 ease-out hover:border-ink hover:bg-ink hover:text-paper"
            onClick={() => scrollRail(1)}
          >
            →
          </button>
        </div>
      </Reveal>

      <div
        ref={railRef}
        className="flex snap-x snap-proximity gap-[clamp(12px,1.6vw,24px)] overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="m-0 grid flex-[0_0_min(86vw,400px)] snap-start gap-[22px] bg-paper p-[clamp(22px,2.6vw,34px)]"
          >
            <span className="text-[10px] tracking-[0.3em] text-gold">{t.stars}</span>
            <blockquote className="m-0 font-display text-[clamp(16px,1.7vw,21px)] leading-[1.55] text-pretty">
              {t.quote}
            </blockquote>
            <figcaption className="flex items-baseline gap-2.5 border-t border-ink/12 pt-3.5 text-[10px] tracking-[0.2em] text-muted uppercase">
              <span className="text-ink">{t.name}</span>
              <span>·</span>
              <span>{t.city}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
