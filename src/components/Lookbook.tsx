import { PlaceholderImage } from "./PlaceholderImage";
import { Curtain, Reveal } from "./Reveal";
import { staggerDelay } from "@/lib/stagger";

const blocks = [
  {
    span: "col-span-4",
    ratio: "aspect-[2/1]",
    tone: 1 as const,
    angle: 118,
    label: "collares — variedad de dijes",
    src: "/lookbook/collares-variedad.webp",
    // toca a la derecha con B y abajo con C/D
    // touchBorder: "border-r-2 border-b-2 border-black",
  },
  {
    span: "col-span-2",
    ratio: "aspect-square",
    tone: 3 as const,
    angle: 62,
    label: "dije — pareja alas de ángel",
    src: "/lookbook/pareja-alas.webp",
    // toca a la izquierda con A y abajo con D
    // touchBorder: "border-l-2 border-b-2 border-black",
  },
  {
    span: "col-span-2",
    ratio: "aspect-square",
    tone: 1 as const,
    angle: 90,
    label: "detalle — medallón",
    src: "/lookbook/medallon-detalle.webp",
    // toca arriba con A y a la derecha con D
    // touchBorder: "border-t-2 border-r-2 border-black",
  },
  {
    span: "col-span-4",
    ratio: "aspect-[2/1]",
    tone: 2 as const,
    angle: 152,
    label: "lifestyle — manillas apiladas",
    src: "/lookbook/manillas-stack-wide.webp",
    // toca arriba con A/B y a la izquierda con C
    // touchBorder: "border-t-2 border-l-2 border-black",
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
            className={`${block.span} ${block.ratio} `}
          >
            <PlaceholderImage
              label={block.label}
              angle={block.angle}
              spacing={11}
              tone={block.tone}
              labelPosition="bottom"
              src={block.src}
              alt={block.label}
              sizes={block.span === "col-span-4" ? "67vw" : "34vw"}
            />
          </Curtain>
        ))}
      </div>
    </section>
  );
}
