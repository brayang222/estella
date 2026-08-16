import type { Metadata } from "next";
import { ProductsGrid } from "@/components/ProductsGrid";
import { ProductsJsonLd } from "@/components/JsonLd";
import { catalogCategories, getCategories, getProducts, inCatalog } from "@/lib/queries";
import { OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Todas las piezas",
  description:
    "Catálogo completo de Estella: accesorios hechos a mano en Colombia — pulseras, collares, anillos y aretes.",
  alternates: { canonical: "/productos" },
  openGraph: {
    title: "Todas las piezas",
    url: "/productos",
    type: "website",
    images: [OG_IMAGE],
  },
};

export default async function ProductosPage() {
  const [allProducts, allCategories] = await Promise.all([getProducts(), getCategories()]);
  const products = inCatalog(allProducts);
  const categories = catalogCategories(allCategories);

  return (
    <>
      <ProductsJsonLd products={products} />
      <ProductsGrid
        products={products}
        categories={categories}
        category="todo"
        heading="Todas las piezas"
      />
    </>
  );
}
