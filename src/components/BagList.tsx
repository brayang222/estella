"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { PlaceholderImage } from "./PlaceholderImage";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { useCart } from "@/lib/store";
import { MAX_QUANTITY } from "@/lib/account/types";
import { formatPrice, type Product } from "@/lib/products";
import { setShippingDetails, useShippingDetails } from "@/lib/shipping-details";
import { useSiteSettings } from "@/lib/settings-context";
import { waCartMessage, waLink } from "@/lib/whatsapp";

const fieldClass =
  "border border-ink/20 bg-transparent px-3 py-2.5 text-[13.5px] placeholder:text-ink/25 focus:border-ink focus:outline-none";

const stepperClass =
  "h-9 w-9 cursor-pointer border border-ink/20 text-[15px] leading-none transition-colors duration-300 ease-out hover:border-ink disabled:cursor-default disabled:opacity-40";

export function BagList({ products }: { products: Product[] }) {
  const settings = useSiteSettings();
  const { lines, setQuantity, remove, clear, ready, authenticated } = useCart();
  const { data: session } = useSession();
  const { name, city } = useShippingDetails();

  const bySlug = new Map(products.map((product) => [product.slug, product]));
  // A piece deleted from the catalogue after being added simply drops out.
  const items = lines
    .map((line) => ({ product: bySlug.get(line.slug), quantity: line.quantity }))
    .filter((item): item is { product: Product; quantity: number } => Boolean(item.product));

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const faltaParaEnvioGratis = Math.max(0, settings.freeShippingFrom - total);

  if (!ready) {
    return <p className="m-0 text-[13px] text-muted">Cargando tu bolsa…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="grid place-items-center gap-4 border border-ink/12 py-[clamp(48px,7vw,80px)] text-center">
        <p className="m-0 max-w-[42ch] text-[14px] leading-[1.8] text-muted text-pretty">
          Tu bolsa está vacía. Guarda las piezas que te gusten y pídelas todas juntas por
          WhatsApp cuando estés lista.
        </p>
        <Link
          href="/productos"
          className="bg-ink px-8 py-3 text-[10px] tracking-[0.2em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold"
        >
          Ver las piezas
        </Link>
      </div>
    );
  }

  const message = waCartMessage(
    items.map((item) => ({
      name: item.product.name,
      reference: item.product.referenceCode,
      price: formatPrice(item.product.price * item.quantity),
      quantity: item.quantity,
    })),
    formatPrice(total),
    name.trim() || session?.user?.name,
    city.trim() || null
  );

  return (
    <div className="grid gap-[clamp(24px,3vw,38px)]">
      {!authenticated && (
        <p className="m-0 border border-ink/12 bg-paper-alt px-5 py-4 text-[12.5px] leading-[1.7] text-muted">
          Tu bolsa se guarda en este navegador.{" "}
          <Link href="/login?callbackUrl=%2Fbolsa" className="text-ink underline underline-offset-4">
            Inicia sesión
          </Link>{" "}
          o{" "}
          <Link href="/registro?callbackUrl=%2Fbolsa" className="text-ink underline underline-offset-4">
            crea tu cuenta
          </Link>{" "}
          para conservarla en cualquier dispositivo.
        </p>
      )}

      <ul className="m-0 grid list-none gap-0 p-0">
        {items.map(({ product, quantity }) => (
          <li
            key={product.id}
            className="grid grid-cols-[76px_1fr] items-start gap-4 border-b border-ink/12 py-5 sm:grid-cols-[96px_1fr_auto] sm:gap-6"
          >
            <Link
              href={`/producto/${product.slug}`}
              className="relative block aspect-[4/5] overflow-hidden bg-img-1"
            >
              <PlaceholderImage
                label={product.placeholderLabel}
                angle={128}
                spacing={10}
                tone={1}
                labelPosition="center"
                src={product.images[0]?.url}
                alt={product.name}
                sizes="96px"
              />
            </Link>

            <div className="grid gap-2">
              <div className="grid gap-1">
                <Link href={`/producto/${product.slug}`}>
                  <h2 className="m-0 text-[11.5px] font-normal tracking-[0.18em] uppercase hover:text-gold">
                    {product.name}
                  </h2>
                </Link>
                <span className="text-[11px] text-muted">
                  Ref. {product.referenceCode} · {formatPrice(product.price)} c/u
                </span>
                {!product.available && (
                  <span className="w-fit bg-ink px-2 py-0.5 text-[9px] tracking-[0.2em] text-paper uppercase">
                    Agotado
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setQuantity(product.slug, quantity - 1)}
                  aria-label={`Restar una unidad de ${product.name}`}
                  className={stepperClass}
                >
                  −
                </button>
                <span className="w-8 text-center text-[14px] tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(product.slug, quantity + 1)}
                  disabled={quantity >= MAX_QUANTITY}
                  aria-label={`Sumar una unidad de ${product.name}`}
                  className={stepperClass}
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => remove(product.slug)}
                  className="ml-2 cursor-pointer border-0 bg-transparent text-[10px] tracking-[0.2em] text-muted uppercase underline-offset-4 hover:text-ink hover:underline"
                >
                  Quitar
                </button>
              </div>
            </div>

            <span className="col-start-2 text-[13px] tabular-nums sm:col-start-3 sm:text-right">
              {formatPrice(product.price * quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="grid gap-5 sm:justify-items-end">
        <div className="flex items-baseline gap-4 sm:justify-end">
          <span className="text-[10px] tracking-[0.2em] text-muted uppercase">Total</span>
          <span className="font-display text-[26px] tabular-nums">{formatPrice(total)}</span>
        </div>

        {/* Cuánto falta para el envío gratis. Es la única parte de la bolsa
            que puede subir el valor del pedido, así que va pegada al total. */}
        {faltaParaEnvioGratis > 0 ? (
          <p className="m-0 max-w-[46ch] text-[12.5px] leading-[1.7] text-ink sm:text-right">
            Agrega <strong className="font-normal">{formatPrice(faltaParaEnvioGratis)}</strong> más
            y el envío va por nuestra cuenta.
          </p>
        ) : (
          <p className="m-0 max-w-[46ch] text-[12.5px] leading-[1.7] text-gold sm:text-right">
            ¡Tu pedido ya tiene envío gratis!
          </p>
        )}
        {/* Nombre y ciudad viajan dentro del mensaje. El envío se cotiza por
            destino, así que con la ciudad la primera respuesta ya puede traer
            el costo en vez de abrir otra ronda de mensajes. */}
        <div className="grid w-full gap-3 border-t border-ink/12 pt-5 sm:max-w-[380px]">
          <label className="grid gap-1.5">
            <span className="text-[10px] tracking-[0.15em] text-muted uppercase">Tu nombre</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setShippingDetails({ name: event.target.value, city })}
              autoComplete="name"
              maxLength={60}
              placeholder={session?.user?.name ?? "Como quieres que te llamemos"}
              className={fieldClass}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[10px] tracking-[0.15em] text-muted uppercase">
              Ciudad de envío
            </span>
            <input
              type="text"
              value={city}
              onChange={(event) => setShippingDetails({ name, city: event.target.value })}
              autoComplete="address-level2"
              maxLength={60}
              placeholder="Ej. Medellín"
              className={fieldClass}
            />
          </label>
        </div>

        <p className="m-0 max-w-[46ch] text-[12px] leading-[1.7] text-muted sm:text-right">
          El pedido se confirma por WhatsApp: allí acordamos el envío y el medio de pago.
        </p>
        <div className="flex flex-wrap items-center gap-5 sm:justify-end">
          <button
            type="button"
            onClick={clear}
            className="cursor-pointer border-0 bg-transparent text-[10px] tracking-[0.2em] text-muted uppercase underline-offset-4 hover:text-ink hover:underline"
          >
            Vaciar bolsa
          </button>
          <a
            href={waLink(message, settings.whatsappNumber)}
            target="_blank"
            rel="noopener"
            className="bg-ink px-8 py-4 text-[11px] tracking-[0.22em] text-paper uppercase transition-[background-color,transform] duration-[400ms] ease-estella hover:-translate-y-0.5 hover:bg-gold"
          >
            Pedir por WhatsApp
          </a>
        </div>
      </div>

      <p className="m-0 text-[12px] text-muted">
        ¿Dudas antes de pedir?{" "}
        <a
          href={waLink(settings.whatsappGreeting, settings.whatsappNumber)}
          target="_blank"
          rel="noopener"
          className="text-ink underline underline-offset-4"
        >
          Escríbenos
        </a>
        .
      </p>

      {/* Barra fija solo en móvil: con varias piezas la lista puede ser larga
          y el resumen de arriba queda lejos — el total y el botón de pedir
          siempre quedan a la mano mientras se revisa la bolsa. */}
      <div
        className="fixed inset-x-0 bottom-0 z-[65] flex items-center gap-3 border-t border-ink/12 bg-paper/95 px-gutter py-3 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <div className="grid min-w-0 flex-1 leading-tight">
          <span className="text-[10px] tracking-[0.15em] text-muted uppercase">Total</span>
          <span className="text-[15px]">{formatPrice(total)}</span>
        </div>
        <a
          href={waLink(message, settings.whatsappNumber)}
          target="_blank"
          rel="noopener"
          className="flex shrink-0 cursor-pointer items-center gap-2 bg-ink px-5 py-2.5 text-[10px] tracking-[0.15em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold"
        >
          <WhatsAppIcon className="size-[18px] text-white" />
          Pedir
        </a>
      </div>
      <div className="h-[76px] md:hidden" aria-hidden="true" />
    </div>
  );
}
