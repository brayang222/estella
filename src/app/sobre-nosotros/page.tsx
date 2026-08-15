import type { Metadata } from "next";
import Link from "next/link";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { Curtain, Reveal } from "@/components/Reveal";
import { OG_IMAGE } from "@/lib/site";

const TITLE = "Sobre Estella";
const DESCRIPTION =
  "Quiénes somos: una marca colombiana de accesorios hechos a mano, en series cortas, con acabados en rodio y atención uno a uno por WhatsApp.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/sobre-nosotros" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/sobre-nosotros",
    type: "website",
    images: [OG_IMAGE],
  },
};

/**
 * Página propia y no un ancla de la portada. El bloque "El estudio" seguía
 * siendo /#historia, y un fragmento no es una URL: Google no puede indexarlo
 * aparte ni convertirlo en sitelink. Esto le da a la sección una dirección
 * real, que es lo que hace falta para aparecer bajo el resultado principal.
 */
export default function SobreNosotrosPage() {
  return (
    <article className="mx-auto grid max-w-[760px] gap-[clamp(32px,4vw,52px)] px-gutter pt-[clamp(120px,15vw,168px)] pb-section-y">
      <Reveal className="grid gap-3.5">
        <span className="text-[10px] tracking-[0.34em] text-gold uppercase">El estudio</span>
        <h1 className="m-0 font-display text-[clamp(30px,5vw,52px)] leading-[1.1]">
          Pocas piezas, muy bien hechas
        </h1>
      </Reveal>

      <Curtain className="aspect-video">
        <PlaceholderImage
          label="estudio — detalle de pieza"
          angle={100}
          spacing={11}
          tone={3}
          src="/lookbook/estudio-detalle.webp"
          sizes="(min-width: 800px) 760px, 100vw"
          alt="Detalle de una pieza en el estudio de Estella"
        />
      </Curtain>

      <div className="grid gap-[22px]">
        <p className="m-0 text-[16px] leading-[1.9] text-ink text-pretty">
          Estella es una marca colombiana de accesorios hechos a mano. Trabajamos por series
          cortas y numeradas: cada referencia se arma a mano, se revisa una por una y se empaca
          lista para regalar. Si una pieza se agota, no vuelve exactamente igual.
        </p>
        <p className="m-0 text-[15px] leading-[1.9] text-muted text-pretty">
          Esa forma de trabajar define lo que hacemos y lo que no. No producimos en masa ni
          sacamos cien referencias por temporada. Preferimos pocas piezas en las que podamos
          responder por el acabado, el cierre y el remate, que son los detalles donde se nota
          si algo está bien hecho o solo se ve bien en la foto.
        </p>
        <p className="m-0 text-[15px] leading-[1.9] text-muted text-pretty">
          La mayoría de nuestras piezas van bañadas en rodio: es más duro que otros acabados,
          resiste mejor el rayón y mantiene el brillo con el uso diario. Cuesta más y por eso
          lo decimos abiertamente — es la diferencia entre una pieza que dura temporadas y una
          que dura semanas.
        </p>
        <p className="m-0 text-[15px] leading-[1.9] text-muted text-pretty">
          Vendemos al detal y también al por mayor a revendedoras en varias ciudades del país.
          Todo el proceso pasa por WhatsApp, con atención uno a uno: te asesoramos con la
          talla, te mandamos fotos de la pieza real y confirmamos el envío contigo. No es un
          carrito automático, y es a propósito.
        </p>
      </div>

      <Reveal className="mt-3 grid justify-items-start gap-3.5 bg-paper-alt p-[clamp(28px,4vw,44px)]">
        <span className="text-[10px] tracking-[0.3em] text-gold uppercase">¿Empezamos?</span>
        <h2 className="m-0 font-display text-[clamp(22px,3vw,30px)]">Mira la colección</h2>
        <Link
          href="/productos"
          className="bg-ink px-[30px] py-[15px] text-[10.5px] tracking-[0.2em] text-paper uppercase transition-[background-color,transform] duration-[400ms] ease-estella hover:-translate-y-0.5 hover:bg-gold"
        >
          Ver todas las piezas
        </Link>
      </Reveal>
    </article>
  );
}
