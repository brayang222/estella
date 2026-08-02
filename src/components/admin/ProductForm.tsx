"use client";

import { useActionState } from "react";
import type { ProductFormState } from "@/lib/admin/products";
import type { Category, Product } from "@/lib/products";

const IMAGE_SLOTS = [1, 2, 3, 4] as const;

const inputClass =
  "border border-ink/20 bg-transparent px-3 py-2 text-[14px] focus:border-ink focus:outline-none";
const labelClass = "text-[10px] tracking-[0.15em] text-muted uppercase";

export function ProductForm({
  categories,
  product,
  action,
}: {
  categories: Category[];
  product?: Product;
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const images = product?.images ?? [];

  return (
    <form action={formAction} className="grid max-w-[640px] gap-5">
      {state.error && (
        <p className="m-0 bg-red-50 p-3 text-[13px] text-red-700">{state.error}</p>
      )}

      <label className="grid gap-1.5">
        <span className={labelClass}>Nombre</span>
        <input name="name" defaultValue={product?.name} required className={inputClass} />
      </label>

      <label className="grid gap-1.5">
        <span className={labelClass}>Categoría</span>
        <select
          name="categoryId"
          defaultValue={product?.categoryId ?? ""}
          required
          className={inputClass}
        >
          <option value="" disabled>
            Selecciona…
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-5">
        <label className="grid gap-1.5">
          <span className={labelClass}>Referencia</span>
          <input
            name="referenceCode"
            defaultValue={product?.referenceCode}
            required
            className={inputClass}
          />
        </label>
        <label className="grid gap-1.5">
          <span className={labelClass}>Precio (COP)</span>
          <input
            name="price"
            type="number"
            min="1"
            step="1"
            defaultValue={product?.price}
            required
            className={inputClass}
          />
        </label>
      </div>

      <label className="grid gap-1.5">
        <span className={labelClass}>Etiqueta (ej. Nuevo, Serie 01, Últimas)</span>
        <input name="tag" defaultValue={product?.tag} className={inputClass} />
      </label>

      <label className="grid gap-1.5">
        <span className={labelClass}>Descripción</span>
        <textarea
          name="description"
          defaultValue={product?.description}
          required
          rows={4}
          className={inputClass}
        />
      </label>

      <label className="grid gap-1.5">
        <span className={labelClass}>Medidas</span>
        <input
          name="measurements"
          defaultValue={product?.measurements ?? ""}
          placeholder="Cadena: 42 cm + 5 cm de extensor."
          className={inputClass}
        />
      </label>

      <label className="flex items-center gap-2.5">
        <input type="checkbox" name="available" defaultChecked={product?.available ?? true} />
        <span className="text-[12px]">Disponible</span>
      </label>

      <div className="grid gap-3">
        <span className={labelClass}>Fotos (hasta 4 — la primera es la miniatura)</span>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {IMAGE_SLOTS.map((slot) => {
            const existing = images.find((image) => image.order === slot);
            return (
              <div key={slot} className="grid gap-2">
                {existing ? (
                  <div className="relative aspect-square overflow-hidden bg-img-1">
                    {/* eslint-disable-next-line @next/next/no-img-element -- small local admin thumbnail, next/image is overkill here */}
                    <img
                      src={existing.url}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-img-1" />
                )}
                <input
                  type="file"
                  name={`image${slot}`}
                  accept="image/webp,image/jpeg,image/png"
                  className="text-[10px]"
                />
                {existing && (
                  <label className="flex items-center gap-1.5 text-[11px] text-muted">
                    <input type="checkbox" name={`remove${slot}`} /> Eliminar
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="cursor-pointer justify-self-start bg-ink px-8 py-3 text-[11px] tracking-[0.2em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold disabled:cursor-default disabled:opacity-60"
      >
        {pending ? "Guardando…" : product ? "Guardar cambios" : "Crear pieza"}
      </button>
    </form>
  );
}
