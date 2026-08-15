import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProductsGrid } from "@/components/ProductsGrid";
import { ProductsJsonLd } from "@/components/JsonLd";
import { catalogCategories, getCategories, getProducts, inCatalog } from "@/lib/queries";
import { OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Todas las piezas",
  description:
    "Catálogo completo de Estella: accesorios hechos a mano en Colombia — manillas, collares, anillos y aretes.",
  alternates: { canonical: "/productos" },
  openGraph: {
    title: "Todas las piezas",
    url: "/productos",
    type: "website",
    images: [OG_IMAGE],
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

  // Los enlaces viejos (?categoria=collares) van a su página propia en vez de
  // servir el mismo contenido en dos URLs, que es lo que divide las señales.
  if (categoria && categories.some((c) => c.slug === categoria)) {
    redirect(`/productos/${categoria}`);
  }

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
