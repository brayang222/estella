import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductsGrid } from "@/components/ProductsGrid";
import { ProductsJsonLd } from "@/components/JsonLd";
import { catalogCategories, getCategories, getProducts, inCatalog } from "@/lib/queries";

type Props = {
  params: Promise<{ categoria: string }>;
};

/**
 * Cada categoría con URL propia (/productos/manillas) en vez de solo un
 * parámetro. "manillas", "collares", "anillos" y "aretes" son las búsquedas
 * que queremos ganar, y una sola página no puede posicionar para las cuatro:
 * Google necesita una URL por término, con su propio título y encabezado.
 */
export async function generateStaticParams() {
  const categories = catalogCategories(await getCategories());
  return categories.map((category) => ({ categoria: category.slug }));
}

async function findCategory(slug: string) {
  return catalogCategories(await getCategories()).find((category) => category.slug === slug);
}

/**
 * Texto de apoyo por categoría — sin esto todas dirían lo mismo y competirían
 * entre sí. Ojo con el género: las etiquetas mezclan femenino ("Manillas") y
 * masculino ("Collares"), así que nada que las acompañe puede concordar
 * ("hechos a mano" daría "Manillas hechos a mano"). De ahí "artesanales",
 * igual en ambos géneros, y que el resto hable de "cada pieza".
 */
function introFor(label: string) {
  return `${label} artesanales de Estella. Cada pieza se arma a mano, una por una, con acabados que aguantan el uso diario. Envíos a todo Colombia y asesoría por WhatsApp.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const category = await findCategory(categoria);
  if (!category) return { title: "Categoría no encontrada" };

  // "artesanales" y no "hechos a mano": las etiquetas mezclan géneros y el
  // adjetivo tendría que concordar. Ver introFor.
  const title = `${category.label} artesanales en Colombia`;
  const description = introFor(category.label);

  return {
    title,
    description,
    alternates: { canonical: `/productos/${category.slug}` },
    openGraph: {
      title,
      description,
      url: `/productos/${category.slug}`,
      type: "website",
    },
  };
}

export default async function CategoriaPage({ params }: Props) {
  const { categoria } = await params;
  const [category, allProducts, allCategories] = await Promise.all([
    findCategory(categoria),
    getProducts(),
    getCategories(),
  ]);
  if (!category) notFound();

  const products = inCatalog(allProducts);

  return (
    <>
      <ProductsJsonLd products={products.filter((p) => p.category.slug === category.slug)} />
      <ProductsGrid
        products={products}
        categories={catalogCategories(allCategories)}
        category={category.slug}
        heading={category.label}
        intro={introFor(category.label)}
      />
    </>
  );
}
