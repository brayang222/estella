import type { Category, Prisma, ProductImage } from "@/generated/prisma/client";

export type Product = Prisma.ProductGetPayload<{ include: { category: true; images: true } }>;
export type { Category, ProductImage };

/** 189000 -> "$189.000" (COP, "." as thousands separator) */
export function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-CO")}`;
}
