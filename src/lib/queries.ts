import "server-only";
import { cache } from "react";
import { prisma } from "./db";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "./settings";

const PRODUCT_IMAGES_INCLUDE = { orderBy: { order: "asc" as const }, take: 4 };

/** Everything a ProductCard/gallery needs. Matches the `Product` type in lib/products.ts. */
export const PRODUCT_INCLUDE = { category: true, images: PRODUCT_IMAGES_INCLUDE };

export function getProducts() {
  return prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
    include: PRODUCT_INCLUDE,
  });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: PRODUCT_INCLUDE,
  });
}

export function getCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}

/**
 * Ajustes del sitio, con los valores del código como respaldo. Nunca lanza:
 * una tienda sin número de WhatsApp configurado sigue mostrando el que traía
 * el código, en vez de romper todas las páginas.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { id: "default" } });
    if (!row) return DEFAULT_SITE_SETTINGS;
    return {
      whatsappNumber: row.whatsappNumber || DEFAULT_SITE_SETTINGS.whatsappNumber,
      whatsappGreeting: row.whatsappGreeting || DEFAULT_SITE_SETTINGS.whatsappGreeting,
      instagramUrl: row.instagramUrl || DEFAULT_SITE_SETTINGS.instagramUrl,
      tiktokUrl: row.tiktokUrl || DEFAULT_SITE_SETTINGS.tiktokUrl,
      marqueeItems: row.marqueeItems || DEFAULT_SITE_SETTINGS.marqueeItems,
      productNote: row.productNote || DEFAULT_SITE_SETTINGS.productNote,
    };
  } catch (error) {
    // Se avisa en el log: caer a los valores por defecto sin decir nada
    // parece "los ajustes no se guardaron" y manda a buscar el bug al lado
    // equivocado.
    console.error("No se pudieron leer los ajustes del sitio:", error);
    return DEFAULT_SITE_SETTINGS;
  }
});
