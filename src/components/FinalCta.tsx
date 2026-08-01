import styles from "./FinalCta.module.css";
import { Reveal } from "./Reveal";
import { staggerDelay } from "@/lib/stagger";
import { WA_GENERAL_MESSAGE, waLink } from "@/lib/whatsapp";

export function FinalCta() {
  return (
    <section className={styles.section}>
      <Reveal>
        <span className={styles.eyebrow}>Asesoría personalizada</span>
      </Reveal>
      <Reveal delay={staggerDelay(1)}>
        <h2 className={styles.heading}>
          ¿Lista para <em>brillar</em>?
        </h2>
      </Reveal>
      <Reveal delay={staggerDelay(2)}>
        <p className={styles.text}>
          Cuéntanos qué buscas y te enviamos fotos reales, disponibilidad y opciones de envío
          el mismo día.
        </p>
      </Reveal>
      <Reveal delay={staggerDelay(3)}>
        <a
          href={waLink(WA_GENERAL_MESSAGE)}
          target="_blank"
          rel="noopener"
          className={styles.cta}
        >
          Escribir por WhatsApp
        </a>
      </Reveal>
      <Reveal delay={staggerDelay(4)} className={styles.social}>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener"
          className={styles.socialLink}
        >
          Instagram
        </a>
        <a href="https://tiktok.com" target="_blank" rel="noopener" className={styles.socialLink}>
          TikTok
        </a>
      </Reveal>
    </section>
  );
}
