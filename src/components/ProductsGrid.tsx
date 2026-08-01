"use client";

import { useState } from "react";
import { ALL_CATEGORIES, CategoryFilters } from "./CategoryFilters";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";
import type { Category, Product } from "@/lib/products";
import { staggerDelay } from "@/lib/stagger";

export function ProductsGrid({
  products,
  categories,
  initialCategory,
}: {
  products: Product[];
  categories: Category[];
  initialCategory: string;
}) {
  const [category, setCategory] = useState(initialCategory);

  const visibleProducts = products.filter(
    (p) => category === ALL_CATEGORIES || p.category.slug === category
  );

  return (
    <section className="grid gap-[clamp(26px,3.4vw,44px)] pt-[clamp(120px,15vw,168px)] pb-section-y px-gutter">
      <Reveal className="flex flex-wrap items-end justify-between gap-5">
        <div className="grid gap-3">
          <span className="text-[10px] tracking-[0.34em] text-gold uppercase">La colección</span>
          <h1 className="m-0 font-display text-[clamp(28px,4.2vw,56px)] leading-[1.06] tracking-[-0.01em]">
            Todas las piezas
          </h1>
        </div>
        <CategoryFilters categories={categories} value={category} onChange={setCategory} />
      </Reveal>

      <div className="grid grid-cols-2 gap-x-[clamp(10px,1.6vw,24px)] gap-y-[clamp(16px,2.2vw,34px)] sm:grid-cols-3 lg:grid-cols-4">
        {visibleProducts.map((product, index) => (
          <Reveal key={product.id} delay={staggerDelay(index)}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
