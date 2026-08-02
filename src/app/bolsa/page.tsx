import type { Metadata } from "next";
import { BagList } from "@/components/BagList";
import { getProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Mi bolsa",
  description: "Las piezas que guardaste para pedir por WhatsApp.",
  robots: { index: false, follow: false },
};

/**
 * La bolsa vive en el cliente (localStorage sin sesión, cuenta con sesión), así
 * que aquí solo se cargan los productos del catálogo y el componente cliente
 * arma las filas con los slugs guardados. Eso mantiene la página estática.
 */
export default async function BolsaPage() {
  const products = await getProducts();

  return (
    <section className="grid gap-[clamp(26px,3.4vw,44px)] px-gutter pt-[clamp(120px,15vw,168px)] pb-section-y">
      <div className="grid gap-3">
        <span className="text-[10px] tracking-[0.34em] text-gold uppercase">Tu selección</span>
        <h1 className="m-0 font-display text-[clamp(28px,4.2vw,50px)] leading-[1.06] tracking-[-0.01em]">
          Mi bolsa
        </h1>
      </div>

      <BagList products={products} />
    </section>
  );
}
