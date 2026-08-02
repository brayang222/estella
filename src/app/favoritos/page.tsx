import type { Metadata } from "next";
import { FavoritesList } from "@/components/FavoritesList";
import { getProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Mis favoritos",
  description: "Las piezas de Estella que guardaste.",
  robots: { index: false, follow: false },
};

/** Igual que /bolsa: el catálogo se carga aquí y el cliente filtra por slug. */
export default async function FavoritosPage() {
  const products = await getProducts();

  return (
    <section className="grid gap-[clamp(26px,3.4vw,44px)] px-gutter pt-[clamp(120px,15vw,168px)] pb-section-y">
      <div className="grid gap-3">
        <span className="text-[10px] tracking-[0.34em] text-gold uppercase">Tu selección</span>
        <h1 className="m-0 font-display text-[clamp(28px,4.2vw,50px)] leading-[1.06] tracking-[-0.01em]">
          Mis favoritos
        </h1>
      </div>

      <FavoritesList products={products} />
    </section>
  );
}
