/**
 * Shape of a customer's saved selection. Shared verbatim by the client store
 * (localStorage while browsing as guest) and the server actions that persist
 * it, so the two can't drift. Products travel as slugs — the client never
 * needs to know database ids.
 */
export type CartLine = { slug: string; quantity: number };

export type StoreState = {
  favorites: string[];
  cart: CartLine[];
};

export const EMPTY_STORE: StoreState = { favorites: [], cart: [] };

export const MAX_QUANTITY = 99;

/** Clamps to 1…MAX_QUANTITY; anything unparseable becomes 1. */
export function clampQuantity(value: unknown): number {
  const n = Math.trunc(Number(value));
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, MAX_QUANTITY);
}

/**
 * Defensive parse for anything crossing a trust boundary: localStorage (which
 * the user can edit) and server-action arguments (which anyone can POST).
 */
export function normalizeStore(value: unknown): StoreState {
  if (!value || typeof value !== "object") return EMPTY_STORE;
  const raw = value as Partial<Record<keyof StoreState, unknown>>;

  const favorites = Array.isArray(raw.favorites)
    ? [...new Set(raw.favorites.filter((s): s is string => typeof s === "string"))].slice(0, 200)
    : [];

  const seen = new Set<string>();
  const cart: CartLine[] = [];
  if (Array.isArray(raw.cart)) {
    for (const line of raw.cart.slice(0, 200)) {
      if (!line || typeof line !== "object") continue;
      const { slug, quantity } = line as Partial<CartLine>;
      if (typeof slug !== "string" || seen.has(slug)) continue;
      seen.add(slug);
      cart.push({ slug, quantity: clampQuantity(quantity) });
    }
  }

  return { favorites, cart };
}
