"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  useTransition,
} from "react";
import { useSession } from "next-auth/react";
import {
  clearCart as clearCartOnServer,
  clearFavorites as clearFavoritesOnServer,
  setCartQuantity as setCartQuantityOnServer,
  syncStore,
  toggleFavorite as toggleFavoriteOnServer,
} from "./account/actions";
import { clampQuantity, EMPTY_STORE, normalizeStore, type StoreState } from "./account/types";

const STORAGE_KEY = "estella:tienda";
/** Favoritos guardados por la versión anterior (solo localStorage, sin bolsa). */
const LEGACY_FAVORITES_KEY = "estella:favoritos";

function readLocal(): StoreState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeStore(JSON.parse(raw));
    const legacy = window.localStorage.getItem(LEGACY_FAVORITES_KEY);
    if (legacy) return normalizeStore({ favorites: JSON.parse(legacy), cart: [] });
  } catch {
    // Storage bloqueado o JSON corrupto: se empieza en limpio.
  }
  return EMPTY_STORE;
}

function writeLocal(state: StoreState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.localStorage.removeItem(LEGACY_FAVORITES_KEY);
  } catch {
    // Sin storage (modo privado), la selección solo dura la visita.
  }
}

function clearLocal() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_FAVORITES_KEY);
  } catch {
    // Nada que limpiar.
  }
}

/* --------------------------------------------------------------------------
 * Store externo (fuera de React)
 *
 * localStorage y la base de datos son sistemas externos, así que la selección
 * vive en este módulo y los componentes se suscriben con useSyncExternalStore.
 * Eso resuelve la hidratación sin desajustes: el servidor y el primer render
 * del cliente ven la selección vacía, y React vuelve a renderizar en cuanto
 * el navegador aporta la real.
 * ---------------------------------------------------------------------------*/

type Snapshot = {
  state: StoreState;
  /** False hasta saber si mandan los datos locales o los de la cuenta. */
  ready: boolean;
};

const SERVER_SNAPSHOT: Snapshot = { state: EMPTY_STORE, ready: false };

let snapshot: Snapshot = SERVER_SNAPSHOT;
let localRead = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Snapshot {
  // Primera lectura en el navegador: se rescata lo guardado localmente para
  // que los contadores aparezcan de inmediato, aunque `ready` siga en false
  // mientras se resuelve la sesión.
  if (!localRead) {
    localRead = true;
    snapshot = { ...snapshot, state: readLocal() };
  }
  return snapshot;
}

function getServerSnapshot(): Snapshot {
  return SERVER_SNAPSHOT;
}

function publish(next: Partial<Snapshot>) {
  localRead = true;
  snapshot = { ...snapshot, ...next };
  for (const listener of listeners) listener();
}

type StoreContextValue = {
  state: StoreState;
  ready: boolean;
  authenticated: boolean;
  toggleFavorite: (slug: string) => void;
  clearFavorites: () => void;
  addToCart: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

/**
 * Favoritos y bolsa, con una sola API para los dos modos:
 *
 * - Sin sesión: todo vive en localStorage, como hasta ahora.
 * - Con sesión: todo vive en la base de datos. Al iniciar sesión, lo que el
 *   visitante había guardado como invitado se fusiona con su cuenta y el
 *   localStorage se vacía, así no quedan dos listas compitiendo.
 *
 * Cada cambio se pinta primero (optimista) y luego se confirma con el estado
 * canónico que devuelve el servidor.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const authenticated = status === "authenticated";
  const { state, ready } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (status === "loading") return;

    if (!authenticated) {
      publish({ state: readLocal(), ready: true });
      return;
    }

    let active = true;
    const guest = readLocal();
    startTransition(async () => {
      try {
        const result = await syncStore(guest);
        if (!active) return;
        if (result.persisted) clearLocal();
        publish({ state: result.state, ready: true });
      } catch {
        // Sin red: se sigue mostrando lo que había localmente.
        if (active) publish({ ready: true });
      }
    });

    return () => {
      active = false;
    };
  }, [status, authenticated]);

  /** Aplica el cambio en local y, con sesión, lo confirma contra el servidor. */
  const push = useCallback(
    (next: StoreState, remote: () => Promise<StoreState>) => {
      publish({ state: next });
      if (!authenticated) {
        writeLocal(next);
        return;
      }
      startTransition(async () => {
        try {
          publish({ state: await remote() });
        } catch {
          // Se conserva el estado optimista; el próximo cargue reconcilia.
        }
      });
    },
    [authenticated]
  );

  const toggleFavorite = useCallback(
    (slug: string) => {
      const current = snapshot.state;
      const favorites = current.favorites.includes(slug)
        ? current.favorites.filter((s) => s !== slug)
        : [...current.favorites, slug];
      push({ ...current, favorites }, () => toggleFavoriteOnServer(slug));
    },
    [push]
  );

  const clearFavorites = useCallback(() => {
    push({ ...snapshot.state, favorites: [] }, () => clearFavoritesOnServer());
  }, [push]);

  const setQuantity = useCallback(
    (slug: string, quantity: number) => {
      const current = snapshot.state;
      const wanted = Math.trunc(Number(quantity));
      let cart;
      if (!Number.isFinite(wanted) || wanted <= 0) {
        cart = current.cart.filter((line) => line.slug !== slug);
      } else if (current.cart.some((line) => line.slug === slug)) {
        cart = current.cart.map((line) =>
          line.slug === slug ? { ...line, quantity: clampQuantity(wanted) } : line
        );
      } else {
        cart = [...current.cart, { slug, quantity: clampQuantity(wanted) }];
      }
      push({ ...current, cart }, () => setCartQuantityOnServer(slug, wanted));
    },
    [push]
  );

  const addToCart = useCallback(
    (slug: string, quantity = 1) => {
      const existing = snapshot.state.cart.find((line) => line.slug === slug);
      setQuantity(slug, (existing?.quantity ?? 0) + clampQuantity(quantity));
    },
    [setQuantity]
  );

  const clearCart = useCallback(() => {
    push({ ...snapshot.state, cart: [] }, () => clearCartOnServer());
  }, [push]);

  const value = useMemo(
    () => ({
      state,
      ready,
      authenticated,
      toggleFavorite,
      clearFavorites,
      addToCart,
      setQuantity,
      clearCart,
    }),
    [state, ready, authenticated, toggleFavorite, clearFavorites, addToCart, setQuantity, clearCart]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore necesita <StoreProvider> por encima.");
  return context;
}

/** Slugs favoritos del visitante (localStorage sin sesión, cuenta con sesión). */
export function useFavorites() {
  const { state, ready, authenticated, toggleFavorite, clearFavorites } = useStore();
  return {
    favorites: state.favorites,
    isFavorite: (slug: string) => state.favorites.includes(slug),
    toggle: toggleFavorite,
    clear: clearFavorites,
    ready,
    authenticated,
  };
}

/** La bolsa: piezas guardadas con cantidad, para pedir por WhatsApp. */
export function useCart() {
  const { state, ready, authenticated, addToCart, setQuantity, clearCart } = useStore();
  return {
    lines: state.cart,
    count: state.cart.reduce((total, line) => total + line.quantity, 0),
    quantityOf: (slug: string) => state.cart.find((line) => line.slug === slug)?.quantity ?? 0,
    add: addToCart,
    setQuantity,
    remove: (slug: string) => setQuantity(slug, 0),
    clear: clearCart,
    ready,
    authenticated,
  };
}
