"use client";

import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { WA_GENERAL_MESSAGE, waLink } from "@/lib/whatsapp";

const links = [
  { href: "#coleccion", label: "Colección" },
  { href: "#lookbook", label: "Lookbook" },
  { href: "#historia", label: "Estudio" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.links}>
        {links.map((link) => (
          <a key={link.href} href={link.href} className={styles.link}>
            {link.label}
          </a>
        ))}
      </div>

      <a href="#top" className={styles.wordmark}>
        Estella
      </a>

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
            <a
              key={link.href}
              href={link.href}
              className={styles.mobileLink}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
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
