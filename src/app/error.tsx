"use client";

import Link from "next/link";

export default function Error({ unstable_retry }: { unstable_retry: () => void }) {
  return (
    <section className="grid justify-items-center gap-5 pt-[clamp(140px,20vw,220px)] pb-[clamp(90px,12vw,160px)] px-gutter text-center">
      <span className="text-[10px] tracking-[0.34em] text-gold uppercase">Algo salió mal</span>
      <h1 className="m-0 font-display text-[clamp(44px,7vw,96px)] leading-none">Un momento</h1>
      <p className="m-0 max-w-[42ch] text-[13.5px] leading-[1.85] text-muted">
        No pudimos cargar esta página. Puede ser algo pasajero — intenta de nuevo o vuelve a la
        colección.
      </p>
      <div className="mt-1.5 flex flex-wrap items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="cursor-pointer border-0 border-b border-ink/40 bg-transparent pb-1 text-[10.5px] tracking-[0.22em] uppercase transition-[border-color] duration-[350ms] ease-out hover:border-gold hover:text-gold"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="border-b border-ink/40 pb-1 text-[10.5px] tracking-[0.22em] uppercase transition-[border-color] duration-[350ms] ease-out hover:border-gold hover:text-gold"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
