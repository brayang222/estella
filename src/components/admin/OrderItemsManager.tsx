"use client";

import { useActionState, useTransition } from "react";
import { addOrderItem, removeOrderItem, type OrderItemFormState } from "@/lib/admin/orders";
import { formatPrice } from "@/lib/products";

const inputClass =
  "border border-ink/20 bg-transparent px-3 py-2 text-[13px] focus:border-ink focus:outline-none";

type Item = { id: string; name: string; price: number; quantity: number };

const initialState: OrderItemFormState = {};

export function OrderItemsManager({
  orderId,
  items,
  products,
}: {
  orderId: string;
  items: Item[];
  products: { id: string; name: string; price: number }[];
}) {
  const action = addOrderItem.bind(null, orderId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [removing, startTransition] = useTransition();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="grid gap-4">
      {items.length > 0 && (
        <ul className="m-0 grid list-none gap-2 p-0">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 border-b border-ink/10 pb-2">
              <span className="text-[13px]">
                {item.quantity} × {item.name}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-muted">{formatPrice(item.price * item.quantity)}</span>
                <button
                  type="button"
                  disabled={removing}
                  onClick={() => startTransition(() => removeOrderItem(orderId, item.id))}
                  className="cursor-pointer border-0 bg-transparent text-[10px] tracking-[0.1em] text-red-700 uppercase underline-offset-4 hover:underline disabled:opacity-50"
                >
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between text-[14px]">
        <span className="tracking-[0.1em] text-muted uppercase">Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      <form action={formAction} className="grid gap-3 sm:grid-cols-[1fr_90px_auto] sm:items-end">
        {state.error && <p className="m-0 text-[12px] text-red-700 sm:col-span-3">{state.error}</p>}
        <label className="grid gap-1">
          <span className="text-[10px] text-muted uppercase">Pieza</span>
          <select name="productId" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Elige una pieza…
            </option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} — {formatPrice(product.price)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-[10px] text-muted uppercase">Cant.</span>
          <input name="quantity" type="number" min={1} defaultValue={1} required className={inputClass} />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer bg-ink px-4 py-2 text-[11px] tracking-[0.15em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold disabled:cursor-default disabled:opacity-60"
        >
          {pending ? "…" : "Agregar"}
        </button>
      </form>
    </div>
  );
}
