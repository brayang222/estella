"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";
import { Marquee } from "./Marquee";
import { Reveal } from "./Reveal";

const frames = [
  { name: "Tierras Claras", slot: "[ campaña — collar en capas, luz de mañana ]" },
  { name: "Niebla", slot: "[ campaña — manillas apiladas, fondo lino ]" },
  { name: "Isla", slot: "[ campaña — aretes, piel y sombra ]" },
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
    <section id="top" className={styles.hero}>
      <div ref={stageRef} className={styles.stage}>
        <div ref={framesRef} className={styles.frames}>
          {frames.map((f, index) => (
            <div
              key={f.name}
              className={`${styles.frame} ${styles[`frame${index}`]} ${
                index === frame ? styles.active : ""
              }`}
            />
          ))}
        </div>

        <span className={styles.frameLabel}>{frames[frame].slot}</span>

        <div className={styles.overlay}>
          <span />
          <Reveal>
            <h1 className={styles.wordmark}>Estella</h1>
          </Reveal>

          <div className={styles.bottomBar}>
            <Reveal className={styles.frameInfo}>
              <span className={styles.eyebrow}>{frames[frame].name} · Serie 2026</span>
              <p className={styles.frameText}>
                Series cortas de acabado espejo, hechas para llevarse todos los días.
              </p>
              <a href="#coleccion" className={styles.viewLink}>
                Ver la colección
              </a>
            </Reveal>

            <Reveal className={styles.frameControls}>
              <span className={styles.frameCount}>
                0{frame + 1} / 0{frames.length}
              </span>
              <button
                type="button"
                aria-label="Anterior"
                className={styles.arrowBtn}
                onClick={() => changeFrame(-1)}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Siguiente"
                className={styles.arrowBtn}
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
