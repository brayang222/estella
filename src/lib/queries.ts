import "server-only";
import { prisma } from "./db";

export function getProducts() {
  return prisma.product.findMany({ orderBy: { sortOrder: "asc" } });
}
