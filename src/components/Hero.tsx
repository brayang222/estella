"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Marquee } from "./Marquee";
import { Reveal } from "./Reveal";

const frames = [
  { name: "Tierras Claras", slot: "[ campaña — collar en capas, luz de mañana ]" },
  { name: "Niebla", slot: "[ campaña — manillas apiladas, fondo lino ]" },
  { name: "Isla", slot: "[ campaña — aretes, piel y sombra ]" },
];

const frameBackgrounds: React.CSSProperties[] = [
  {
    backgroundColor: "var(--color-img-2)",
    backgroundImage:
      "repeating-linear-gradient(108deg, rgba(20,18,15,.075) 0 1px, rgba(20,18,15,0) 1px 12px)",
  },
  {
    backgroundColor: "#e4dcd1",
    backgroundImage:
      "repeating-linear-gradient(58deg, rgba(20,18,15,.075) 0 1px, rgba(20,18,15,0) 1px 12px)",
  },
  {
    backgroundColor: "var(--color-img-1)",
    backgroundImage:
      "repeating-linear-gradient(150deg, rgba(20,18,15,.075) 0 1px, rgba(20,18,15,0) 1px 12px)",
  },
];

export function Hero() {
  const [frame, setFrame] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLDivElement>(null);

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

  const changeFrame = (dir: number) => {
    setFrame((current) => (current + dir + frames.length) % frames.length);
  };

  return (
    <section id="top" className="grid gap-0 p-0">
      <div ref={stageRef} className="relative h-[min(86svh,760px)] min-h-[460px] overflow-hidden bg-img-2">
        <div ref={framesRef} className="absolute inset-x-0 inset-y-[-9%] will-change-transform">
          {frames.map((f, index) => (
            <div
              key={f.name}
              className={`absolute inset-0 transition-opacity duration-[1100ms] ease-estella ${
                index === frame ? "opacity-100" : "opacity-0"
              }`}
              style={frameBackgrounds[index]}
            />
          ))}
        </div>

        <span className="absolute top-[clamp(74px,9vw,104px)] left-[clamp(14px,2.4vw,30px)] z-[1] font-mono text-[9.5px] tracking-[0.18em] text-ink/45 uppercase">
          {frames[frame].slot}
        </span>

        <div className="absolute inset-0 z-[1] grid grid-rows-[1fr_auto_auto] gap-[clamp(26px,5vw,68px)] pt-[clamp(74px,9vw,104px)] pb-[clamp(20px,3vw,40px)] px-[clamp(14px,2.4vw,30px)]">
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
                Series cortas de acabado espejo, hechas para llevarse todos los días.
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
