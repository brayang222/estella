"use client";

import { useTransition } from "react";

export function DeleteButton({
  action,
  confirmMessage,
  children = "Eliminar",
}: {
  action: () => Promise<void>;
  confirmMessage: string;
  children?: React.ReactNode;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(() => action());
      }}
      className="cursor-pointer border-0 bg-transparent text-[11px] tracking-[0.1em] text-red-700 uppercase underline-offset-4 hover:underline disabled:cursor-default disabled:opacity-50"
    >
      {pending ? "Eliminando…" : children}
    </button>
  );
}
