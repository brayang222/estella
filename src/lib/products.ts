import type { Product, ProductCategory } from "@/generated/prisma/client";

export type { Product, ProductCategory };

export const categoryFilters: { key: "todo" | ProductCategory; label: string }[] = [
  { key: "todo", label: "Todo" },
  { key: "manillas", label: "Manillas" },
  { key: "collares", label: "Collares" },
  { key: "anillos", label: "Anillos" },
  { key: "aretes", label: "Aretes" },
];

/** 189000 -> "$189.000" (COP, "." as thousands separator) */
export function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-CO")}`;
}
