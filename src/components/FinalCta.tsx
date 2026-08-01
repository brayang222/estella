import { Reveal } from "./Reveal";
import { staggerDelay } from "@/lib/stagger";
import { SOCIAL_LINKS } from "@/lib/site";
import { WA_GENERAL_MESSAGE, waLink } from "@/lib/whatsapp";

export function FinalCta() {
  return (
    <section className="grid justify-items-center gap-6 py-[clamp(72px,10vw,140px)] px-gutter text-center">
      <Reveal>
        <span className="text-[10px] tracking-[0.34em] text-gold uppercase">
          Asesoría personalizada
        </span>
      </Reveal>
      <Reveal delay={staggerDelay(1)}>
        <h2 className="m-0 max-w-[20ch] font-display text-[clamp(34px,6vw,84px)] leading-[1.02]">
          ¿Lista para <em>brillar</em>?
        </h2>
      </Reveal>
      <Reveal delay={staggerDelay(2)}>
        <p className="m-0 max-w-[42ch] text-[13.5px] leading-[1.85] text-muted text-pretty">
          Cuéntanos qué buscas y te enviamos fotos reales, disponibilidad y opciones de envío
          el mismo día.
        </p>
      </Reveal>
      <Reveal delay={staggerDelay(3)}>
        <a
          href={waLink(WA_GENERAL_MESSAGE)}
          target="_blank"
          rel="noopener"
          className="mt-1.5 bg-ink px-[42px] py-[19px] text-[11px] tracking-[0.22em] text-paper uppercase transition-[background-color,transform] duration-[400ms] ease-estella hover:-translate-y-0.5 hover:bg-gold"
        >
          Escribir por WhatsApp
        </a>
      </Reveal>
      <Reveal delay={staggerDelay(4)} className="mt-1.5 flex gap-[22px]">
        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener"
          className="text-[10px] tracking-[0.2em] text-muted uppercase hover:text-gold"
        >
          Instagram
        </a>
        <a
          href={SOCIAL_LINKS.tiktok}
          target="_blank"
          rel="noopener"
          className="text-[10px] tracking-[0.2em] text-muted uppercase hover:text-gold"
        >
          TikTok
        </a>
      </Reveal>
    </section>
  );
}
