import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChainBuilder } from "@/components/ChainBuilder";
import { auth } from "@/auth";
import { getCustomizableProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Arma tu cadena",
  description: "Elige tu cadena y combínala con los dijes que quieras para armar un collar único.",
  // Herramienta interna mientras se prueba: fuera del índice y del sitemap.
  robots: { index: false, follow: false },
};

export default async function ArmaTuCadenaPage() {
  // 404 y no redirect: un redirect a /login le confirmaría a cualquiera que
  // esta ruta existe. Para quien no es admin, simplemente no está.
  const session = await auth();
  if (session?.user?.role !== "admin") notFound();

  // Incluye las piezas sin publicar: la página existe hoy para poder probar
  // el armador con el catálogo completo antes de abrirlo al público.
  const products = await getCustomizableProducts({ includeUnpublished: true });
  const chains = products.filter((p) => p.category.slug === "cadenas");
  const charms = products.filter((p) => p.category.slug === "dijes");

  return (
    <section className="grid gap-[clamp(26px,3.4vw,44px)] px-gutter pt-[clamp(120px,15vw,168px)] pb-section-y">
      <div className="grid gap-3">
        <span className="text-[10px] tracking-[0.34em] text-gold uppercase">Personalizado</span>
        <h1 className="m-0 font-display text-[clamp(28px,4.2vw,56px)] leading-[1.06] tracking-[-0.01em]">
          Arma tu cadena
        </h1>
        <p className="m-0 max-w-[56ch] text-[13px] leading-[1.8] text-muted text-pretty">
          Elige una cadena y combínala con los dijes que quieras. Arma tu propio collar y pídelo por
          WhatsApp o guárdalo en tu bolsa.
        </p>
      </div>

      {chains.length === 0 || charms.length === 0 ? (
        <p className="m-0 max-w-[52ch] text-[13px] leading-[1.8] text-muted">
          Todavía no hay suficientes cadenas o dijes cargados para armar collares. Vuelve pronto.
        </p>
      ) : (
        <ChainBuilder chains={chains} charms={charms} />
      )}
    </section>
  );
}
