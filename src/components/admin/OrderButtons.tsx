"use client";

import { useTransition } from "react";

const buttonClass =
  "grid h-7 w-7 cursor-pointer place-items-center border border-ink/20 text-[12px] leading-none transition-colors duration-200 ease-out hover:border-ink disabled:cursor-default disabled:opacity-25";

/**
 * Flechas de prioridad. Reciben la acción de servidor ya enlazada al id, así
 * la lista solo dice "sube esto" y el orden lo calcula el servidor.
 */
export function OrderButtons({
  moveUp,
  moveDown,
  isFirst,
  isLast,
  label,
}: {
  moveUp: () => Promise<void>;
  moveDown: () => Promise<void>;
  isFirst: boolean;
  isLast: boolean;
  label: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label={`Subir ${label}`}
        disabled={isFirst || pending}
        onClick={() => startTransition(() => moveUp())}
        className={buttonClass}
      >
        ↑
      </button>
      <button
        type="button"
        aria-label={`Bajar ${label}`}
        disabled={isLast || pending}
        onClick={() => startTransition(() => moveDown())}
        className={buttonClass}
      >
        ↓
      </button>
    </div>
  );
}
