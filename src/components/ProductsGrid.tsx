"use client";

import { useState } from "react";
import { ALL_CATEGORIES, CategoryFilters } from "./CategoryFilters";
import { FavoritesBar } from "./FavoritesBar";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";
import type { Category, Product } from "@/lib/products";
import { staggerDelay } from "@/lib/stagger";
import { useSiteSettings } from "@/lib/settings-context";
import { waLink } from "@/lib/whatsapp";

export function ProductsGrid({
  products,
  categories,
  initialCategory,
}: {
  products: Product[];
  categories: Category[];
  initialCategory: string;
}) {
  const settings = useSiteSettings();
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const visibleProducts = products.filter((p) => {
    const inCategory = category === ALL_CATEGORIES || p.category.slug === category;
    const matchesQuery =
      normalizedQuery === "" ||
      p.name.toLowerCase().includes(normalizedQuery) ||
      p.referenceCode.toLowerCase().includes(normalizedQuery);
    return inCategory && matchesQuery;
  });

  return (
    <section className="grid gap-[clamp(26px,3.4vw,44px)] pt-[clamp(120px,15vw,168px)] pb-section-y px-gutter">
      <Reveal className="grid gap-5">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="grid gap-3">
            <span className="text-[10px] tracking-[0.34em] text-gold uppercase">
              La colección
            </span>
            <h1 className="m-0 font-display text-[clamp(28px,4.2vw,56px)] leading-[1.06] tracking-[-0.01em]">
              Todas las piezas
            </h1>
          </div>
          <CategoryFilters categories={categories} value={category} onChange={setCategory} />
        </div>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por nombre o referencia…"
          aria-label="Buscar piezas"
          className="w-full max-w-[360px] border-0 border-b border-ink/20 bg-transparent py-2 text-[13px] text-ink placeholder:text-muted focus:border-ink focus:outline-none"
        />
      </Reveal>

      <FavoritesBar products={products} />

      {visibleProducts.length === 0 ? (
        <div className="grid place-items-center gap-4 border border-ink/12 py-[clamp(48px,7vw,80px)] text-center">
          <p className="m-0 max-w-[42ch] text-[14px] leading-[1.8] text-muted text-pretty">
            No encontramos piezas
            {normalizedQuery ? ` que coincidan con "${query}"` : " en esta categoría todavía"}.
            Escríbenos y te ayudamos a encontrar lo que buscas.
          </p>
          <a
            href={waLink(settings.whatsappGreeting, settings.whatsappNumber)}
            target="_blank"
            rel="noopener"
            className="bg-ink px-8 py-3 text-[10px] tracking-[0.2em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold"
          >
            Escríbenos por WhatsApp
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-[clamp(10px,1.6vw,24px)] gap-y-[clamp(16px,2.2vw,34px)] sm:grid-cols-3 lg:grid-cols-4">
          {visibleProducts.map((product, index) => (
            <Reveal key={product.id} delay={staggerDelay(index)}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
