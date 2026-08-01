"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { resolvePendingTransition } from "@/lib/view-transition-signal";

/**
 * Mounted once at the root layout. Fires after every route's content has
 * actually committed to the DOM (`usePathname()` only changes post-commit),
 * which is the real "ready" signal a pending view transition waits on.
 */
export function ViewTransitionReadySignal() {
  const pathname = usePathname();

  useEffect(() => {
    resolvePendingTransition();
  }, [pathname]);

  return null;
}
