"use client";

import { useActionState, useRef, useState } from "react";
import type { ProductFormState } from "@/lib/admin/products";
import { LOW_STOCK_THRESHOLD, type Category, type Product } from "@/lib/products";
import { DropPointPicker } from "./DropPointPicker";

const IMAGE_SLOTS = [1, 2, 3, 4] as const;

const inputClass =
  "border border-ink/20 bg-transparent px-3 py-2 text-[14px] focus:border-ink focus:outline-none";
const labelClass = "text-[10px] tracking-[0.15em] text-muted uppercase";

export function ProductForm({
  categories,
  product,
  action,
  withImageUploads = true,
}: {
  categories: Category[];
  product?: Product;
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  /** Al crear, las fotos van dentro del formulario; al editar las gestiona ProductImagesManager. */
  withImageUploads?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  // v = valores del último envío fallido; permite repoblar el formulario tras el reset de React 19
  const v = state.values;

  const [isCustomizable, setIsCustomizable] = useState(
    v ? v.customizable : (product?.customizable ?? false)
  );

  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null, null]);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);

  function handleFileChange(slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPreviews((prev) => {
      if (prev[slotIndex]) URL.revokeObjectURL(prev[slotIndex]!);
      const next = [...prev];
      next[slotIndex] = file ? URL.createObjectURL(file) : null;
      return next;
    });
  }

  function clearSlot(slotIndex: number) {
    const ref = fileRefs.current[slotIndex];
    if (ref) ref.value = "";
    setPreviews((prev) => {
      if (prev[slotIndex]) URL.revokeObjectURL(prev[slotIndex]!);
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  }

  return (
    // key cambia con cada error devuelto → remonta el form con los defaultValue actualizados
    <form key={state.attempt ?? 0} action={formAction} className="grid max-w-[640px] gap-5">
      {state.error && (
        <p className="m-0 bg-red-50 p-3 text-[13px] text-red-700">{state.error}</p>
      )}

      <label className="grid gap-1.5">
        <span className={labelClass}>Nombre</span>
        <input
          name="name"
          defaultValue={v?.name ?? product?.name}
          required
          className={inputClass}
        />
      </label>

      <label className="grid gap-1.5">
        <span className={labelClass}>Categoría</span>
        <select
          name="categoryId"
          defaultValue={v?.categoryId ?? product?.categoryId ?? ""}
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
            defaultValue={v?.referenceCode ?? product?.referenceCode}
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
            defaultValue={v?.price ?? product?.price}
            required
            className={inputClass}
          />
        </label>
      </div>

      <label className="grid gap-1.5">
        <span className={labelClass}>Etiqueta (ej. Nuevo, Serie 01, Últimas)</span>
        <input name="tag" defaultValue={v?.tag ?? product?.tag} className={inputClass} />
      </label>

      <label className="grid gap-1.5">
        <span className={labelClass}>Descripción</span>
        <textarea
          name="description"
          defaultValue={v?.description ?? product?.description}
          required
          rows={4}
          className={inputClass}
        />
      </label>

      <label className="grid gap-1.5">
        <span className={labelClass}>Medidas</span>
        <input
          name="measurements"
          defaultValue={v?.measurements ?? product?.measurements ?? ""}
          placeholder="Cadena: 42 cm + 5 cm de extensor."
          className={inputClass}
        />
      </label>

      <label className="grid gap-1.5">
        <span className={labelClass}>Stock (opcional)</span>
        <input
          name="stock"
          type="number"
          min="0"
          step="1"
          defaultValue={v?.stock ?? (product?.stock ?? "")}
          placeholder="Sin seguimiento de unidades"
          className={`${inputClass} placeholder:text-ink/25`}
        />
        <span className="text-[11px] text-muted">
          {`Déjalo vacío para no llevar conteo. Con un número, la tienda muestra "¡Quedan pocas!" cuando bajen de ${LOW_STOCK_THRESHOLD}, y 0 marca la pieza como agotada automáticamente.`}
        </span>
      </label>

      <label className="flex items-center gap-2.5">
        <input
          type="checkbox"
          name="available"
          defaultChecked={v ? v.available : (product?.available ?? true)}
        />
        <span className="text-[12px]">Disponible</span>
      </label>

      {withImageUploads && (
        <div className="grid gap-3">
          <div className="grid gap-0.5">
            <span className={labelClass}>Fotos (hasta 4 — la primera es la miniatura)</span>
            <p className="m-0 text-[11px] text-muted">
              Haz clic en cada recuadro para seleccionar una imagen.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {IMAGE_SLOTS.map((slot, slotIndex) => {
              const preview = previews[slotIndex];
              return (
                <div key={slot} className="grid gap-1.5">
                  {/* label como zona clicable; input opacity-0 superpuesto evita el problema de display:none con FormData */}
                  <label className="group relative block aspect-square cursor-pointer overflow-hidden bg-img-1 transition-opacity hover:opacity-75">
                    {preview ? (
                      <img
                        src={preview}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-2xl text-ink/20 select-none group-hover:text-ink/40">
                        +
                      </span>
                    )}
                    {slotIndex === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-ink/65 py-0.5 text-center text-[7px] tracking-[0.12em] text-paper uppercase">
                        Miniatura
                      </span>
                    )}
                    <input
                      ref={(el) => {
                        fileRefs.current[slotIndex] = el;
                      }}
                      type="file"
                      name={`image${slot}`}
                      accept="image/webp,image/jpeg,image/png"
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      onChange={(e) => handleFileChange(slotIndex, e)}
                    />
                  </label>
                  {preview && (
                    <button
                      type="button"
                      onClick={() => clearSlot(slotIndex)}
                      className="cursor-pointer text-[9px] tracking-[0.1em] text-muted uppercase hover:text-red-700"
                    >
                      Quitar
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <p className="m-0 text-[11px] text-muted">
            Puedes subirlas ahora o después, desde la pantalla de edición.
          </p>
        </div>
      )}

      {/* ── Personalización ───────────────────────────── */}
      <div className="grid gap-3 border border-ink/12 p-4">
        <span className={labelClass}>Arma tu cadena</span>

        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            name="customizable"
            checked={isCustomizable}
            onChange={(e) => setIsCustomizable(e.target.checked)}
          />
          <span className="text-[12px]">Incluir en &quot;Arma tu cadena&quot;</span>
        </label>

        {isCustomizable && (
          <div className="grid gap-3">
            <label className="grid gap-1 w-32">
              <span className="text-[10px] text-muted uppercase">Dijes que admite</span>
              <input
                type="number"
                name="maxCharms"
                min="1"
                step="1"
                defaultValue={v?.maxCharms ?? (product?.maxCharms ?? 1)}
                className={inputClass}
              />
              <span className="text-[10px] leading-[1.5] text-muted">
                1 = solo un dije a la vez. Más de 1 = el cliente puede combinar varios en esta cadena.
              </span>
            </label>
            <div className="grid gap-2">
              <span className="text-[10px] leading-[1.6] text-muted">
                Punto de caída del dije (solo aplica a cadenas).
              </span>
              <DropPointPicker
                imageUrl={product?.images?.[0]?.url}
                defaultX={v?.dropPointX ? Number(v.dropPointX) : product?.dropPointX}
                defaultY={v?.dropPointY ? Number(v.dropPointY) : product?.dropPointY}
              />
            </div>
          </div>
        )}

        {/* Cuando no está marcado: preservar drop points existentes sin mostrar el picker */}
        {!isCustomizable && (
          <>
            <input type="hidden" name="dropPointX" value={product?.dropPointX ?? ""} />
            <input type="hidden" name="dropPointY" value={product?.dropPointY ?? ""} />
          </>
        )}
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
