"use client";

import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "estella:vistos";
/** Cuántos slugs se guardan; ni el storage ni la tira de UI necesitan más. */
const MAX_ITEMS = 8;

function readLocal(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocal(slugs: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // Sin storage (modo privado): la lista solo dura la visita.
  }
}

const EMPTY: string[] = [];

let snapshot: string[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): string[] {
  if (!hydrated) {
    hydrated = true;
    snapshot = readLocal();
  }
  return snapshot;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

function recordView(slug: string) {
  // No asumas que algún consumidor de useRecentlyViewed ya hidrató `snapshot`
  // desde localStorage — en una carga dura de la ficha de producto, este
  // efecto puede correr antes que ese hook, y de lo contrario se perdería el
  // historial guardado.
  const current = hydrated ? snapshot : readLocal();
  hydrated = true;
  snapshot = [slug, ...current.filter((s) => s !== slug)].slice(0, MAX_ITEMS);
  writeLocal(snapshot);
  for (const listener of listeners) listener();
}

/** Guarda el slug actual como visto. Se monta una vez en la ficha de producto. */
export function RecordRecentlyViewed({ slug }: { slug: string }) {
  useEffect(() => {
    recordView(slug);
  }, [slug]);
  return null;
}

/** Slugs vistos recientemente, más nuevo primero. */
export function useRecentlyViewed(): string[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
