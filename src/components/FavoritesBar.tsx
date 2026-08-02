"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/store";
import { formatPrice, type Product } from "@/lib/products";
import { useSiteSettings } from "@/lib/settings-context";
import { waFavoritesMessage, waLink } from "@/lib/whatsapp";

export function FavoritesBar({ products }: { products: Product[] }) {
  const settings = useSiteSettings();
  const { favorites, clear } = useFavorites();
  const items = products.filter((p) => favorites.includes(p.slug));
  if (items.length === 0) return null;

  const message = waFavoritesMessage(
    items.map((p) => ({ name: p.name, price: formatPrice(p.price) }))
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border border-ink/15 bg-paper-alt px-5 py-4">
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span className="text-[10px] tracking-[0.2em] text-ink uppercase">
          Favoritos ({items.length})
        </span>
        <span className="hidden text-[12px] text-muted sm:inline">
          {items.map((p) => p.name).join(" · ")}
        </span>
      </div>
      <div className="flex items-center gap-5">
        <Link
          href="/favoritos"
          className="text-[10px] tracking-[0.2em] text-muted uppercase underline-offset-4 hover:text-ink hover:underline"
        >
          Ver todos
        </Link>
        <a
          href={waLink(message, settings.whatsappNumber)}
          target="_blank"
          rel="noopener"
          className="bg-ink px-5 py-2.5 text-[10px] tracking-[0.2em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold"
        >
          Enviar por WhatsApp
        </a>
        <button
          type="button"
          onClick={clear}
          className="cursor-pointer border-0 bg-transparent text-[10px] tracking-[0.2em] text-muted uppercase underline-offset-4 hover:text-ink hover:underline"
        >
          Vaciar
        </button>
      </div>
    </div>
  );
}
