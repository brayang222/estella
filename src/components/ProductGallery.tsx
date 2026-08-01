"use client";

import { useState } from "react";
import { PlaceholderImage } from "./PlaceholderImage";
import type { ProductImage } from "@/lib/products";

type Props = {
  images: ProductImage[];
  slug: string;
  alt: string;
  tag: string;
  placeholderLabel: string;
};

export function ProductGallery({ images, slug, alt, tag, placeholderLabel }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = images.length > 1;
  const active = images[activeIndex];

  return (
    <div className="grid gap-3">
      <div
        className="group relative aspect-[4/5] overflow-hidden bg-img-1"
        style={{ viewTransitionName: `product-image-${slug}` }}
      >
        <PlaceholderImage
          key={active?.id ?? "placeholder"}
          label={placeholderLabel}
          angle={128}
          spacing={10}
          tone={1}
          labelPosition="center"
          src={active?.url}
          alt={alt}
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
        />
        <span className="pointer-events-none absolute top-3 right-3 z-[1] bg-paper px-[9px] py-[5px] text-[9px] tracking-[0.2em] text-muted uppercase">
          {tag}
        </span>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => setActiveIndex((i) => (i - 1 + images.length) % images.length)}
              aria-label="Foto anterior"
              className="absolute top-1/2 left-2.5 z-[1] flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center bg-paper/90 text-[15px] transition-colors duration-300 ease-out hover:bg-paper"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((i) => (i + 1) % images.length)}
              aria-label="Foto siguiente"
              className="absolute top-1/2 right-2.5 z-[1] flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center bg-paper/90 text-[15px] transition-colors duration-300 ease-out hover:bg-paper"
            >
              ›
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver foto ${index + 1}`}
              aria-current={index === activeIndex}
              className={`relative aspect-square overflow-hidden bg-img-1 transition-opacity duration-300 ease-out ${
                index === activeIndex ? "opacity-100" : "opacity-60 hover:opacity-100"
              }`}
              style={{
                outline: index === activeIndex ? "1px solid var(--color-ink)" : undefined,
                outlineOffset: "2px",
              }}
            >
              <PlaceholderImage
                label={placeholderLabel}
                angle={128}
                spacing={10}
                tone={1}
                labelPosition="center"
                src={image.url}
                alt=""
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
