"use client";

import Link from "next/link";
import type { Category } from "@/lib/products";

export const ALL_CATEGORIES = "todo";

/**
 * Dos modos según dónde se use: `hrefFor` para el catálogo, donde cada
 * categoría es una página propia e indexable, y `onChange` para el bloque del
 * inicio, que filtra en sitio sin sacar al visitante de la portada.
 */
export function CategoryFilters({
  categories,
  value,
  onChange,
  hrefFor,
}: {
  categories: Category[];
  value: string;
  onChange?: (slug: string) => void;
  hrefFor?: (slug: string) => string;
}) {
  const filters = [{ slug: ALL_CATEGORIES, label: "Todo" }, ...categories];
  const classFor = (slug: string) =>
    `cursor-pointer border-0 border-b bg-transparent py-1.5 text-[10.5px] font-light tracking-[0.2em] uppercase transition-[color,border-color] duration-300 ease-out ${
      value === slug ? "border-ink text-ink" : "border-transparent text-muted"
    }`;

  return (
    <div className="flex flex-wrap gap-[18px]">
      {filters.map((filter) =>
        hrefFor ? (
          <Link
            key={filter.slug}
            href={hrefFor(filter.slug)}
            className={classFor(filter.slug)}
            aria-current={value === filter.slug ? "page" : undefined}
          >
            {filter.label}
          </Link>
        ) : (
          <button
            key={filter.slug}
            type="button"
            className={classFor(filter.slug)}
            onClick={() => onChange?.(filter.slug)}
          >
            {filter.label}
          </button>
        )
      )}
    </div>
  );
}
