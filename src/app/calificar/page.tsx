import type { Metadata } from "next";
import { MultiReviewForm } from "@/components/MultiReviewForm";
import { getCustomer } from "@/lib/account/session";
import { getProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Califica tu compra",
  description: "Cuéntanos cómo te fue con tus piezas Estella.",
  // Página de utilidad, no contenido: se llega por el enlace que se manda por
  // WhatsApp, no por búsqueda.
  robots: { index: false, follow: false },
};

type Props = {
  // Piezas del pedido, en el enlace que arma /admin/pedidos: ?piezas=a,b,c
  searchParams: Promise<{ piezas?: string }>;
};

export default async function CalificarPage({ searchParams }: Props) {
  const [{ piezas }, products, customer] = await Promise.all([
    searchParams,
    getProducts(),
    getCustomer(),
  ]);

  const pieces = products.map((product) => ({ slug: product.slug, name: product.name }));
  // Solo se preseleccionan slugs que existan y estén publicados: el parámetro
  // viene de una URL que cualquiera puede editar.
  const available = new Set(pieces.map((piece) => piece.slug));
  const preselected = (piezas?.split(",") ?? []).map((s) => s.trim()).filter((s) => available.has(s));

  return (
    <section className="mx-auto grid w-full max-w-[520px] gap-[clamp(26px,3.4vw,40px)] px-gutter pt-[clamp(120px,15vw,168px)] pb-section-y">
      <div className="grid gap-3">
        <span className="text-[10px] tracking-[0.34em] text-gold uppercase">Tu opinión</span>
        <h1 className="m-0 font-display text-[clamp(28px,4.2vw,50px)] leading-[1.06] tracking-[-0.01em]">
          Califica tu compra
        </h1>
        <p className="m-0 text-[14px] leading-[1.85] text-muted text-pretty">
          Cuéntanos cómo te fue con tus piezas. Toma menos de un minuto y le sirve muchísimo a
          quien está decidiendo.
        </p>
      </div>

      <MultiReviewForm
        pieces={pieces}
        preselected={preselected}
        defaultName={customer?.name}
      />
    </section>
  );
}
