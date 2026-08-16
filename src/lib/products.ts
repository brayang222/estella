import type { Category, Prisma, ProductImage } from "@/generated/prisma/client";

export type Product = Prisma.ProductGetPayload<{
  include: { category: true; images: true; _count: { select: { favorites: true } } };
}>;
export type { Category, ProductImage };

/** 189000 -> "$189.000" (COP, "." as thousands separator) */
export function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-CO")}`;
}

/**
 * Prueba social honesta: por debajo de este número, mostrar el conteo real se
 * ve débil ("1 persona lo guardó") en vez de convincente, así que el badge
 * simplemente no aparece hasta que el número diga algo por sí solo.
 */
export const SOCIAL_PROOF_THRESHOLD = 3;

/** A partir de cuántas unidades restantes se muestra el aviso de urgencia. */
export const LOW_STOCK_THRESHOLD = 5;
