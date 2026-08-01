import "server-only";
import { prisma } from "./db";

const PRODUCT_IMAGES_INCLUDE = { orderBy: { order: "asc" as const }, take: 4 };

export function getProducts() {
  return prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
    include: { category: true, images: PRODUCT_IMAGES_INCLUDE },
  });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true, images: PRODUCT_IMAGES_INCLUDE },
  });
}

export function getCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}
