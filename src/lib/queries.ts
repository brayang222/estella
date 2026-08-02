import "server-only";
import { prisma } from "./db";

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
