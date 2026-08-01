"use client";

import { useState } from "react";
import { formatPrice, type Product } from "@/lib/products";
import { waLink, waProductMessage } from "@/lib/whatsapp";

export function ProductOrderPanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="grid gap-6 self-start">
      <div className="grid gap-2">
        <span className="text-[10px] tracking-[0.3em] text-gold uppercase">
          {product.category.label}
        </span>
        <h1 className="m-0 font-display text-[clamp(28px,4vw,44px)] leading-[1.08]">
          {product.name}
        </h1>
        <span className="text-[19px] tracking-[0.04em] text-muted">
          {formatPrice(product.price)}
        </span>
      </div>

      <div className="h-px bg-ink/12" />

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

      <a
        href={waLink(waProductMessage(product.name, formatPrice(product.price), quantity))}
        target="_blank"
        rel="noopener"
        className="block bg-ink py-4 text-center text-[11px] tracking-[0.22em] text-paper uppercase transition-[background-color,transform] duration-[400ms] ease-estella hover:-translate-y-0.5 hover:bg-gold"
      >
        Consultar por WhatsApp
      </a>

      <p className="m-0 text-[12px] leading-[1.8] text-muted">
        Referencia {product.referenceCode} · Series numeradas y limitadas. Empaque de regalo
        incluido, envío asegurado a todo el país.
      </p>
    </div>
  );
}
