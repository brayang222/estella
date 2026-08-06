import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChainBuilder } from "@/components/ChainBuilder";
import { isLocalEnv } from "@/lib/env";
import { getCustomizableProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Arma tu cadena",
  description: "Elige tu cadena y combínala con los dijes que quieras para armar un collar único.",
  alternates: { canonical: "/arma-tu-cadena" },
  openGraph: {
    title: "Arma tu cadena",
    url: "/arma-tu-cadena",
    type: "website",
  },
};

export default async function ArmaTuCadenaPage() {
  if (!isLocalEnv) notFound();

  const products = await getCustomizableProducts();
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
