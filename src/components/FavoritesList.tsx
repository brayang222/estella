"use client";

import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";
import { useFavorites } from "@/lib/store";
import { formatPrice, type Product } from "@/lib/products";
import { staggerDelay } from "@/lib/stagger";
import { waFavoritesMessage, waLink } from "@/lib/whatsapp";

export function FavoritesList({ products }: { products: Product[] }) {
  const { favorites, clear, ready, authenticated } = useFavorites();

  // Se respeta el orden en que se guardaron, no el del catálogo.
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const items = favorites
    .map((slug) => bySlug.get(slug))
    .filter((product): product is Product => Boolean(product));

  if (!ready) {
    return <p className="m-0 text-[13px] text-muted">Cargando tus favoritos…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="grid place-items-center gap-4 border border-ink/12 py-[clamp(48px,7vw,80px)] text-center">
        <p className="m-0 max-w-[42ch] text-[14px] leading-[1.8] text-muted text-pretty">
          Todavía no has guardado piezas. Toca el corazón en cualquier pieza para tenerla a mano.
        </p>
        <Link
          href="/productos"
          className="bg-ink px-8 py-3 text-[10px] tracking-[0.2em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold"
        >
          Ver las piezas
        </Link>
      </div>
    );
  }

  const message = waFavoritesMessage(
    items.map((product) => ({ name: product.name, price: formatPrice(product.price) }))
  );

  return (
    <div className="grid gap-[clamp(20px,2.6vw,34px)]">
      {!authenticated && (
        <p className="m-0 border border-ink/12 bg-paper-alt px-5 py-4 text-[12.5px] leading-[1.7] text-muted">
          Tus favoritos se guardan en este navegador.{" "}
          <Link
            href="/login?callbackUrl=%2Ffavoritos"
            className="text-ink underline underline-offset-4"
          >
            Inicia sesión
          </Link>{" "}
          o{" "}
          <Link
            href="/registro?callbackUrl=%2Ffavoritos"
            className="text-ink underline underline-offset-4"
          >
            crea tu cuenta
          </Link>{" "}
          para conservarlos en cualquier dispositivo.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-[10px] tracking-[0.2em] text-muted uppercase">
          {items.length} {items.length === 1 ? "pieza guardada" : "piezas guardadas"}
        </span>
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={clear}
            className="cursor-pointer border-0 bg-transparent text-[10px] tracking-[0.2em] text-muted uppercase underline-offset-4 hover:text-ink hover:underline"
          >
            Vaciar
          </button>
          <a
            href={waLink(message)}
            target="_blank"
            rel="noopener"
            className="bg-ink px-6 py-3 text-[10px] tracking-[0.2em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-[clamp(10px,1.6vw,24px)] gap-y-[clamp(16px,2.2vw,34px)] sm:grid-cols-3 lg:grid-cols-4">
        {items.map((product, index) => (
          <Reveal key={product.id} delay={staggerDelay(index)}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
