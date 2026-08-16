"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCustomer } from "./session";
import { getStoreState } from "./queries";
import { clampQuantity, EMPTY_STORE, normalizeStore, type StoreState } from "./types";

/**
 * Server Actions are public POST endpoints — every one of these re-derives the
 * user from the session and only ever accepts a product *slug* from the
 * client, never a row id or an ownership claim.
 */

export type SyncResult = {
  /** False when there's no usable session; the client then keeps its local copy. */
  persisted: boolean;
  state: StoreState;
};

async function productIdBySlug(slugs: string[]) {
  if (slugs.length === 0) return new Map<string, string>();
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true },
  });
  return new Map(products.map((p) => [p.slug, p.id]));
}

/**
 * Called once per session by the client store: folds whatever the visitor
 * collected as a guest (localStorage) into their account and hands back the
 * canonical state. Favorites are a union; a piece present in both carts keeps
 * the larger quantity, so logging in never silently shrinks the bag.
 */
export async function syncStore(guestState: unknown): Promise<SyncResult> {
  const customer = await getCustomer();
  const guest = normalizeStore(guestState);
  if (!customer) return { persisted: false, state: guest };

  const userId = customer.id;
  const bySlug = await productIdBySlug([
    ...new Set([...guest.favorites, ...guest.cart.map((line) => line.slug)]),
  ]);

  const favoriteRows = guest.favorites
    .map((slug) => bySlug.get(slug))
    .filter((id): id is string => Boolean(id))
    .map((productId) => ({ userId, productId }));

  if (favoriteRows.length > 0) {
    await prisma.favorite.createMany({ data: favoriteRows, skipDuplicates: true });
  }

  for (const line of guest.cart) {
    const productId = bySlug.get(line.slug);
    if (!productId) continue;
    const where = { userId_productId: { userId, productId } };
    const existing = await prisma.cartItem.findUnique({ where, select: { quantity: true } });
    if (!existing) {
      await prisma.cartItem.create({ data: { userId, productId, quantity: line.quantity } });
    } else if (line.quantity > existing.quantity) {
      await prisma.cartItem.update({ where, data: { quantity: line.quantity } });
    }
  }

  return { persisted: true, state: await getStoreState(userId) };
}

export async function toggleFavorite(slug: unknown): Promise<StoreState> {
  const customer = await getCustomer();
  if (!customer || typeof slug !== "string") return EMPTY_STORE;

  // published: sin este filtro se podía guardar en favoritos o en la bolsa
  // una pieza sin publicar conociendo su slug.
  const product = await prisma.product.findFirst({
    where: { slug, published: true },
    select: { id: true },
  });
  if (!product) return getStoreState(customer.id);

  const where = { userId_productId: { userId: customer.id, productId: product.id } };
  const existing = await prisma.favorite.findUnique({ where, select: { id: true } });
  if (existing) {
    await prisma.favorite.delete({ where });
  } else {
    await prisma.favorite.create({ data: { userId: customer.id, productId: product.id } });
  }

  return getStoreState(customer.id);
}

/** Quantity 0 (or less) removes the line. */
export async function setCartQuantity(slug: unknown, quantity: unknown): Promise<StoreState> {
  const customer = await getCustomer();
  if (!customer || typeof slug !== "string") return EMPTY_STORE;

  // published: sin este filtro se podía guardar en favoritos o en la bolsa
  // una pieza sin publicar conociendo su slug.
  const product = await prisma.product.findFirst({
    where: { slug, published: true },
    select: { id: true },
  });
  if (!product) return getStoreState(customer.id);

  const where = { userId_productId: { userId: customer.id, productId: product.id } };
  const wanted = Number(quantity);

  if (Number.isFinite(wanted) && wanted <= 0) {
    await prisma.cartItem.deleteMany({ where: { userId: customer.id, productId: product.id } });
  } else {
    const value = clampQuantity(quantity);
    await prisma.cartItem.upsert({
      where,
      create: { userId: customer.id, productId: product.id, quantity: value },
      update: { quantity: value },
    });
  }

  return getStoreState(customer.id);
}

export async function clearCart(): Promise<StoreState> {
  const customer = await getCustomer();
  if (!customer) return EMPTY_STORE;
  await prisma.cartItem.deleteMany({ where: { userId: customer.id } });
  return getStoreState(customer.id);
}

export async function clearFavorites(): Promise<StoreState> {
  const customer = await getCustomer();
  if (!customer) return EMPTY_STORE;
  await prisma.favorite.deleteMany({ where: { userId: customer.id } });
  return getStoreState(customer.id);
}

export type ProfileFormState = { error?: string; ok?: boolean };

const PHONE_PATTERN = /^[0-9+()\s-]{7,20}$/;

export async function updateProfile(
  _prevState: ProfileFormState | undefined,
  formData: FormData
): Promise<ProfileFormState> {
  const customer = await getCustomer();
  if (!customer) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (name.length < 2) return { error: "Escribe tu nombre (mínimo 2 caracteres)." };
  if (name.length > 80) return { error: "El nombre es demasiado largo." };
  if (phone && !PHONE_PATTERN.test(phone)) {
    return { error: "El teléfono solo puede tener números, espacios y + ( ) -." };
  }

  await prisma.user.update({
    where: { id: customer.id },
    data: { name, phone: phone || null },
  });

  revalidatePath("/cuenta");
  return { ok: true };
}
