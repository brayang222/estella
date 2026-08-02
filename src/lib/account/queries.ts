import "server-only";
import { prisma } from "@/lib/db";
import { PRODUCT_INCLUDE } from "@/lib/queries";
import type { StoreState } from "./types";

/** Slug-only view of a customer's saved selection — what the client store holds. */
export async function getStoreState(userId: string): Promise<StoreState> {
  const [favorites, cart] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { product: { select: { slug: true } } },
    }),
    prisma.cartItem.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { quantity: true, product: { select: { slug: true } } },
    }),
  ]);

  return {
    favorites: favorites.map((f) => f.product.slug),
    cart: cart.map((line) => ({ slug: line.product.slug, quantity: line.quantity })),
  };
}

export async function getFavoriteProducts(userId: string) {
  const rows = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { product: { include: PRODUCT_INCLUDE } },
  });
  return rows.map((row) => row.product);
}

export async function getCartProducts(userId: string) {
  const rows = await prisma.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: { product: { include: PRODUCT_INCLUDE } },
  });
  return rows.map((row) => ({ product: row.product, quantity: row.quantity }));
}
