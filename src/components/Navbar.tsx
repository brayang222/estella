"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WA_GENERAL_MESSAGE, waLink } from "@/lib/whatsapp";

const sectionLinks = [
  { href: "/#coleccion", id: "coleccion", label: "Colección" },
  { href: "/#lookbook", id: "lookbook", label: "Lookbook" },
  { href: "/#historia", id: "historia", label: "Estudio" },
];

const links = [...sectionLinks, { href: "/blog", id: "blog", label: "Blog" }];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  // The wordmark rides the same threshold as the solid navbar background, so
  // the bar "settling" into its fixed state and the name arriving read as one
  // move. Other routes have no hero wordmark to defer to, so it shows there
  // from the start.
  const wordmarkVisible = pathname !== "/" || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // isActive() below already gates on pathname === "/", so a stale
    // activeId while on another route never renders as active.
    if (pathname !== "/") return;
    const sections = sectionLinks
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  const isActive = (id: string) =>
    id === "blog" ? pathname.startsWith("/blog") : pathname === "/" && activeId === id;

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-[60] grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b px-gutter transition-all duration-500 ease-out ${
        scrolled
          ? "border-ink/12 bg-paper/92 py-[13px] backdrop-blur-[12px]"
          : "border-transparent bg-paper/0 py-[18px]"
      }`}
      // Pinned during view transitions (see globals.css) so the bar stays put
      // instead of crossfading with the page under it.
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="hidden items-center gap-[clamp(12px,2vw,30px)] min-[820px]:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`border-b pb-[3px] text-[10.5px] tracking-[0.22em] uppercase transition-[color,border-color] duration-300 ease-out hover:text-gold ${
              isActive(link.id) ? "border-gold text-gold" : "border-transparent"
            }`}
            aria-current={isActive(link.id) ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <Link
        href="/#top"
        className={`font-display text-[clamp(16px,1.8vw,21px)] tracking-[0.46em] whitespace-nowrap uppercase transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.33,1,0.68,1)] [text-indent:0.46em] ${
          wordmarkVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[3px] opacity-0"
        }`}
        aria-hidden={!wordmarkVisible}
        tabIndex={wordmarkVisible ? undefined : -1}
      >
        Estella
      </Link>

      <div className="flex items-center justify-end gap-[clamp(12px,2vw,24px)]">
        <a
          href={waLink(WA_GENERAL_MESSAGE)}
          target="_blank"
          rel="noopener"
          className="border-b border-ink/35 pb-[3px] text-[10.5px] tracking-[0.22em] uppercase transition-[border-color] duration-[350ms] ease-out hover:border-gold hover:text-gold"
        >
          Asesoría
        </a>
        <button
          type="button"
          className="grid w-[22px] cursor-pointer justify-items-end gap-[5px] border-0 bg-transparent py-1.5 min-[820px]:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="block h-px w-full bg-ink" />
          <span className="block h-px w-[65%] bg-ink" />
        </button>
      </div>

      {open && (
        <div className="absolute top-full inset-x-0 grid gap-1 border-y border-ink/12 bg-paper/98 px-gutter pt-[18px] pb-6 backdrop-blur-[12px]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`py-[10px] text-[11px] tracking-[0.2em] uppercase ${
                isActive(link.id) ? "text-gold" : ""
              }`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={waLink(WA_GENERAL_MESSAGE)}
            target="_blank"
            rel="noopener"
            className="py-[10px] text-[11px] tracking-[0.2em] uppercase"
            onClick={() => setOpen(false)}
          >
            Asesoría
          </a>
        </div>
      )}
    </nav>
  );
}
