import Link from "next/link";
import { posts } from "@/lib/blog";

const careGuideSlug = posts.find((p) => p.slug === "cuidado-joyas-rodio")?.slug ?? posts[0].slug;

const linkClass = "text-[10px] tracking-[0.2em] text-muted uppercase hover:text-gold";

export function Footer() {
  return (
    <footer className="grid gap-[26px] border-t border-ink/12 pt-[clamp(34px,4vw,54px)] pb-[30px] px-gutter">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <span className="font-display text-[18px] tracking-[0.42em] uppercase">Estella</span>
        <div className="flex flex-wrap gap-5">
          <Link href="/#coleccion" className={linkClass}>
            Colección
          </Link>
          <Link href="/#lookbook" className={linkClass}>
            Lookbook
          </Link>
          <Link href="/#historia" className={linkClass}>
            Estudio
          </Link>
          <Link href="/blog" className={linkClass}>
            Blog
          </Link>
          <Link href={`/blog/${careGuideSlug}`} className={linkClass}>
            Cuidado de tus joyas
          </Link>
        </div>
      </div>
      <span className="text-[10px] tracking-[0.14em] text-ink/42">
        © 2026 Estella · Hecho con cuidado en Colombia
      </span>
    </footer>
  );
}
