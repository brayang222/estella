import type { Product } from "@/lib/products";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { getSiteSettings } from "@/lib/queries";
import type { BlogPost } from "@/lib/blog";

function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Structured data from constant, developer-controlled objects (never user input).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export async function OrganizationJsonLd() {
  const settings = await getSiteSettings();

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        // OnlineStore (subtipo de Organization) en vez de Organization a secas:
        // le dice a Google que esto es una tienda, no una entidad genérica —
        // "estella" solo es un nombre muy disputado (ciudad, videojuego,
        // nombre de pila), así que cada señal de qué somos cuenta.
        "@type": "OnlineStore",
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo/estella-lockup.svg`,
        description: SITE_DESCRIPTION,
        sameAs: [settings.instagramUrl, settings.tiktokUrl],
        telephone: `+${settings.whatsappNumber}`,
        areaServed: { "@type": "Country", name: "Colombia" },
      }}
    />
  );
}

export function ProductsJsonLd({ products }: { products: Product[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Product",
            name: product.name,
            category: product.category.label,
            sku: product.referenceCode,
            brand: { "@type": "Brand", name: SITE_NAME },
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "COP",
              availability: product.available
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            },
          },
        })),
      }}
    />
  );
}

export function ProductJsonLd({
  product,
  reviews,
}: {
  product: Product;
  reviews: { average: number | null; count: number };
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        // Solo cuando hay reseñas de verdad: un aggregateRating con 0 votos
        // es dato estructurado inválido y Google lo penaliza en vez de
        // mostrar estrellas.
        ...(reviews.count > 0 && reviews.average !== null
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: Number(reviews.average.toFixed(1)),
                reviewCount: reviews.count,
                bestRating: 5,
                worstRating: 1,
              },
            }
          : {}),
        description: product.description,
        category: product.category.label,
        sku: product.referenceCode,
        brand: { "@type": "Brand", name: SITE_NAME },
        image: product.images.map((image) => `${SITE_URL}${image.url}`),
        url: `${SITE_URL}/producto/${product.slug}`,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "COP",
          availability: product.available
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: `${SITE_URL}/producto/${product.slug}`,
        },
      }}
    />
  );
}

/**
 * Migas de la ficha de producto. Google las usa para mostrar la ruta
 * ("Estella › Manillas › …") en vez de la URL cruda en los resultados. Debe
 * coincidir con las migas visibles de la página — por eso la categoría apunta
 * al catálogo filtrado y no al ancla del inicio.
 */
export function ProductBreadcrumbJsonLd({ product }: { product: Product }) {
  const crumbs = [
    { name: "Inicio", url: SITE_URL },
    { name: product.category.label, url: `${SITE_URL}/productos/${product.category.slug}` },
    { name: product.name, url: `${SITE_URL}/producto/${product.slug}` },
  ];

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      }}
    />
  );
}

export function BlogPostingJsonLd({ post }: { post: BlogPost }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        author: { "@type": "Organization", name: SITE_NAME },
        publisher: { "@type": "Organization", name: SITE_NAME },
        mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
      }}
    />
  );
}
