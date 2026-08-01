import styles from "./HowItsWorn.module.css";
import { PlaceholderImage } from "./PlaceholderImage";
import { Reveal } from "./Reveal";
import { staggerDelay } from "@/lib/stagger";

const steps = [
  {
    angle: 90,
    label: "capas de collares",
    title: "En capas",
    text: "Dos o tres largos distintos: choker, media caída y una cadena larga con dije.",
  },
  {
    angle: 45,
    label: "manillas apiladas",
    title: "Apiladas",
    text: "Mezcla grosores en la misma muñeca: una plana, una tejida, una con broche.",
  },
  {
    angle: 135,
    label: "arete solo",
    title: "Una sola pieza",
    text: "Un arete escultural y nada más. El resto del look en silencio.",
  },
];

export function HowItsWorn() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <Reveal className={styles.headingGroup}>
          <span className={styles.eyebrow}>Cómo se lleva</span>
          <h2 className={styles.heading}>
            Tres formas de <em>combinarlas</em>
          </h2>
        </Reveal>
        <div className={styles.grid}>
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={staggerDelay(index)} className={styles.item}>
              <div className={styles.image}>
                <PlaceholderImage label={step.label} angle={step.angle} spacing={9} tone={3} />
              </div>
              <span className={styles.number}>0{index + 1}</span>
              <h3 className={styles.itemTitle}>{step.title}</h3>
              <p className={styles.itemText}>{step.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
