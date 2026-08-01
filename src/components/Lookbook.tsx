import { PlaceholderImage } from "./PlaceholderImage";
import { Curtain, Reveal } from "./Reveal";
import { staggerDelay } from "@/lib/stagger";

const blocks = [
  {
    span: "col-span-4",
    ratio: "aspect-[4/3]",
    tone: 1 as const,
    angle: 118,
    label: "retrato — collar en capas",
  },
  {
    span: "col-span-2",
    ratio: "aspect-[2/3]",
    tone: 3 as const,
    angle: 62,
    label: "detalle — anillo",
  },
  {
    span: "col-span-2",
    ratio: "aspect-square",
    tone: 1 as const,
    angle: 90,
    label: "aretes",
  },
  {
    span: "col-span-4",
    ratio: "aspect-[16/10]",
    tone: 2 as const,
    angle: 152,
    label: "lifestyle — manillas apiladas",
  },
];

export function Lookbook() {
  return (
    <section id="lookbook" className="grid gap-[clamp(24px,3.4vw,44px)] py-section-y px-gutter">
      <Reveal className="flex flex-wrap items-end justify-between gap-[18px]">
        <h2 className="m-0 font-display text-[clamp(28px,4.2vw,56px)] leading-[1.04]">
          Lookbook 26
        </h2>
        <p className="m-0 max-w-[30ch] text-[13px] leading-[1.85] text-muted text-pretty">
          Fotografía de temporada: luz de mañana, piezas mezcladas, sin producción de más.
        </p>
      </Reveal>
      <div className="grid grid-cols-6 gap-[clamp(8px,1.2vw,16px)]">
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
