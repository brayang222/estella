"use client";

import { useState } from "react";
import Link from "next/link";
import { FavoriteButton } from "./FavoriteButton";
import { useCart } from "@/lib/store";
import { formatPrice, type Product } from "@/lib/products";
import { useSiteSettings } from "@/lib/settings-context";
import { waLink, waProductMessage, waRestockMessage } from "@/lib/whatsapp";

const COPY_FEEDBACK_MS = 1600;
const ADDED_FEEDBACK_MS = 2200;

export function ProductOrderPanel({ product }: { product: Product }) {
  const settings = useSiteSettings();
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);
  const { add, quantityOf } = useCart();
  const inBag = quantityOf(product.slug);

  function addToBag() {
    add(product.slug, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), ADDED_FEEDBACK_MS);
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
        document.execCommand("copy");
        flash();
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
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Sumar cantidad"
                className="h-11 w-11 cursor-pointer border border-ink/20 text-[15px] leading-none transition-colors duration-300 ease-out hover:border-ink"
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
              href={waLink(waProductMessage(product.name, formatPrice(product.price), quantity), settings.whatsappNumber)}
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
          </div>
        </>
      ) : (
        <a
          href={waLink(waRestockMessage(product.name), settings.whatsappNumber)}
          target="_blank"
          rel="noopener"
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

      <p className="m-0 text-[12px] leading-[1.8] text-muted">
        Referencia {product.referenceCode} · {settings.productNote}
      </p>
    </div>
  );
}
