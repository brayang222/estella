import type { Metadata } from "next";
import { ProductsGrid } from "@/components/ProductsGrid";
import { ProductsJsonLd } from "@/components/JsonLd";
import { catalogCategories, getCategories, getProducts, inCatalog } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Todas las piezas",
  description:
    "Catálogo completo de Estella: accesorios hechos a mano en Colombia — manillas, collares, anillos y aretes.",
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
  const [{ categoria }, allProducts, allCategories] = await Promise.all([
    searchParams,
    getProducts(),
    getCategories(),
  ]);
  const products = inCatalog(allProducts);
  const categories = catalogCategories(allCategories);

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
