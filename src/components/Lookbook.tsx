import styles from "./Lookbook.module.css";
import { PlaceholderImage } from "./PlaceholderImage";
import { Curtain, Reveal } from "./Reveal";
import { staggerDelay } from "@/lib/stagger";

const blocks = [
  {
    span: styles.span4,
    ratio: styles.ratio43,
    tone: 1 as const,
    angle: 118,
    label: "retrato — collar en capas",
  },
  {
    span: styles.span2,
    ratio: styles.ratio23,
    tone: 3 as const,
    angle: 62,
    label: "detalle — anillo",
  },
  {
    span: styles.span2,
    ratio: styles.ratio11,
    tone: 1 as const,
    angle: 90,
    label: "aretes",
  },
  {
    span: styles.span4,
    ratio: styles.ratio1610,
    tone: 2 as const,
    angle: 152,
    label: "lifestyle — manillas apiladas",
  },
];

export function Lookbook() {
  return (
    <section id="lookbook" className={styles.section}>
      <Reveal className={styles.header}>
        <h2 className={styles.heading}>Lookbook 26</h2>
        <p className={styles.text}>
          Fotografía de temporada: luz de mañana, piezas mezcladas, sin producción de más.
        </p>
      </Reveal>
      <div className={styles.grid}>
        {blocks.map((block, index) => (
          <Curtain
            key={block.label}
            delay={staggerDelay(index)}
            className={`${block.span} ${block.ratio}`}
          >
            <PlaceholderImage
              label={block.label}
              angle={block.angle}
              spacing={11}
              tone={block.tone}
              labelPosition="bottom"
            />
          </Curtain>
        ))}
      </div>
    </section>
  );
}
