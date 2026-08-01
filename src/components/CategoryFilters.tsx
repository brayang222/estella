"use client";

import type { Category } from "@/lib/products";

export const ALL_CATEGORIES = "todo";

export function CategoryFilters({
  categories,
  value,
  onChange,
}: {
  categories: Category[];
  value: string;
  onChange: (slug: string) => void;
}) {
  const filters = [{ slug: ALL_CATEGORIES, label: "Todo" }, ...categories];

  return (
    <div className="flex flex-wrap gap-[18px]">
      {filters.map((filter) => (
        <button
          key={filter.slug}
          type="button"
          className={`cursor-pointer border-0 border-b bg-transparent py-1.5 text-[10.5px] font-light tracking-[0.2em] uppercase transition-[color,border-color] duration-300 ease-out ${
            value === filter.slug ? "border-ink text-ink" : "border-transparent text-muted"
          }`}
          onClick={() => onChange(filter.slug)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
