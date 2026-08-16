"use client";

import { useEffect, useState, ViewTransition } from "react";
import Link from "next/link";
import { FavoriteButton } from "./FavoriteButton";
import { PlaceholderImage } from "./PlaceholderImage";
import { LOW_STOCK_THRESHOLD, SOCIAL_PROOF_THRESHOLD, formatPrice, type Product } from "@/lib/products";
import { useSiteSettings } from "@/lib/settings-context";
import { waLink, waProductMessage, waRestockMessage } from "@/lib/whatsapp";

const AUTOPLAY_MS = 1500;

/**
 * `morph` controla si la tarjeta comparte el nombre de transición con la
 * galería de la ficha. Solo puede hacerlo una tarjeta por pieza y por página:
 * las secciones secundarias de la propia ficha (relacionados, vistos
 * recientemente) muestran piezas que pueden ser la que se está dejando, y dos
 * elementos con el mismo nombre montados a la vez hacen que View Transitions
 * aborte la animación — que es justo lo que se sentía como lentitud al hacer
 * clic.
 */
export function ProductCard({ product, morph = true }: { product: Product; morph?: boolean }) {
  const settings = useSiteSettings();
  const images = product.images;
  const lowStock =
    product.available && product.stock !== null && product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;
  const showSocialProof = product._count.favorites >= SOCIAL_PROOF_THRESHOLD;
  const hasAlternates = images.length > 1;
  const canCycle = images.length > 2;

  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  // Extra photos are only mounted after the first hover so a grid of many
  // cards doesn't download every alternate image up front.
  const [primed, setPrimed] = useState(false);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (!hovered || manual || !canCycle) return;
    const id = setInterval(() => {
      // Cycle through the alternates only; image 0 is the "resting" shot.
      setIndex((i) => (i % (images.length - 1)) + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [hovered, manual, canCycle, images.length]);

  function handleEnter() {
    setHovered(true);
    setPrimed(true);
    if (hasAlternates) setIndex(1);
  }

  function handleLeave() {
    setHovered(false);
    setManual(false);
    setIndex(0);
  }

  function step(direction: 1 | -1) {
    setManual(true);
    setIndex((i) => (i + direction + images.length) % images.length);
  }

  const renderedImages = primed ? images : images.slice(0, 1);

  const galeria = (
      <div
        className="group relative aspect-[4/5] overflow-hidden bg-img-1"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <Link href={`/producto/${product.slug}`} className="absolute inset-0 block">
          {images.length === 0 ? (
            <PlaceholderImage
              label={product.placeholderLabel}
              angle={128}
              spacing={10}
              tone={1}
              labelPosition="center"
              className="transition-transform duration-[1100ms] ease-estella group-hover:scale-[1.04]"
              alt={product.name}
            />
          ) : (
            renderedImages.map((image, i) => (
              <div
                key={image.id}
                className={`absolute inset-0 transition-[opacity,transform] duration-500 ease-estella group-hover:scale-[1.04] ${
                  product.available ? "" : "opacity-70 grayscale-[35%]"
                }`}
                style={{ opacity: i === index ? 1 : 0 }}
              >
                <PlaceholderImage
                  label={product.placeholderLabel}
                  angle={128}
                  spacing={10}
                  tone={1}
                  labelPosition="center"
                  src={image.url}
                  alt={i === 0 ? product.name : ""}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                />
              </div>
            ))
          )}
        </Link>

        <div className="pointer-events-none absolute top-2.5 left-2.5 z-[1] grid gap-1">
          {product.available ? (
            <span className="text-[9px] tracking-[0.2em] text-muted uppercase">
              {product.tag}
              {lowStock && <span className="text-gold"> · quedan {product.stock}</span>}
            </span>
          ) : (
            <span className="w-fit bg-ink px-2 py-1 text-[9px] tracking-[0.2em] text-paper uppercase">
              Agotado
            </span>
          )}
          {showSocialProof && (
            <span className="w-fit bg-paper/90 px-2 py-1 text-[9px] tracking-[0.15em] text-ink uppercase">
              ♥ Favorito de la casa
            </span>
          )}
        </div>

        <FavoriteButton
          slug={product.slug}
          className="absolute top-2.5 right-2.5 z-[2] flex h-8 w-8 cursor-pointer items-center justify-center text-ink transition-transform duration-200 ease-out hover:scale-110"
        />

        {canCycle && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={() => step(-1)}
              className="absolute top-1/2 left-2 z-[3] flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center bg-paper/90 text-[14px] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Foto siguiente"
              onClick={() => step(1)}
              className="absolute top-1/2 right-2 z-[3] flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center bg-paper/90 text-[14px] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
            >
              ›
            </button>
          </>
        )}

        <div className="absolute inset-x-2.5 bottom-2.5 z-[2] translate-y-1.5 opacity-0 transition-[opacity,transform] duration-500 ease-estella group-hover:translate-y-0 group-hover:opacity-100">
          <a
            href={waLink(
              product.available
                ? waProductMessage(product.name, formatPrice(product.price))
                : waRestockMessage(product.name)
            , settings.whatsappNumber)}
            target="_blank"
            rel="noopener"
            className="cursor-pointer border-2 border-black rounded-md block bg-paper p-[13px] text-center text-sm tracking-[0.2em] text-ink uppercase transition-colors duration-300 ease-out hover:bg-ink hover:text-paper"
          >
            {product.available ? "Consultar pieza" : "Avisarme cuando vuelva"}
          </a>
        </div>
      </div>
  );

  return (
    <div className="grid gap-3.5">
      {morph ? (
        <ViewTransition name={`product-image-${product.slug}`} share="morph">
          {galeria}
        </ViewTransition>
      ) : (
        galeria
      )}

      <div className="flex items-baseline justify-between gap-2.5 border-t border-ink/12 pt-0.5">
        <Link href={`/producto/${product.slug}`}>
          <h3 className="mt-2 text-[11px] font-normal tracking-[0.18em] uppercase hover:text-gold">
            {product.name}
          </h3>
        </Link>
        <span className="mt-2 text-[11.5px] tracking-[0.06em] text-muted whitespace-nowrap">
          {formatPrice(product.price)}
        </span>
      </div>
    </div>
  );
}
