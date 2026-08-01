"use client";

import { useLayoutEffect, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

let registered = false;
function ensureGsapSetup() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create("estella", "0.16, 1, 0.3, 1");
  registered = true;
}

/**
 * The viewport can briefly report height 0 (e.g. a pane/tab still settling
 * on first paint). Creating a ScrollTrigger against a 0-height viewport
 * bakes in a garbage start position, and since these triggers are `once`,
 * they can fire immediately and never get a real second chance. Wait for a
 * sane viewport before measuring.
 */
function whenViewportReady(callback: () => void) {
  if (window.innerHeight > 0) {
    callback();
    return () => {};
  }
  let raf = requestAnimationFrame(function check() {
    if (window.innerHeight > 0) {
      callback();
    } else {
      raf = requestAnimationFrame(check);
    }
  });
  return () => cancelAnimationFrame(raf);
}

let refreshScheduled = false;
/**
 * Many independent components create ScrollTriggers as they mount; if a
 * trigger is measured before the rest of the page (content below it) has
 * settled, its start position is computed against a too-short document and
 * ends up wrong. Refresh once, after everything has painted, to fix it up.
 */
function scheduleGlobalRefresh() {
  if (refreshScheduled) return;
  refreshScheduled = true;
  const refresh = () => ScrollTrigger.refresh();
  requestAnimationFrame(() => requestAnimationFrame(refresh));
  window.addEventListener("load", refresh, { once: true });
}

type RevealProps = {
  delay?: number;
  className?: string;
  children: React.ReactNode;
};

/** Fade + rise reveal, triggered once the element is 94% into the viewport. */
export function Reveal({ delay = 0, className, children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    ensureGsapSetup();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(el, { opacity: 0, y: 22 });

    let trigger: ScrollTrigger | undefined;
    const cancel = whenViewportReady(() => {
      trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 94%",
        once: true,
        onEnter: () => {
          // See Curtain: when a fast scroll overshoots the trigger point, the
          // staggered entrance plays behind the user instead of ahead of them.
          const fromBottomEdge = el.getBoundingClientRect().top > window.innerHeight * 0.7;
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: fromBottomEdge ? 1 : 0.3,
            delay: fromBottomEdge ? delay : 0,
            ease: fromBottomEdge ? "estella" : "power1.out",
          });
        },
      });
      scheduleGlobalRefresh();
    });

    return () => {
      cancel();
      trigger?.kill();
    };
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

type CurtainProps = {
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/** Vertical wipe reveal for media blocks: outer box is observed, inner layer is clipped. */
export function Curtain({ delay = 0, className, style, children }: CurtainProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    ensureGsapSetup();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(inner, { clipPath: "inset(0% 0 0% 0)" });
      return;
    }

    gsap.set(inner, { clipPath: "inset(0% 0 100% 0)" });

    let trigger: ScrollTrigger | undefined;
    const cancel = whenViewportReady(() => {
      trigger = ScrollTrigger.create({
        trigger: outer,
        start: "top 94%",
        once: true,
        onEnter: () => {
          // A fast scroll can carry the element well past its trigger point
          // before this fires; wiping it open from there just shows a
          // half-clipped photo in the middle of the screen. Only play the
          // wipe when the element is still entering from the bottom edge.
          const fromBottomEdge = outer.getBoundingClientRect().top > window.innerHeight * 0.7;
          gsap.to(inner, {
            clipPath: "inset(0% 0 0% 0)",
            duration: fromBottomEdge ? 0.9 : 0.35,
            delay: fromBottomEdge ? delay : 0,
            ease: fromBottomEdge ? "estella" : "power1.out",
          });
        },
      });
      scheduleGlobalRefresh();
    });

    return () => {
      cancel();
      trigger?.kill();
    };
  }, [delay]);

  return (
    <div
      ref={outerRef}
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      <div ref={innerRef} style={{ position: "absolute", inset: 0 }}>
        {children}
      </div>
    </div>
  );
}
