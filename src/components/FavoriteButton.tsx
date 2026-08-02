"use client";

import { useFavorites } from "@/lib/store";

export function FavoriteButton({ slug, className }: { slug: string; className?: string }) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(slug);

  return (
    <button
      type="button"
      aria-label={active ? "Quitar de favoritos" : "Guardar en favoritos"}
      aria-pressed={active}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(slug);
      }}
      className={className}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M12 20.2 4.9 13.3C2.6 11 2.6 7.4 4.9 5.1c2.2-2.2 5.7-2.2 7.9 0l.2.2.2-.2c2.2-2.2 5.7-2.2 7.9 0 2.3 2.3 2.3 5.9 0 8.2L12 20.2Z" />
      </svg>
    </button>
  );
}
