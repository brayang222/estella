"use client";

import { useRef, useTransition } from "react";
import {
  addProductImage,
  moveProductImage,
  removeProductImage,
} from "@/lib/admin/products";
import type { ProductImage } from "@/lib/products";

const MAX_IMAGES = 4;

const smallButton =
  "grid h-7 w-7 cursor-pointer place-items-center border border-ink/20 bg-paper text-[12px] leading-none transition-colors duration-200 ease-out hover:border-ink disabled:cursor-default disabled:opacity-25";

/**
 * Fotos de una pieza ya creada: subir, reordenar y eliminar, cada acción por
 * su cuenta. Está fuera del formulario de datos a propósito — mover una foto
 * no debería obligar a reenviar precio, descripción y todo lo demás.
 */
export function ProductImagesManager({
  productId,
  images,
}: {
  productId: string;
  images: ProductImage[];
}) {
  const [pending, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);
  const sorted = [...images].sort((a, b) => a.order - b.order);

  function upload(formData: FormData) {
    startTransition(async () => {
      await addProductImage(productId, formData);
      if (fileInput.current) fileInput.current.value = "";
    });
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-1">
        <span className="text-[10px] tracking-[0.15em] text-muted uppercase">
          Fotos ({sorted.length} de {MAX_IMAGES})
        </span>
        <p className="m-0 text-[11px] leading-[1.6] text-muted">
          La primera es la miniatura del catálogo y la que abre la ficha. Usa las flechas para
          cambiar el orden.
        </p>
      </div>

      {sorted.length > 0 && (
        <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-4">
          {sorted.map((image, index) => (
            <li key={image.id} className="grid gap-2">
              <div className="relative aspect-square overflow-hidden bg-img-1">
                {/* eslint-disable-next-line @next/next/no-img-element -- miniatura local del panel */}
                <img
                  src={image.url}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {index === 0 && (
                  <span className="absolute top-1 left-1 bg-ink px-1.5 py-0.5 text-[8px] tracking-[0.15em] text-paper uppercase">
                    Principal
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Mover foto a la izquierda"
                    disabled={index === 0 || pending}
                    onClick={() => startTransition(() => moveProductImage(image.id, "up"))}
                    className={smallButton}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Mover foto a la derecha"
                    disabled={index === sorted.length - 1 || pending}
                    onClick={() => startTransition(() => moveProductImage(image.id, "down"))}
                    className={smallButton}
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    if (!window.confirm("¿Eliminar esta foto?")) return;
                    startTransition(() => removeProductImage(image.id));
                  }}
                  className="cursor-pointer border-0 bg-transparent text-[10px] tracking-[0.1em] text-red-700 uppercase underline-offset-4 hover:underline disabled:opacity-50"
                >
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {sorted.length < MAX_IMAGES ? (
        <form action={upload} className="flex flex-wrap items-center gap-3">
          <input
            ref={fileInput}
            type="file"
            name="image"
            required
            accept="image/webp,image/jpeg,image/png"
            className="text-[11px]"
          />
          <button
            type="submit"
            disabled={pending}
            className="cursor-pointer border border-ink/20 px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ease-out hover:border-ink disabled:opacity-50"
          >
            {pending ? "Subiendo…" : "Añadir foto"}
          </button>
        </form>
      ) : (
        <p className="m-0 text-[11px] text-muted">
          Máximo {MAX_IMAGES} fotos. Quita una para poder subir otra.
        </p>
      )}
    </div>
  );
}
