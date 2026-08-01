"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { flushSync } from "react-dom";
import type { ComponentProps, MouseEvent } from "react";
import { registerPendingTransition } from "@/lib/view-transition-signal";

type Props = ComponentProps<typeof Link>;

// If the destination route never signals ready (an error, a weird edge
// case), don't hang the transition forever — let it settle on its own.
const SAFETY_TIMEOUT_MS = 1500;

/**
 * A next/link that morphs matching `viewTransitionName` elements between
 * this page and the next using the browser's native View Transitions API.
 * Falls back to a plain navigation when the API, a modifier key, or a
 * non-default click (middle click, right click) is involved.
 */
export function TransitionLink({ href, onClick, ...props }: Props) {
  const router = useRouter();

  return (
    <Link
      href={href}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }
        if (typeof document === "undefined" || !document.startViewTransition) return;

        event.preventDefault();
        document.startViewTransition(
          () =>
            new Promise<void>((resolve) => {
              const timeout = setTimeout(resolve, SAFETY_TIMEOUT_MS);
              registerPendingTransition(() => {
                clearTimeout(timeout);
                resolve();
              });
              flushSync(() => router.push(href.toString()));
            })
        );
      }}
      {...props}
    />
  );
}
