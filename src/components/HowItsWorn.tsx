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
    src: "/lookbook/manillas-stack-detail.webp",
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
    <section className="bg-paper-alt py-section-y px-gutter">
      <div className="grid gap-[clamp(28px,4vw,48px)]">
        <Reveal className="grid max-w-[40ch] gap-3">
          <span className="text-[10px] tracking-[0.34em] text-gold uppercase">Cómo se lleva</span>
          <h2 className="m-0 font-display text-[clamp(26px,3.8vw,50px)] leading-[1.08]">
            Tres formas de <em>combinarlas</em>
          </h2>
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-[clamp(18px,2.4vw,34px)]">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={staggerDelay(index)} className="grid gap-4">
              <div className="relative aspect-square overflow-hidden bg-img-3">
                <PlaceholderImage
                  label={step.label}
                  angle={step.angle}
                  spacing={9}
                  tone={3}
                  src={"src" in step ? step.src : undefined}
                  alt={step.label}
                />
              </div>
              <span className="text-[10px] tracking-[0.3em] text-gold">0{index + 1}</span>
              <h3 className="m-0 font-display text-[21px]">{step.title}</h3>
              <p className="m-0 text-[13px] leading-[1.8] text-muted text-pretty">{step.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
