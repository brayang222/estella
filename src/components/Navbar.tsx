"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
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
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.links}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.link} ${isActive(link.id) ? styles.linkActive : ""}`}
            aria-current={isActive(link.id) ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <Link href="/#top" className={styles.wordmark}>
        Estella
      </Link>

      <div className={styles.right}>
        <a
          href={waLink(WA_GENERAL_MESSAGE)}
          target="_blank"
          rel="noopener"
          className={styles.advisory}
        >
          Asesoría
        </a>
        <button
          type="button"
          className={styles.burger}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className={styles.mobileMenu}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileLink} ${isActive(link.id) ? styles.mobileLinkActive : ""}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={waLink(WA_GENERAL_MESSAGE)}
            target="_blank"
            rel="noopener"
            className={styles.mobileLink}
            onClick={() => setOpen(false)}
          >
            Asesoría
          </a>
        </div>
      )}
    </nav>
  );
}
