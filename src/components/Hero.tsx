"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Marquee } from "./Marquee";
import { Reveal } from "./Reveal";

/**
 * The wordmark sits huge, centred and in dark ink (mix-blend-multiply), so a
 * frame only works if its middle band stays light and quiet. The two photos
 * here are pre-cropped to the stage ratio (see `pattern` frames below for the
 * slot that still needs to be shot) — cropping in-browser with object-fit put
 * the subject dead centre, right under the type.
 */
const frames = [
  {
    name: "Tierras Claras",
    slot: "[ campaña — collares en capas, luz de mañana ]",
    src: "/lookbook/hero-collares.webp",
    srcMobile: "/lookbook/hero-collares-mobile.webp",
  },
  {
    name: "Niebla",
    slot: "[ campaña — pulseras apiladas, luz de tarde ]",
    src: "/lookbook/hero-manillas.webp",
    srcMobile: "/lookbook/hero-manillas-mobile.webp",
  },
  {
    name: "Isla",
    slot: "[ campaña — pulsera de cuentas, fondo menta ]",
    src: "/lookbook/hero-menta.webp",
    srcMobile: "/lookbook/hero-menta-mobile.webp",
  },
];

const AUTOPLAY_MS = 3000;
/** Menos que esto se lee como un toque, no como un gesto de deslizar. */
const SWIPE_THRESHOLD_PX = 40;

export function Hero() {
  const [frame, setFrame] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const changeFrame = (dir: number) => {
    setFrame((current) => (current + dir + frames.length) % frames.length);
  };

  // Se reinicia cada vez que cambia el frame (manual o automático), así un
  // cambio del usuario siempre le da los 3s completos antes del siguiente auto-avance.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => changeFrame(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [frame]);

  function handleTouchStart(event: React.TouchEvent) {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event: React.TouchEvent) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    // Un arrastre mayormente vertical es scroll de la página, no un swipe.
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy)) return;
    changeFrame(dx < 0 ? 1 : -1);
  }

  useEffect(() => {
    const stage = stageRef.current;
    const framesEl = framesRef.current;
    if (!stage || !framesEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.to(framesEl, {
      y: 40,
      ease: "none",
      scrollTrigger: {
        trigger: stage,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="top" className="grid gap-0 p-0">
      <div
        ref={stageRef}
        className="relative h-[min(86svh,760px)] min-h-[460px] touch-pan-y overflow-hidden bg-img-2"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div ref={framesRef} className="absolute inset-x-0 inset-y-[-9%] will-change-transform">
          {frames.map((f, index) => (
            <div
              key={f.name}
              className={`absolute inset-0 transition-opacity duration-[1100ms] ease-estella ${
                index === frame ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Art direction: the wide crop loses the piece entirely once a
                  phone's tall stage crops it, so portrait versions carry the
                  subject below md. */}
              <Image
                src={f.srcMobile}
                alt=""
                fill
                sizes="100vw"
                priority={index === 0}
                className="md:hidden"
                style={{ objectFit: "cover" }}
              />
              <Image
                src={f.src}
                alt=""
                fill
                sizes="100vw"
                priority={index === 0}
                className="hidden md:block"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>

        {/* Veil, densest exactly where the wordmark sits, plus a lift along the
            bottom for the paragraph and controls. Keeps chains and skin
            visible behind the type instead of flattening the photo. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: [
              // densest right under the wordmark
              "radial-gradient(115% 85% at 50% 46%, rgba(246,244,240,.62) 0%, rgba(246,244,240,.40) 48%, rgba(246,244,240,.16) 100%)",
              // lifts the caption block, the link and the arrows off the photo
              "linear-gradient(to top, rgba(246,244,240,.86) 0%, rgba(246,244,240,.55) 18%, rgba(246,244,240,0) 44%)",
              // lifts the navbar links and the slot label
              "linear-gradient(to bottom, rgba(246,244,240,.70) 0%, rgba(246,244,240,0) 22%)",
            ].join(", "),
          }}
        />

        <span className="absolute top-[clamp(74px,9vw,104px)] left-[clamp(14px,2.4vw,30px)] z-[1] font-mono text-[9.5px] tracking-[0.18em] text-ink/45 uppercase">
          {frames[frame].slot}
        </span>

        {/* No z-index here on purpose: it would isolate a stacking context and
            the wordmark's mix-blend-multiply would have nothing to blend with,
            rendering it a washed grey. DOM order already paints it on top. */}
        <div className="absolute inset-0 grid grid-rows-[1fr_auto_auto] gap-[clamp(26px,5vw,68px)] pt-[clamp(74px,9vw,104px)] pb-[clamp(20px,3vw,40px)] px-[clamp(14px,2.4vw,30px)]">
          <span />
          <Reveal>
            <h1 className="m-0 pointer-events-none text-center font-display text-[clamp(52px,17vw,250px)] leading-[0.84] tracking-[0.06em] text-ink uppercase mix-blend-multiply [text-indent:0.06em]">
              Estella
            </h1>
          </Reveal>

          <div className="flex flex-wrap items-end justify-between gap-[18px]">
            <Reveal className="grid max-w-[34ch] gap-[9px]">
              <span className="text-[10px] tracking-[0.3em] text-gold uppercase">
                {frames[frame].name} · Serie 2026
              </span>
              <p className="m-0 text-[clamp(13px,1.3vw,15.5px)] leading-[1.7] text-ink text-pretty">
                Accesorios de acabado espejo, hechos para llevarse todos los días.
              </p>
              <a
                href="#coleccion"
                className="mt-1 justify-self-start border-b border-ink/40 pb-1 text-[10.5px] tracking-[0.22em] uppercase transition-[border-color,letter-spacing] duration-[350ms] ease-out hover:border-gold hover:text-gold hover:tracking-[0.28em]"
              >
                Ver la colección
              </a>
            </Reveal>

            <Reveal className="flex items-center gap-3.5">
              <span className="font-mono text-[10px] tracking-[0.16em] text-ink/55">
                0{frame + 1} / 0{frames.length}
              </span>
              <button
                type="button"
                aria-label="Anterior"
                className="size-10 cursor-pointer border border-ink/16 bg-paper/70 text-[13px] text-ink transition-all duration-300 ease-out hover:border-ink hover:bg-ink hover:text-paper"
                onClick={() => changeFrame(-1)}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Siguiente"
                className="size-10 cursor-pointer border border-ink/16 bg-paper/70 text-[13px] text-ink transition-all duration-300 ease-out hover:border-ink hover:bg-ink hover:text-paper"
                onClick={() => changeFrame(1)}
              >
                →
              </button>
            </Reveal>
          </div>
        </div>
      </div>

      <Marquee />
    </section>
  );
}
