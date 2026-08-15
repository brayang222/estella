import Link from "next/link";
import { posts } from "@/lib/blog";
import type { Category } from "@/lib/products";

const careGuideSlug = posts.find((p) => p.slug === "cuidado-joyas-rodio")?.slug ?? posts[0].slug;

const linkClass = "text-[10px] tracking-[0.2em] text-muted uppercase hover:text-gold";

export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="grid gap-[26px] border-t border-ink/12 pt-[clamp(34px,4vw,54px)] pb-[30px] px-gutter">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <span className="font-display text-[18px] tracking-[0.42em] uppercase">Estella</span>
        <div className="flex flex-wrap gap-5">
          {categories.map((category) => (
            <Link key={category.slug} href={`/productos/${category.slug}`} className={linkClass}>
              {category.label}
            </Link>
          ))}
          <Link href="/#coleccion" className={linkClass}>
            Colección
          </Link>
          <Link href="/#lookbook" className={linkClass}>
            Lookbook
          </Link>
          <Link href="/sobre-nosotros" className={linkClass}>
            Estudio
          </Link>
          <Link href="/contacto" className={linkClass}>
            Contacto
          </Link>
          <Link href="/envios-y-cambios" className={linkClass}>
            Envíos y cambios
          </Link>
          <Link href="/blog" className={linkClass}>
            Blog
          </Link>
          <Link href={`/blog/${careGuideSlug}`} className={linkClass}>
            Cuidado de tus joyas
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[10px] tracking-[0.14em] text-ink/42">
          © 2026 Estella · Hecho con cuidado en Colombia
        </span>
        <Link href="/login" className={linkClass}>
          Iniciar sesión
        </Link>
      </div>
    </footer>
  );
}
