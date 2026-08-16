"use client";

import { useSyncExternalStore } from "react";

/**
 * Nombre y ciudad para el pedido por WhatsApp, recordados entre visitas.
 *
 * Vive fuera de React y se lee con useSyncExternalStore, igual que la bolsa
 * (ver src/lib/store.tsx): localStorage es un sistema externo, y leerlo con un
 * efecto que llama a setState dispara renders en cascada — es justo lo que
 * marca la regla `set-state-in-effect`.
 */
export type ShippingDetails = { name: string; city: string };

const KEY = "estella:envio";
const EMPTY: ShippingDetails = { name: "", city: "" };

let cache: ShippingDetails = EMPTY;
const listeners = new Set<() => void>();

function read(): ShippingDetails {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      city: typeof parsed.city === "string" ? parsed.city : "",
    };
  } catch {
    // Storage bloqueado o JSON corrupto: se empieza en blanco.
    return EMPTY;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Se devuelve la misma referencia mientras no cambie: useSyncExternalStore compara por identidad. */
function getSnapshot(): ShippingDetails {
  const actual = read();
  if (actual.name !== cache.name || actual.city !== cache.city) cache = actual;
  return cache;
}

/** En el servidor no hay storage; el primer render del cliente coincide. */
function getServerSnapshot(): ShippingDetails {
  return EMPTY;
}

export function setShippingDetails(next: ShippingDetails) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Modo privado o cuota llena: no vale romper la bolsa por recordar esto.
  }
  listeners.forEach((listener) => listener());
}

export function useShippingDetails(): ShippingDetails {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
