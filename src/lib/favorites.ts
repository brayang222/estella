"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "estella:favoritos";

let cache: string[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function readStorage(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  if (!hydrated) {
    cache = readStorage();
    hydrated = true;
  }
  return cache;
}

function getServerSnapshot() {
  return cache; // always [] — favorites only exist client-side
}

function setFavorites(next: string[]) {
  cache = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

function toggleFavorite(slug: string) {
  const current = hydrated ? cache : readStorage();
  hydrated = true;
  setFavorites(
    current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]
  );
}

/** Favorited product slugs, persisted to localStorage. No login needed. */
export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    favorites,
    isFavorite: (slug: string) => favorites.includes(slug),
    toggle: toggleFavorite,
  };
}
