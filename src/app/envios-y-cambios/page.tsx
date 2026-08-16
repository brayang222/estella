import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { getSiteSettings } from "@/lib/queries";
import { OG_IMAGE } from "@/lib/site";
import { FREE_SHIPPING_FROM, formatPrice } from "@/lib/products";
import { waLink } from "@/lib/whatsapp";

const TITLE = "Envíos y cambios";
const DESCRIPTION =
  "Cómo funcionan los envíos de Estella a todo Colombia, cuándo el envío es gratis y cómo pedir un cambio o reportar una pieza con daño de fábrica.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/envios-y-cambios" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/envios-y-cambios",
    type: "website",
    images: [OG_IMAGE],
  },
};

const sectionClass =
  "grid justify-items-start gap-3 border-t border-ink/12 pt-[clamp(24px,3vw,36px)]";
const h2Class = "m-0 font-display text-[clamp(20px,2.6vw,28px)]";
const pClass = "m-0 max-w-[62ch] text-[14px] leading-[1.9] text-muted text-pretty";

export default async function EnviosYCambiosPage() {
  const settings = await getSiteSettings();

  return (
    <article className="mx-auto grid max-w-[720px] gap-[clamp(26px,3.4vw,40px)] px-gutter pt-[clamp(120px,15vw,168px)] pb-section-y">
      <Reveal className="grid gap-3.5">
        <span className="text-[10px] tracking-[0.34em] text-gold uppercase">Antes de pedir</span>
        <h1 className="m-0 font-display text-[clamp(30px,5vw,52px)] leading-[1.1]">
          Envíos y cambios
        </h1>
        <p className={pClass}>
          Enviamos a todo Colombia. Todo el proceso se confirma contigo por WhatsApp antes de
          despachar.
        </p>
      </Reveal>

      <Reveal className={sectionClass}>
        <h2 className={h2Class}>Costo del envío</h2>
        <p className={pClass}>
          El envío corre por cuenta del comprador y su valor depende de la ciudad de destino. Te
          confirmamos el costo exacto por WhatsApp antes de que pagues, nunca después.
        </p>
        <p className={pClass}>
          <strong className="font-normal text-ink">
            En compras desde {formatPrice(FREE_SHIPPING_FROM)} el envío va por nuestra cuenta.
          </strong>
        </p>
      </Reveal>

      <Reveal className={sectionClass}>
        <h2 className={h2Class}>Cambios y devoluciones</h2>
        <p className={pClass}>
          Aceptamos devoluciones dentro del derecho de retracto que da la Ley 1480 de 2011 para
          compras a distancia: cuentas con 5 días hábiles desde que recibes la pieza para
          arrepentirte, siempre que llegue en las mismas condiciones en que se envió.
        </p>
        <p className={pClass}>
          El costo del envío de vuelta corre por cuenta del comprador. Escríbenos primero por
          WhatsApp y te indicamos cómo hacer el retorno.
        </p>
      </Reveal>

      <Reveal className={sectionClass}>
        <h2 className={h2Class}>Si la pieza llega con daño</h2>
        <p className={pClass}>
          Si una pieza llega con un defecto de fábrica, avísanos lo antes posible y nos hacemos
          cargo. Mándanos fotos del detalle apenas lo notes: mientras antes lo reportes, más
          fácil es resolverlo.
        </p>
        <p className={pClass}>
          Revisa el cierre, los remates y el acabado al recibirla. Son los puntos donde un
          defecto se nota primero.
        </p>
      </Reveal>

      <Reveal className="mt-2 grid justify-items-start gap-3.5 bg-paper-alt p-[clamp(28px,4vw,44px)]">
        <span className="text-[10px] tracking-[0.3em] text-gold uppercase">¿Alguna duda?</span>
        <h2 className="m-0 font-display text-[clamp(22px,3vw,30px)]">Pregúntanos antes de pedir</h2>
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
    </article>
  );
}
