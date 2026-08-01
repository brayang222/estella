import "server-only";
import { prisma } from "./db";

export function getProducts() {
  return prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
    include: { category: true },
  });
}

export function getCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}
