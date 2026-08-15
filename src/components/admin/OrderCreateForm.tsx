"use client";

import { useActionState } from "react";
import { createOrder, type OrderFormState } from "@/lib/admin/orders";

const inputClass =
  "border border-ink/20 bg-transparent px-3.5 py-3 text-[14px] focus:border-ink focus:outline-none";
const labelClass = "text-[10px] tracking-[0.15em] text-muted uppercase";

const initialState: OrderFormState = {};

export function OrderCreateForm({
  customers,
}: {
  customers: { id: string; label: string }[];
}) {
  const [state, formAction, pending] = useActionState(createOrder, initialState);

  return (
    <form action={formAction} className="grid max-w-[420px] gap-4">
      <label className="grid gap-1.5">
        <span className={labelClass}>Clienta</span>
        <select name="userId" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Elige una clienta…
          </option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1.5">
        <span className={labelClass}>Nota (opcional)</span>
        <textarea name="note" rows={2} className={`${inputClass} resize-none`} />
      </label>

      {state.error && (
        <p className="m-0 text-[12px] text-red-700" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 w-fit cursor-pointer bg-ink px-8 py-3.5 text-[11px] tracking-[0.2em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold disabled:cursor-default disabled:opacity-60"
      >
        {pending ? "Creando…" : "Crear pedido y agregar piezas"}
      </button>
    </form>
  );
}
