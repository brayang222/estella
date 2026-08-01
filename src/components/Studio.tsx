import styles from "./Studio.module.css";
import { PlaceholderImage } from "./PlaceholderImage";
import { Curtain, Reveal } from "./Reveal";
import { staggerDelay } from "@/lib/stagger";
import { WA_GENERAL_MESSAGE, waLink } from "@/lib/whatsapp";

const stats = [
  { value: "36", label: "Referencias activas" },
  { value: "48h", label: "Despacho promedio" },
  { value: "1.2k", label: "Clientas en el país" },
];

export function Studio() {
  return (
    <section id="historia" className={styles.section}>
      <div className={styles.grid}>
        <Curtain className={styles.image}>
          <PlaceholderImage
            label="estudio — manos armando una pieza"
            angle={100}
            spacing={11}
            tone={3}
          />
        </Curtain>
        <div className={styles.text}>
          <Reveal>
            <span className={styles.eyebrow}>El estudio</span>
          </Reveal>
          <Reveal delay={staggerDelay(1)}>
            <h2 className={styles.heading}>
              Pocas piezas,
              <br />
              muy bien hechas
            </h2>
          </Reveal>
          <Reveal delay={staggerDelay(2)}>
            <p className={styles.paragraph}>
              Trabajamos por series cortas y numeradas. Cada referencia se arma a mano, se
              revisa una por una y se empaca lista para regalar. Si una pieza se agota, no
              vuelve exactamente igual.
            </p>
          </Reveal>
          <Reveal delay={staggerDelay(3)} className={styles.stats}>
            {stats.map((stat) => (
              <span key={stat.label} className={styles.stat}>
                <strong className={styles.statValue}>{stat.value}</strong>
                <span className={styles.statLabel}>{stat.label}</span>
              </span>
            ))}
          </Reveal>
          <Reveal delay={staggerDelay(4)}>
            <a
              href={waLink(WA_GENERAL_MESSAGE)}
              target="_blank"
              rel="noopener"
              className={styles.link}
            >
              Hablar con el estudio
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
