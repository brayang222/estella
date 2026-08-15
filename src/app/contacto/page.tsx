import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { getSiteSettings } from "@/lib/queries";
import { OG_IMAGE } from "@/lib/site";
import { waLink } from "@/lib/whatsapp";

const TITLE = "Contacto";
const DESCRIPTION =
  "Escríbenos por WhatsApp para pedir, resolver dudas de talla o preguntar por venta al por mayor. Atención uno a uno y envíos a todo Colombia.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contacto" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/contacto",
    type: "website",
    images: [OG_IMAGE],
  },
};

/** Página propia por el mismo motivo que /sobre-nosotros: una URL indexable. */
export default async function ContactoPage() {
  const settings = await getSiteSettings();

  return (
    <section className="mx-auto grid max-w-[680px] gap-[clamp(30px,4vw,48px)] px-gutter pt-[clamp(120px,15vw,168px)] pb-section-y">
      <Reveal className="grid gap-3.5">
        <span className="text-[10px] tracking-[0.34em] text-gold uppercase">Hablemos</span>
        <h1 className="m-0 font-display text-[clamp(30px,5vw,52px)] leading-[1.1]">Contacto</h1>
        <p className="m-0 max-w-[52ch] text-[14px] leading-[1.85] text-muted text-pretty">
          Todo pasa por WhatsApp, con atención uno a uno. Te asesoramos con la talla, te
          mandamos fotos de la pieza real y confirmamos el envío contigo.
        </p>
      </Reveal>

      <Reveal className="grid justify-items-start gap-4 border border-ink/12 p-[clamp(24px,3.4vw,40px)]">
        <h2 className="m-0 font-display text-[clamp(20px,2.6vw,28px)]">Pedidos y asesoría</h2>
        <p className="m-0 text-[13.5px] leading-[1.85] text-muted text-pretty">
          Cuéntanos qué pieza te interesa o qué estás buscando y te respondemos con
          disponibilidad, medidas y tiempos de envío.
        </p>
        <a
          href={waLink(settings.whatsappGreeting, settings.whatsappNumber)}
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2.5 bg-ink px-[30px] py-[15px] text-[10.5px] tracking-[0.2em] text-paper uppercase transition-[background-color,transform] duration-[400ms] ease-estella hover:-translate-y-0.5 hover:bg-gold"
        >
          <WhatsAppIcon className="size-4" />
          Escribir por WhatsApp
        </a>
      </Reveal>

      <Reveal className="grid justify-items-start gap-4 border border-ink/12 p-[clamp(24px,3.4vw,40px)]">
        <h2 className="m-0 font-display text-[clamp(20px,2.6vw,28px)]">Venta al por mayor</h2>
        <p className="m-0 text-[13.5px] leading-[1.85] text-muted text-pretty">
          Trabajamos con revendedoras en varias ciudades del país. Las condiciones dependen del
          volumen y de la mezcla de piezas, así que escríbenos con lo que te interesa y armamos
          una propuesta concreta.
        </p>
        <Link
          href="/blog/accesorios-al-por-mayor-colombia"
          className="border-b border-ink/40 pb-1 text-[10.5px] tracking-[0.22em] uppercase transition-[border-color] duration-[350ms] ease-out hover:border-gold hover:text-gold"
        >
          Qué preguntar antes de elegir proveedor →
        </Link>
      </Reveal>

      <Reveal className="grid gap-2">
        <h2 className="m-0 font-display text-[clamp(20px,2.6vw,28px)]">Síguenos</h2>
        <a
          href={settings.instagramUrl}
          target="_blank"
          rel="noopener"
          className="justify-self-start border-b border-ink/40 pb-1 text-[10.5px] tracking-[0.22em] uppercase transition-[border-color] duration-[350ms] ease-out hover:border-gold hover:text-gold"
        >
          Instagram
        </a>
      </Reveal>
    </section>
  );
}
