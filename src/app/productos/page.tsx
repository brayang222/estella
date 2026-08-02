import type { Metadata } from "next";
import { ProductsGrid } from "@/components/ProductsGrid";
import { ProductsJsonLd } from "@/components/JsonLd";
import { getCategories, getProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Todas las piezas",
  description:
    "Catálogo completo de Estella: manillas, collares, anillos y aretes en series cortas y numeradas, hechos a mano en Colombia.",
  alternates: { canonical: "/productos" },
  openGraph: {
    title: "Todas las piezas",
    url: "/productos",
    type: "website",
  },
};

type Props = {
  searchParams: Promise<{ categoria?: string }>;
};

export default async function ProductosPage({ searchParams }: Props) {
  const [{ categoria }, products, categories] = await Promise.all([
    searchParams,
    getProducts(),
    getCategories(),
  ]);

  const isKnownCategory = categories.some((c) => c.slug === categoria);

  return (
    <>
      <ProductsJsonLd products={products} />
      <ProductsGrid
        products={products}
        categories={categories}
        initialCategory={isKnownCategory ? categoria! : "todo"}
      />
    </>
  );
}
