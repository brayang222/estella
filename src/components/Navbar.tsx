"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { isLocalEnv } from "@/lib/env";
import { useCart, useFavorites } from "@/lib/store";
import { useSiteSettings } from "@/lib/settings-context";
import { waLink } from "@/lib/whatsapp";

const sectionLinks = [
  { href: "/#coleccion", id: "coleccion", label: "Colección" },
  { href: "/#lookbook", id: "lookbook", label: "Lookbook" },
  { href: "/#historia", id: "historia", label: "Estudio" },
];

const links = [
  ...sectionLinks,
  // Todavía no lista para clientes reales — ver src/lib/env.ts.
  ...(isLocalEnv ? [{ href: "/arma-tu-cadena", id: "arma-tu-cadena", label: "Arma tu cadena" }] : []),
  { href: "/blog", id: "blog", label: "Blog" },
];

function AccountIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M12 20.2 4.9 13.3C2.6 11 2.6 7.4 4.9 5.1c2.2-2.2 5.7-2.2 7.9 0l.2.2.2-.2c2.2-2.2 5.7-2.2 7.9 0 2.3 2.3 2.3 5.9 0 8.2L12 20.2Z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M5 7h14l-1.1 13H6.1L5 7Z" />
      <path d="M9 9V6.5a3 3 0 0 1 6 0V9" />
    </svg>
  );
}

/** Contador flotante sobre los iconos de favoritos y bolsa. */
function Count({ value }: { value: number }) {
  if (value <= 0) return null;
  return (
    <span className="absolute -top-1.5 -right-2 grid h-[15px] min-w-[15px] place-items-center rounded-full bg-ink px-1 text-[9px] leading-none text-paper tabular-nums">
      {value > 99 ? "99+" : value}
    </span>
  );
}

export function Navbar() {
  const settings = useSiteSettings();
  const pathname = usePathname();
  const { status } = useSession();
  const { favorites } = useFavorites();
  const { count: bagCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const signedIn = status === "authenticated";
  const accountHref = signedIn ? "/cuenta" : "/login";
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

  const isActive = (id: string) => {
    const link = links.find((l) => l.id === id);
    if (!link) return false;
    if (sectionLinks.some((s) => s.id === id)) return pathname === "/" && activeId === id;
    return pathname.startsWith(link.href);
  };

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

      <div className="flex items-center justify-end gap-[clamp(12px,2vw,22px)]">
        <a
          href={waLink(settings.whatsappGreeting, settings.whatsappNumber)}
          target="_blank"
          rel="noopener"
          className="hidden border-b border-ink/35 pb-[3px] text-[10.5px] tracking-[0.22em] uppercase transition-[border-color] duration-[350ms] ease-out hover:border-gold hover:text-gold min-[820px]:block"
        >
          Asesoría
        </a>
        <Link
          href="/favoritos"
          aria-label={`Favoritos${favorites.length > 0 ? ` (${favorites.length})` : ""}`}
          className="relative flex items-center text-ink/70 transition-colors duration-300 ease-out hover:text-gold"
        >
          <HeartIcon filled={favorites.length > 0} />
          <Count value={favorites.length} />
        </Link>
        <Link
          href="/bolsa"
          aria-label={`Mi bolsa${bagCount > 0 ? ` (${bagCount})` : ""}`}
          className="relative flex items-center text-ink/70 transition-colors duration-300 ease-out hover:text-gold"
        >
          <BagIcon />
          <Count value={bagCount} />
        </Link>
        <Link
          href={accountHref}
          aria-label={signedIn ? "Mi cuenta" : "Iniciar sesión"}
          className="flex items-center text-ink/70 transition-colors duration-300 ease-out hover:text-gold"
        >
          <AccountIcon />
        </Link>
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
            href={waLink(settings.whatsappGreeting, settings.whatsappNumber)}
            target="_blank"
            rel="noopener"
            className="py-[10px] text-[11px] tracking-[0.2em] uppercase"
            onClick={() => setOpen(false)}
          >
            Asesoría
          </a>
          <Link
            href="/favoritos"
            className="py-[10px] text-[11px] tracking-[0.2em] uppercase"
            onClick={() => setOpen(false)}
          >
            Favoritos{favorites.length > 0 ? ` (${favorites.length})` : ""}
          </Link>
          <Link
            href="/bolsa"
            className="py-[10px] text-[11px] tracking-[0.2em] uppercase"
            onClick={() => setOpen(false)}
          >
            Mi bolsa{bagCount > 0 ? ` (${bagCount})` : ""}
          </Link>
          <Link
            href={accountHref}
            className="py-[10px] text-[11px] tracking-[0.2em] uppercase"
            onClick={() => setOpen(false)}
          >
            {signedIn ? "Mi cuenta" : "Iniciar sesión"}
          </Link>
          {!signedIn && (
            <Link
              href="/registro"
              className="py-[10px] text-[11px] tracking-[0.2em] text-gold uppercase"
              onClick={() => setOpen(false)}
            >
              Crear cuenta
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
