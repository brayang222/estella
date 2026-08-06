"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { moveProductImage, removeProductImage } from "@/lib/admin/products";
import type { ProductImage } from "@/lib/products";

const MAX_IMAGES = 4;
const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 0.85;

/** Redimensiona y convierte a WebP en el cliente. Fotos de celular de 10 MB quedan en < 500 KB. */
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width <= MAX_DIMENSION && height <= MAX_DIMENSION && file.type === "image/webp") {
        resolve(file);
        return;
      }
      const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height, 1);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          const name = file.name.replace(/\.[^.]+$/, ".webp");
          resolve(new File([blob], name, { type: "image/webp" }));
        },
        "image/webp",
        WEBP_QUALITY,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); };
    img.src = objectUrl;
  });
}

const smallButton =
  "grid h-7 w-7 cursor-pointer place-items-center border border-ink/20 bg-paper text-[12px] leading-none transition-colors duration-200 ease-out hover:border-ink disabled:cursor-default disabled:opacity-25";

export function ProductImagesManager({
  productId,
  images,
}: {
  productId: string;
  images: ProductImage[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const sorted = [...images].sort((a, b) => a.order - b.order);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    setUploadError(null);
    setUploading(true);

    const compressed = await compressImage(file);

    const formData = new FormData();
    formData.set("image", compressed);
    formData.set("productId", productId);

    const res = await fetch("/api/admin/upload-product-image", {
      method: "POST",
      body: formData,
    });

    if (fileInput.current) fileInput.current.value = "";
    setUploading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({})) as { error?: string };
      setUploadError(data.error ?? "Error al subir la foto");
      return;
    }

    startTransition(() => {
      router.refresh();
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

      {uploadError && (
        <p className="m-0 bg-red-50 p-3 text-[12px] text-red-700">{uploadError}</p>
      )}

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

      {sorted.length < MAX_IMAGES && (
        <div className="grid gap-2">
          {/* input sr-only: accesible, fuera de pantalla, incluido en FormData */}
          <input
            ref={fileInput}
            type="file"
            accept="image/webp,image/jpeg,image/png"
            className="sr-only"
            disabled={uploading || pending}
            onChange={handleFileSelect}
          />

          <button
            type="button"
            disabled={uploading || pending}
            onClick={() => fileInput.current?.click()}
            className="group relative block aspect-square w-full max-w-[120px] cursor-pointer overflow-hidden bg-img-1 transition-opacity hover:opacity-75 disabled:cursor-default disabled:opacity-50"
            aria-label="Añadir foto"
          >
            {uploading ? (
              <span className="absolute inset-0 flex items-center justify-center text-[10px] tracking-[0.1em] text-muted uppercase">
                Subiendo…
              </span>
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-2xl text-ink/20 select-none group-hover:text-ink/40">
                +
              </span>
            )}
          </button>

          <p className="m-0 text-[11px] text-muted">
            {uploading ? "Guardando foto…" : "Haz clic en el recuadro para añadir una foto."}
          </p>
        </div>
      )}

      {sorted.length >= MAX_IMAGES && (
        <p className="m-0 text-[11px] text-muted">
          Máximo {MAX_IMAGES} fotos. Quita una para poder subir otra.
        </p>
      )}
    </div>
  );
}
