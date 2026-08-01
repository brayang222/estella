import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="grid justify-items-center gap-5 pt-[clamp(140px,20vw,220px)] pb-[clamp(90px,12vw,160px)] px-gutter text-center">
      <span className="text-[10px] tracking-[0.34em] text-gold uppercase">Error 404</span>
      <h1 className="m-0 font-display text-[clamp(64px,10vw,140px)] leading-none">Se perdió</h1>
      <p className="m-0 max-w-[42ch] text-[13.5px] leading-[1.85] text-muted">
        Esta página no existe o la pieza que buscabas ya no está disponible. Vuelve a la
        colección o escríbenos y te ayudamos a encontrarla.
      </p>
      <Link
        href="/"
        className="mt-1.5 border-b border-ink/40 pb-1 text-[10.5px] tracking-[0.22em] uppercase transition-[border-color] duration-[350ms] ease-out hover:border-gold hover:text-gold"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
