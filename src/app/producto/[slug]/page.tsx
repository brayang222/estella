import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductOrderPanel } from "@/components/ProductOrderPanel";
import { Reveal } from "@/components/Reveal";
import { TransitionLink } from "@/components/TransitionLink";
import { getProductBySlug, getProducts } from "@/lib/queries";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Pieza no encontrada" };

  return {
    title: product.name,
    description: `${product.name} — pieza de la colección ${product.category.label} de Estella, joyería en rodio hecha en Colombia.`,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: {
      title: product.name,
      url: `/producto/${product.slug}`,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([getProductBySlug(slug), getProducts()]);
  if (!product) notFound();

  const index = allProducts.findIndex((p) => p.slug === product.slug);
  const previous = index > 0 ? allProducts[index - 1] : undefined;
  const next = index >= 0 && index < allProducts.length - 1 ? allProducts[index + 1] : undefined;

  return (
    <article className="grid gap-x-[clamp(40px,6vw,80px)] gap-y-[clamp(36px,5vw,56px)] pt-[clamp(120px,15vw,168px)] pb-[clamp(88px,11vw,140px)] px-gutter md:grid-cols-2 md:items-start">
      <Reveal className="flex flex-wrap items-center justify-between gap-3 md:col-span-2">
        <div className="flex flex-wrap items-center gap-2 text-[10px] tracking-[0.2em] text-muted uppercase">
          <TransitionLink href="/" className="hover:text-gold">
            Inicio
          </TransitionLink>
          <span>/</span>
          <TransitionLink href="/#coleccion" className="hover:text-gold">
            {product.category.label}
          </TransitionLink>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </div>

        <div className="flex items-center gap-4 text-[10px] tracking-[0.2em] text-muted uppercase">
          {previous && (
            <TransitionLink href={`/producto/${previous.slug}`} className="hover:text-gold">
              ← Anterior
            </TransitionLink>
          )}
          {next && (
            <TransitionLink href={`/producto/${next.slug}`} className="hover:text-gold">
              Siguiente →
            </TransitionLink>
          )}
        </div>
      </Reveal>

      <Reveal>
        <ProductGallery
          images={product.images}
          slug={product.slug}
          alt={product.name}
          tag={product.tag}
          placeholderLabel={product.placeholderLabel}
        />
      </Reveal>

      <Reveal delay={0.05}>
        <ProductOrderPanel product={product} />
      </Reveal>
    </article>
  );
}
