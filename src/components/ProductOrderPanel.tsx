"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { FavoriteButton } from "./FavoriteButton";
import { PlaceholderImage } from "./PlaceholderImage";
import { SizeGuide } from "./SizeGuide";
import { ShareButton } from "./ShareButton";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { useCart } from "@/lib/store";
import { LOW_STOCK_THRESHOLD, SOCIAL_PROOF_THRESHOLD, formatPrice, type Product } from "@/lib/products";
import { recordRestockRequest } from "@/lib/restock";
import { useSiteSettings } from "@/lib/settings-context";
import { waLink, waProductMessage, waRestockMessage } from "@/lib/whatsapp";

/** Alto de la barra fija de móvil, para reservarle espacio al final del panel. */
const STICKY_BAR_SPACER_CLASS = "h-[76px] md:hidden";

const COPY_FEEDBACK_MS = 1600;
const ADDED_FEEDBACK_MS = 2200;

export function ProductOrderPanel({ product, related = [] }: { product: Product; related?: Product[] }) {
  const settings = useSiteSettings();
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);
  const [showCrossSell, setShowCrossSell] = useState(false);
  const [justAddedRelated, setJustAddedRelated] = useState<Set<string>>(new Set());
  const crossSellRef = useRef<HTMLDivElement>(null);
  const { add, quantityOf } = useCart();
  const inBag = quantityOf(product.slug);
  const maxQuantity = product.stock ?? Infinity;
  const lowStock = product.available && product.stock !== null && product.stock <= LOW_STOCK_THRESHOLD;
  const showSocialProof = product._count.favorites >= SOCIAL_PROOF_THRESHOLD;

  function addToBag() {
    add(product.slug, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), ADDED_FEEDBACK_MS);
    if (related.length > 0) {
      setShowCrossSell(true);
      // Puede venir de la barra fija de móvil, lejos de donde aparece el
      // panel — lo centra en pantalla para que no pase desapercibido.
      requestAnimationFrame(() =>
        crossSellRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      );
    }
  }

  function addRelated(slug: string) {
    add(slug, 1);
    setJustAddedRelated((prev) => new Set(prev).add(slug));
    setTimeout(() => {
      setJustAddedRelated((prev) => {
        const next = new Set(prev);
        next.delete(slug);
        return next;
      });
    }, ADDED_FEEDBACK_MS);
  }

  function copyReference() {
    const flash = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
    };
    navigator.clipboard.writeText(product.referenceCode).then(flash, () => {
      // Clipboard API can reject (older Safari, non-secure context, no
      // active user-activation) — fall back to the legacy selection copy.
      const input = document.createElement("textarea");
      input.value = product.referenceCode;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      try {
        // Se comprueba el resultado: avisar "copiada" sin haber copiado deja a
        // la clienta pegando algo que no está en su portapapeles.
        if (document.execCommand("copy")) flash();
      } finally {
        document.body.removeChild(input);
      }
    });
  }

  return (
    <div className="grid gap-6 self-start">
      <div className="grid gap-2">
        <div className="flex items-start justify-between gap-3">
          <span className="text-[10px] tracking-[0.3em] text-gold uppercase">
            {product.category.label}
          </span>
          <FavoriteButton
            slug={product.slug}
            className="-mt-1 -mr-1 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center text-ink transition-transform duration-200 ease-out hover:scale-110"
          />
        </div>
        <h1 className="m-0 font-display text-[clamp(28px,4vw,44px)] leading-[1.08]">
          {product.name}
        </h1>
        <span className="text-[19px] tracking-[0.04em] text-muted">
          {formatPrice(product.price)}
        </span>
        {!product.available && (
          <span className="mt-1 inline-flex w-fit items-center bg-ink px-2.5 py-1 text-[9px] tracking-[0.2em] text-paper uppercase">
            Agotado
          </span>
        )}
        {lowStock && (
          <span className="mt-1 text-[11px] tracking-[0.05em] text-gold">
            ¡Quedan {product.stock}! Pieza numerada y de serie limitada.
          </span>
        )}
        {showSocialProof && (
          <span className="mt-1 text-[11px] tracking-[0.05em] text-muted">
            ♥ {product._count.favorites} personas ya la guardaron en favoritos.
          </span>
        )}
      </div>

      <div className="h-px bg-ink/12" />

      <p className="m-0 max-w-[52ch] text-[14px] leading-[1.85] text-muted text-pretty">
        {product.description}
      </p>

      {product.measurements && (
        <div className="grid gap-1.5">
          <span className="text-[10px] tracking-[0.2em] text-muted uppercase">Medidas</span>
          <p className="m-0 text-[13px] leading-[1.7] text-muted">{product.measurements}</p>
        </div>
      )}

      <SizeGuide categorySlug={product.category.slug} />

      <div className="h-px bg-ink/12" />

      {product.available ? (
        <>
          <div className="grid gap-2.5">
            <span className="text-[10px] tracking-[0.2em] text-muted uppercase">Cantidad</span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Restar cantidad"
                className="h-11 w-11 cursor-pointer border border-ink/20 text-[15px] leading-none transition-colors duration-300 ease-out hover:border-ink"
              >
                −
              </button>
              <span className="w-10 text-center text-[15px]">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                disabled={quantity >= maxQuantity}
                aria-label="Sumar cantidad"
                className="h-11 w-11 cursor-pointer border border-ink/20 text-[15px] leading-none transition-colors duration-300 ease-out hover:border-ink disabled:cursor-default disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          <div className="grid gap-2.5">
            <button
              type="button"
              onClick={addToBag}
              className="cursor-pointer bg-ink py-4 text-center text-[11px] tracking-[0.22em] text-paper uppercase transition-[background-color,transform] duration-[400ms] ease-estella hover:-translate-y-0.5 hover:bg-gold"
            >
              {added ? "Añadida a tu bolsa" : "Agregar a la bolsa"}
            </button>
            <a
              href={waLink(waProductMessage(product.name, formatPrice(product.price), quantity, formatPrice(product.price * quantity)), settings.whatsappNumber)}
              target="_blank"
              rel="noopener"
              className="block border border-ink/25 py-4 text-center text-[11px] tracking-[0.22em] uppercase transition-colors duration-[400ms] ease-estella hover:border-ink hover:bg-paper-alt"
            >
              Consultar por WhatsApp
            </a>
            {inBag > 0 && (
              <Link
                href="/bolsa"
                className="justify-self-center text-[11px] text-muted underline-offset-4 hover:text-gold hover:underline"
              >
                Ya tienes {inBag} {inBag === 1 ? "unidad" : "unidades"} en tu bolsa · verla
              </Link>
            )}

            {showCrossSell && related.length > 0 && (
              <div ref={crossSellRef} className="grid gap-3 border border-ink/12 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] tracking-[0.2em] text-muted uppercase">
                    Completa el look
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCrossSell(false)}
                    aria-label="Cerrar sugerencias"
                    className="cursor-pointer text-muted transition-colors duration-200 ease-out hover:text-ink"
                  >
                    ✕
                  </button>
                </div>
                <ul className="m-0 grid list-none gap-3 p-0">
                  {related.map((item) => {
                    const justAdded = justAddedRelated.has(item.slug);
                    return (
                      <li key={item.id} className="flex items-center gap-3">
                        <Link
                          href={`/producto/${item.slug}`}
                          className="relative size-12 shrink-0 overflow-hidden bg-img-1"
                        >
                          <PlaceholderImage
                            label={item.placeholderLabel}
                            tone={1}
                            labelPosition="center"
                            src={item.images[0]?.url}
                            alt={item.name}
                            sizes="48px"
                          />
                        </Link>
                        <div className="grid min-w-0 flex-1">
                          <Link
                            href={`/producto/${item.slug}`}
                            className="truncate text-[11px] tracking-[0.1em] uppercase hover:text-gold"
                          >
                            {item.name}
                          </Link>
                          <span className="text-[11px] text-muted">{formatPrice(item.price)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => addRelated(item.slug)}
                          disabled={justAdded}
                          aria-label={`Agregar ${item.name} a la bolsa`}
                          className="flex size-8 shrink-0 cursor-pointer items-center justify-center border border-ink/20 text-[13px] transition-colors duration-300 ease-out hover:border-ink disabled:cursor-default"
                        >
                          {justAdded ? "✓" : "+"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </>
      ) : (
        <a
          href={waLink(waRestockMessage(product.name), settings.whatsappNumber)}
          target="_blank"
          rel="noopener"
          onClick={() => recordRestockRequest(product.slug)}
          className="block bg-ink py-4 text-center text-[11px] tracking-[0.22em] text-paper uppercase transition-[background-color,transform] duration-[400ms] ease-estella hover:-translate-y-0.5 hover:bg-gold"
        >
          Avisarme cuando vuelva
        </a>
      )}

      <button
        type="button"
        onClick={copyReference}
        className="cursor-pointer justify-self-start border-b border-ink/30 pb-1 text-[10px] tracking-[0.2em] text-muted uppercase transition-colors duration-300 ease-out hover:border-gold hover:text-gold"
      >
        {copied ? "¡Referencia copiada!" : `Copiar referencia ${product.referenceCode}`}
      </button>

      <ShareButton
        name={product.name}
        className="cursor-pointer justify-self-start border-b border-ink/30 pb-1 text-[10px] tracking-[0.2em] text-muted uppercase transition-colors duration-300 ease-out hover:border-gold hover:text-gold"
      />

      <p className="m-0 text-[12px] leading-[1.8] text-muted">
        Referencia {product.referenceCode} · {settings.productNote}
      </p>

      {/* Barra fija solo en móvil: el panel completo puede quedar varias
          pantallas más arriba mientras se lee la descripción, así que la
          acción de comprar siempre queda a un toque. En desktop no hace
          falta — la galería y el panel se ven juntos sin perderse. */}
      <div
        className="fixed inset-x-0 bottom-0 z-[65] flex items-center gap-3 border-t border-ink/12 bg-paper/95 px-gutter py-3 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <div className="grid min-w-0 flex-1 leading-tight">
          <span className="truncate text-[11px] tracking-[0.05em] uppercase">{product.name}</span>
          <span className="text-[13px] text-muted">{formatPrice(product.price)}</span>
        </div>
        {product.available ? (
          <>
            <button
              type="button"
              onClick={addToBag}
              className="shrink-0 cursor-pointer border border-ink/25 px-3.5 py-2.5 text-[10px] tracking-[0.15em] uppercase transition-colors duration-300 ease-out hover:border-ink"
            >
              {added ? "Añadida" : "Agregar"}
            </button>
            <a
              href={waLink(waProductMessage(product.name, formatPrice(product.price), quantity, formatPrice(product.price * quantity)), settings.whatsappNumber)}
              target="_blank"
              rel="noopener"
              aria-label="Consultar por WhatsApp"
              className="flex shrink-0 cursor-pointer items-center gap-2 bg-ink px-4 py-2.5 text-[10px] tracking-[0.15em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold"
            >
              <WhatsAppIcon className="size-[18px] text-white" />
              Pedir
            </a>
          </>
        ) : (
          <a
            href={waLink(waRestockMessage(product.name), settings.whatsappNumber)}
            target="_blank"
            rel="noopener"
            onClick={() => recordRestockRequest(product.slug)}
            className="flex shrink-0 cursor-pointer items-center gap-2 bg-ink px-4 py-2.5 text-[10px] tracking-[0.15em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold"
          >
            <WhatsAppIcon className="size-[18px] text-white" />
            Avisarme
          </a>
        )}
      </div>
      <div className={STICKY_BAR_SPACER_CLASS} aria-hidden="true" />
    </div>
  );
}
