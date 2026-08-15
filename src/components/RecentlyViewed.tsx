"use client";

import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";
import { staggerDelay } from "@/lib/stagger";
import { useRecentlyViewed } from "@/lib/recently-viewed";
import type { Product } from "@/lib/products";

/** Piezas vistas hace poco, salvo la que se está mirando ahora. */
export function RecentlyViewed({ products, exclude }: { products: Product[]; exclude?: string }) {
  const slugs = useRecentlyViewed().filter((slug) => slug !== exclude);
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const viewed = slugs.map((slug) => bySlug.get(slug)).filter((p): p is Product => Boolean(p));

  if (viewed.length === 0) return null;

  return (
    <section className="grid gap-[clamp(20px,2.6vw,32px)] border-t border-ink/12 pt-[clamp(40px,5vw,64px)] md:col-span-2">
      <Reveal>
        <h2 className="m-0 font-display text-[clamp(22px,3vw,32px)] leading-[1.1]">
          Vistos recientemente
        </h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-x-[clamp(10px,1.6vw,24px)] gap-y-[clamp(16px,2.2vw,34px)] sm:grid-cols-3 lg:grid-cols-4">
        {viewed.map((product, index) => (
          <Reveal key={product.id} delay={staggerDelay(index)}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
