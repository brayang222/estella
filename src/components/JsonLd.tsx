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
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        sameAs: [settings.instagramUrl, settings.tiktokUrl],
        telephone: `+${settings.whatsappNumber}`,
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

export function ProductJsonLd({ product }: { product: Product }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
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
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/producto/${product.slug}`,
        },
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
