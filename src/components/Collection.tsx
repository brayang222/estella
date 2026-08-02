"use client";

import { useState } from "react";
import { ALL_CATEGORIES, CategoryFilters } from "./CategoryFilters";
import { FavoritesBar } from "./FavoritesBar";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";
import Link from "next/link";
import type { Category, Product } from "@/lib/products";
import { staggerDelay } from "@/lib/stagger";
import { WA_GENERAL_MESSAGE, waLink } from "@/lib/whatsapp";

/**
 * The grid is 2/3/4 columns as it widens, so "two rows" means 4, 6 or 8
 * cards. All 8 are rendered and the tail is hidden per breakpoint, keeping
 * the row count exact without measuring anything at runtime.
 */
const MAX_PREVIEW = 8;

function previewVisibility(index: number) {
  if (index < 4) return "";
  if (index < 6) return "hidden sm:grid";
  return "hidden lg:grid";
}

export function Collection({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [category, setCategory] = useState(ALL_CATEGORIES);

  const visibleProducts = products.filter(
    (p) => category === ALL_CATEGORIES || p.category.slug === category
  );
  const previewProducts = visibleProducts.slice(0, MAX_PREVIEW);

  const seeAllHref =
    category === ALL_CATEGORIES ? "/productos" : `/productos?categoria=${category}`;

  return (
    <section id="coleccion" className="grid gap-[clamp(26px,3.4vw,44px)] py-section-y px-gutter">
      <Reveal className="flex flex-wrap items-end justify-between gap-5">
        <div className="grid gap-3">
          <span className="text-[10px] tracking-[0.34em] text-gold uppercase">La colección</span>
          <h2 className="m-0 font-display text-[clamp(28px,4.2vw,56px)] leading-[1.06] tracking-[-0.01em]">
            Selección Estella
          </h2>
        </div>
        <CategoryFilters categories={categories} value={category} onChange={setCategory} />
      </Reveal>

      <FavoritesBar products={products} />

      {previewProducts.length === 0 ? (
        <div className="grid place-items-center gap-4 border border-ink/12 py-[clamp(48px,7vw,80px)] text-center">
          <p className="m-0 max-w-[42ch] text-[14px] leading-[1.8] text-muted text-pretty">
            Todavía no hay piezas en esta categoría. Escríbenos si buscas algo en particular.
          </p>
          <a
            href={waLink(WA_GENERAL_MESSAGE)}
            target="_blank"
            rel="noopener"
            className="bg-ink px-8 py-3 text-[10px] tracking-[0.2em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold"
          >
            Escríbenos por WhatsApp
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-[clamp(10px,1.6vw,24px)] gap-y-[clamp(16px,2.2vw,34px)] sm:grid-cols-3 lg:grid-cols-4">
          {previewProducts.map((product, index) => (
            <Reveal
              key={product.id}
              delay={staggerDelay(index)}
              className={previewVisibility(index)}
            >
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}

      {previewProducts.length > 0 && (
        <Reveal className="flex justify-center">
          <Link
            href={seeAllHref}
            className="bg-ink px-[clamp(44px,6vw,76px)] py-[clamp(17px,2vw,22px)] text-[11px] tracking-[0.24em] text-paper uppercase transition-[background-color,transform] duration-[400ms] ease-estella hover:-translate-y-0.5 hover:bg-gold"
          >
            Ver todos
          </Link>
        </Reveal>
      )}
    </section>
  );
}
