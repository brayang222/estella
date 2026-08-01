"use client";

/**
 * document.startViewTransition() takes its "after" snapshot the instant the
 * transition callback returns — but a Next.js App Router navigation can
 * still be waiting on an async server fetch at that point, so the snapshot
 * ends up capturing stale content and the morph never reads as connected.
 * TransitionLink registers a resolver here before pushing; whichever route
 * actually commits next calls `resolvePendingTransition` (via
 * ViewTransitionReadySignal watching `usePathname()`), so the transition's
 * "after" snapshot waits for the real thing instead of a guess.
 */
let pendingResolve: (() => void) | null = null;

export function registerPendingTransition(resolve: () => void) {
  pendingResolve = resolve;
}

export function resolvePendingTransition() {
  pendingResolve?.();
  pendingResolve = null;
}
