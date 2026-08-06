"use client";

import { useState } from "react";

const DEFAULT_X = 48;
const DEFAULT_Y = 87;

export function DropPointPicker({
  imageUrl,
  defaultX,
  defaultY,
}: {
  imageUrl?: string | null;
  defaultX?: number | null;
  defaultY?: number | null;
}) {
  const [point, setPoint] = useState({
    x: defaultX ?? DEFAULT_X,
    y: defaultY ?? DEFAULT_Y,
  });

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10;
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10;
    setPoint({ x, y });
  }

  return (
    <div className="grid gap-3">
      {imageUrl ? (
        <>
          <p className="m-0 text-[11px] leading-[1.7] text-muted">
            Haz clic en la foto para marcar dónde cuelgan los dijes.
            El punto dorado indica la posición actual; el círculo gris muestra el dije de ejemplo.
          </p>

          <div
            role="button"
            tabIndex={0}
            aria-label="Selector de punto de caída"
            className="relative max-w-[300px] cursor-crosshair border border-ink/20 select-none"
            onClick={handleClick}
            onKeyDown={(e) => {
              /* flechas para ajuste fino de ±0.5% */
              if (!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) return;
              e.preventDefault();
              const delta = e.shiftKey ? 2 : 0.5;
              setPoint((p) => ({
                x: e.key === "ArrowLeft" ? Math.max(0, p.x - delta)
                   : e.key === "ArrowRight" ? Math.min(100, p.x + delta)
                   : p.x,
                y: e.key === "ArrowUp" ? Math.max(0, p.y - delta)
                   : e.key === "ArrowDown" ? Math.min(100, p.y + delta)
                   : p.y,
              }));
            }}
          >
            {/* Sin recortar (nada de aspect-square + object-cover): el punto se
                calcula sobre el rect de esta caja, así que tiene que mostrar la
                foto completa — si no, x/y quedarían relativos a un recorte y no
                a la foto real que usa el armador. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              className="pointer-events-none block w-full select-none"
              draggable={false}
            />

            {/* Ghost charm: círculo que representa un dije colgando */}
            <div
              className="pointer-events-none absolute -translate-x-1/2"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            >
              <div className="size-14 rounded-full border-2 border-ink/30 bg-ink/10" />
            </div>

            {/* Pin: marca exacta del drop point */}
            <div
              className="pointer-events-none absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold ring-2 ring-paper"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            />
          </div>

          <p className="m-0 font-mono text-[10px] text-muted">
            x: {point.x.toFixed(1)}%&nbsp;&nbsp;y: {point.y.toFixed(1)}%
          </p>
        </>
      ) : (
        <p className="m-0 text-[11px] text-muted">
          Sube una foto del producto para poder ajustar dónde caen los dijes.
        </p>
      )}

      {/* Siempre presentes — preservan el valor aunque no haya imagen */}
      <input type="hidden" name="dropPointX" value={point.x} />
      <input type="hidden" name="dropPointY" value={point.y} />
    </div>
  );
}
