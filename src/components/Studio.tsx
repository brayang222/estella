import { PlaceholderImage } from "./PlaceholderImage";
import { Curtain, Reveal } from "./Reveal";
import { staggerDelay } from "@/lib/stagger";
import { countPublishedProducts, getSiteSettings } from "@/lib/queries";
import { waLink } from "@/lib/whatsapp";

/**
 * "Referencias activas" ya no es un número escrito a mano: se cuenta del
 * catálogo. Decía 36 con 13 piezas publicadas, y es una cifra que una clienta
 * puede desmentir sola contando la colección.
 *
 * Los otros dos siguen fijos porque no hay de dónde calcularlos. Si no
 * corresponden a la realidad, hay que corregirlos o quitarlos — son
 * afirmaciones públicas de la marca.
 */
const stats = [
  { value: "48h", label: "Despacho promedio" },
  { value: "1.2k", label: "Clientas en el país" },
];

export async function Studio() {
  const [settings, activeReferences] = await Promise.all([
    getSiteSettings(),
    countPublishedProducts(),
  ]);
  const allStats = [{ value: String(activeReferences), label: "Referencias activas" }, ...stats];

  return (
    <section id="historia" className="border-t border-ink/12 py-section-y px-gutter">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-center gap-[clamp(24px,4vw,60px)]">
        <Curtain className="aspect-[6/6]">
          <PlaceholderImage
            label="estudio — detalle de pieza"
            angle={100}
            spacing={11}
            tone={3}
            src="/lookbook/estudio-detalle.webp"
            alt="estudio — detalle de pieza"
            sizes="(min-width: 660px) 50vw, 100vw"
          />
        </Curtain>
        <div className="grid gap-[clamp(18px,2.4vw,28px)]">
          <Reveal>
            <span className="text-[10px] tracking-[0.34em] text-gold uppercase">El estudio</span>
          </Reveal>
          <Reveal delay={staggerDelay(1)}>
            <h2 className="m-0 font-display text-[clamp(26px,3.8vw,50px)] leading-[1.1]">
              Pocas piezas,
              <br />
              muy bien hechas
            </h2>
          </Reveal>
          <Reveal delay={staggerDelay(2)}>
            <p className="m-0 max-w-[42ch] text-[13.5px] leading-[1.9] text-muted text-pretty">
              Trabajamos por series cortas y numeradas. Cada referencia se arma a mano, se
              revisa una por una y se empaca lista para regalar. Si una pieza se agota, no
              vuelve exactamente igual.
            </p>
          </Reveal>
          <Reveal
            delay={staggerDelay(3)}
            className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-5 border-t border-ink/12 pt-1.5"
          >
            {allStats.map((stat) => (
              <span key={stat.label} className="grid gap-1.5 pt-3.5">
                <strong className="font-display text-[30px] font-normal">{stat.value}</strong>
                <span className="text-[9.5px] tracking-[0.2em] text-muted uppercase">
                  {stat.label}
                </span>
              </span>
            ))}
          </Reveal>
          <Reveal delay={staggerDelay(4)}>
            <a
              href={waLink(settings.whatsappGreeting, settings.whatsappNumber)}
              target="_blank"
              rel="noopener"
              className="justify-self-start border-b border-ink/30 pb-1 text-[10.5px] tracking-[0.22em] uppercase transition-[border-color] duration-[350ms] ease-out hover:border-gold hover:text-gold"
            >
              Hablar con el estudio
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
