"use client";

import { useRef } from "react";

const GUIDES: Record<string, { title: string; steps: string[] }> = {
  pulseras: {
    title: "Cómo medir tu muñeca",
    steps: [
      "Rodea tu muñeca con una cinta métrica o un hilo, justo donde iría la pulsera.",
      "Marca dónde se junta el hilo con el punto de partida y mídelo con una regla.",
      "Súmale 1-1.5 cm para que caiga con soltura, no ajustada.",
      "¿Entre dos medidas? Elige la mayor — siempre es más fácil ajustar una pulsera grande que una corta.",
    ],
  },
  anillos: {
    title: "Cómo medir tu talla de anillo",
    steps: [
      "Rodea la base de tu dedo con un hilo y marca dónde se junta.",
      "Mide esa longitud en milímetros: es el contorno de tu dedo.",
      "Compara el contorno con una tabla de tallas de anillos (busca 'tabla de tallas de anillos' con esa medida en mm).",
      "Mide al final del día, cuando los dedos están un poco más grandes.",
    ],
  },
};

/** Guía de tallas para categorías donde la medida importa (pulseras, anillos). Null si la categoría no aplica. */
export function SizeGuide({ categorySlug }: { categorySlug: string }) {
  const guide = GUIDES[categorySlug];
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (!guide) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="cursor-pointer justify-self-start border-b border-ink/30 pb-1 text-[10px] tracking-[0.2em] text-muted uppercase transition-colors duration-300 ease-out hover:border-gold hover:text-gold"
      >
        Guía de tallas
      </button>

      <dialog
        ref={dialogRef}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto max-w-[420px] border border-ink/12 bg-paper p-0 backdrop:bg-ink/40"
      >
        <div className="grid gap-4 p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="m-0 font-display text-[20px] leading-[1.1]">{guide.title}</h2>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Cerrar guía de tallas"
              className="cursor-pointer text-muted transition-colors duration-200 ease-out hover:text-ink"
            >
              ✕
            </button>
          </div>
          <ol className="m-0 grid list-decimal gap-2.5 pl-4 text-[13px] leading-[1.7] text-muted">
            {guide.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </dialog>
    </>
  );
}
