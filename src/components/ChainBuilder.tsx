"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { PlaceholderImage } from "./PlaceholderImage";
import { useCart } from "@/lib/store";
import { imageUrl } from "@/lib/images";
import { formatPrice, type Product } from "@/lib/products";
import { useSiteSettings } from "@/lib/settings-context";
import { waCartMessage, waLink } from "@/lib/whatsapp";

const DEFAULT_DROP_POINT = { xPct: 48, yPct: 87 };
const CHARM_SPREAD_PX = 64;

export function ChainBuilder({ chains, charms }: { chains: Product[]; charms: Product[] }) {
  const settings = useSiteSettings();
  const { add } = useCart();
  const { data: session } = useSession();
  const [chainSlug, setChainSlug] = useState<string | null>(chains[0]?.slug ?? null);
  const [charmSlugs, setCharmSlugs] = useState<string[]>([]);
  const [added, setAdded] = useState(false);

  const chain = chains.find((c) => c.slug === chainSlug) ?? null;
  const maxCharms = chain?.maxCharms ?? 1;
  const selectedCharms = useMemo(
    () => charmSlugs.map((slug) => charms.find((c) => c.slug === slug)).filter((c): c is Product => Boolean(c)),
    [charmSlugs, charms]
  );
  const total = (chain?.price ?? 0) + selectedCharms.reduce((sum, c) => sum + c.price, 0);
  const dropPoint = chain
    ? { xPct: chain.dropPointX ?? DEFAULT_DROP_POINT.xPct, yPct: chain.dropPointY ?? DEFAULT_DROP_POINT.yPct }
    : DEFAULT_DROP_POINT;

  function selectChain(slug: string) {
    setChainSlug(slug);
    // Si la nueva cadena admite menos dijes que los ya elegidos, recorta al límite.
    const nextMax = chains.find((c) => c.slug === slug)?.maxCharms ?? 1;
    setCharmSlugs((current) => current.slice(0, nextMax));
  }

  function toggleCharm(slug: string) {
    setCharmSlugs((current) => {
      if (current.includes(slug)) return current.filter((s) => s !== slug);
      if (maxCharms === 1) return [slug]; // solo admite uno: cambia, no acumula
      if (current.length >= maxCharms) return current; // límite alcanzado
      return [...current, slug];
    });
  }

  function addToBag() {
    if (!chain) return;
    add(chain.slug, 1);
    for (const charm of selectedCharms) add(charm.slug, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  const waMessage = chain
    ? waCartMessage(
        [chain, ...selectedCharms].map((item) => ({
          name: item.name,
          reference: item.referenceCode,
          price: formatPrice(item.price),
          quantity: 1,
        })),
        formatPrice(total),
        session?.user?.name
      )
    : "";

  return (
    <div className="grid gap-x-[clamp(40px,6vw,80px)] gap-y-10 md:grid-cols-2 md:items-start">
      {/* Vista previa: la foto real de la cadena, con las fotos reales de los dijes puestas donde caen.
          Sin aspect-ratio fijo ni object-fit: la foto se muestra a su tamaño
          natural (igual que el DropPointPicker del admin), así el % guardado
          coincide siempre con la foto real sin importar su proporción. Los
          96px de padding abajo son espacio real reservado para que un dije
          colgando cerca del borde no se corte. */}
      <div className="relative border border-ink/12 bg-white pb-24 md:sticky md:top-28">
        {chain && !chain.images[0]?.url ? (
          <p className="m-0 grid place-items-center px-6 py-24 text-center text-[12px] text-muted">
            Esta cadena todavía no tiene foto — súbela desde /admin/productos.
          </p>
        ) : chain ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl(chain.images[0]?.url)} alt={chain.name} className="block w-full" />
            {selectedCharms.map((charm, index) => {
              const offset = (index - (selectedCharms.length - 1) / 2) * CHARM_SPREAD_PX;
              return (
                <div
                  key={charm.slug}
                  className="absolute size-20 drop-shadow-[0_3px_5px_rgba(20,18,15,0.35)] sm:size-24"
                  style={{
                    left: `calc(${dropPoint.xPct}% + ${offset}px)`,
                    top: `${dropPoint.yPct}%`,
                    // Centra en X, pero en Y sube solo lo justo para que la
                    // argolla (arriba del recorte, no el centro) quede en el
                    // punto de caída y el dije cuelgue hacia abajo desde ahí.
                    transform: "translate(-50%, -10%)",
                  }}
                >
                  <PlaceholderImage
                    label={charm.placeholderLabel}
                    tone={2}
                    src={charm.images[0]?.url}
                    alt={charm.name}
                    sizes="96px"
                    className="!object-contain"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="m-0 grid place-items-center px-6 py-24 text-center text-[12px] text-muted">
            Elige una cadena para empezar
          </p>
        )}
      </div>

      <div className="grid gap-8">
        {/* Resumen: lo elegido, como chips removibles. */}
        <div className="grid gap-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] tracking-[0.2em] text-muted uppercase">Tu combinación</span>
            <span className="font-display text-[24px] tabular-nums">{formatPrice(total)}</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {chain && (
              <div className="grid w-16 gap-1.5 justify-items-center">
                <div className="relative size-16 overflow-hidden border border-ink/15 bg-img-1">
                  <PlaceholderImage label={chain.placeholderLabel} tone={1} src={chain.images[0]?.url} alt={chain.name} sizes="64px" />
                </div>
                <span className="text-center text-[9.5px] leading-tight text-muted">{chain.name}</span>
              </div>
            )}
            {selectedCharms.map((charm) => (
              <div key={charm.slug} className="grid w-16 gap-1.5 justify-items-center">
                <div className="relative size-16">
                  <div className="absolute inset-0 overflow-hidden rounded-full border border-ink/15 bg-img-2">
                    <PlaceholderImage label={charm.placeholderLabel} tone={2} src={charm.images[0]?.url} alt={charm.name} sizes="64px" />
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCharm(charm.slug)}
                    aria-label={`Quitar ${charm.name}`}
                    className="absolute -top-1 -right-1 z-[1] flex size-5 cursor-pointer items-center justify-center rounded-full bg-ink text-[10px] text-paper"
                  >
                    ✕
                  </button>
                </div>
                <span className="text-center text-[9.5px] leading-tight text-muted">{charm.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Paso 1: cadena */}
        <div className="grid gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-ink text-[10px] text-paper">1</span>
            <span className="text-[10px] tracking-[0.2em] text-gold uppercase">Elige tu cadena</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {chains.map((option) => (
              <button
                key={option.slug}
                type="button"
                onClick={() => selectChain(option.slug)}
                className={`grid gap-1.5 border p-2 text-left transition-colors duration-200 ease-out ${
                  chainSlug === option.slug ? "border-ink" : "border-ink/12 hover:border-ink/30"
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-img-1">
                  <PlaceholderImage
                    label={option.placeholderLabel}
                    tone={1}
                    labelPosition="center"
                    src={option.images[0]?.url}
                    alt={option.name}
                    sizes="(min-width: 640px) 20vw, 30vw"
                  />
                </div>
                <span className="truncate text-[9.5px] tracking-[0.04em] uppercase">{option.name}</span>
                <span className="text-[10.5px] text-muted">{formatPrice(option.price)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Paso 2: dijes */}
        <div className="grid gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-ink text-[10px] text-paper">2</span>
            <span className="text-[10px] tracking-[0.2em] text-gold uppercase">
              Agrega tus dijes ({selectedCharms.length}/{maxCharms})
            </span>
          </div>
          {maxCharms === 1 && (
            <p className="m-0 text-[11px] text-muted">Esta cadena admite un solo dije.</p>
          )}
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {charms.map((option) => {
              const selected = charmSlugs.includes(option.slug);
              const limitReached = !selected && selectedCharms.length >= maxCharms && maxCharms > 1;
              return (
                <button
                  key={option.slug}
                  type="button"
                  onClick={() => toggleCharm(option.slug)}
                  disabled={limitReached}
                  className={`relative grid gap-1.5 border p-2 text-left transition-colors duration-200 ease-out ${
                    selected ? "border-ink" : "border-ink/12 hover:border-ink/30"
                  } ${limitReached ? "cursor-default opacity-40" : ""}`}
                >
                  {selected && (
                    <span className="absolute top-1.5 right-1.5 z-[1] flex size-4 items-center justify-center rounded-full bg-ink text-[9px] text-paper">
                      ✓
                    </span>
                  )}
                  <div className="relative aspect-square overflow-hidden rounded-full bg-img-2">
                    <PlaceholderImage
                      label={option.placeholderLabel}
                      tone={2}
                      labelPosition="center"
                      src={option.images[0]?.url}
                      alt={option.name}
                      sizes="(min-width: 640px) 20vw, 30vw"
                    />
                  </div>
                  <span className="truncate text-[9.5px] tracking-[0.04em] uppercase">{option.name}</span>
                  <span className="text-[10.5px] text-muted">{formatPrice(option.price)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Acciones */}
        <div className="grid gap-3">
          <button
            type="button"
            disabled={!chain}
            onClick={addToBag}
            className="cursor-pointer bg-ink py-4 text-center text-[11px] tracking-[0.22em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold disabled:cursor-default disabled:opacity-40"
          >
            {added ? "Añadido a tu bolsa" : `Agregar a la bolsa · ${formatPrice(total)}`}
          </button>
          <a
            href={chain ? waLink(waMessage, settings.whatsappNumber) : undefined}
            target="_blank"
            rel="noopener"
            aria-disabled={!chain}
            className={`block border border-ink/25 py-4 text-center text-[11px] tracking-[0.22em] uppercase transition-colors duration-300 ease-out ${
              chain ? "hover:border-ink hover:bg-paper-alt" : "pointer-events-none opacity-40"
            }`}
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
