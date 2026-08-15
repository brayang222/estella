import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog";
import { isLocalEnv } from "@/lib/env";
import { catalogCategories, getCategories, getProducts, inCatalog } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = inCatalog(await getProducts());
  const categories = catalogCategories(await getCategories());

  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/productos`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Justo debajo de /productos: son las páginas que apuntan a "manillas",
    // "collares", etc., las búsquedas que queremos ganar.
    ...categories.map((category) => ({
      url: `${SITE_URL}/productos/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/sobre-nosotros`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contacto`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // Todavía no lista para clientes reales — ver src/lib/env.ts.
    ...(isLocalEnv
      ? [{ url: `${SITE_URL}/arma-tu-cadena`, changeFrequency: "monthly" as const, priority: 0.7 }]
      : []),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...products.map((product) => ({
      url: `${SITE_URL}/producto/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
