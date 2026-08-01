"use client";

import { useRef } from "react";
import gsap from "gsap";
import styles from "./Testimonials.module.css";
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
    <section className={styles.section}>
      <Reveal className={styles.header}>
        <h2 className={styles.heading}>Ellas ya la llevan</h2>
        <div className={styles.arrows}>
          <button
            type="button"
            aria-label="Anterior"
            className={styles.arrowBtn}
            onClick={() => scrollRail(-1)}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            className={styles.arrowBtn}
            onClick={() => scrollRail(1)}
          >
            →
          </button>
        </div>
      </Reveal>

      <div ref={railRef} className={styles.rail}>
        {testimonials.map((t) => (
          <figure key={t.name} className={styles.card}>
            <span className={styles.stars}>{t.stars}</span>
            <blockquote className={styles.quote}>{t.quote}</blockquote>
            <figcaption className={styles.caption}>
              <span className={styles.captionName}>{t.name}</span>
              <span>·</span>
              <span>{t.city}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
