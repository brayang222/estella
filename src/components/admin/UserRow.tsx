"use client";

import { useState, useTransition } from "react";
import { deleteUser, setUserRole } from "@/lib/admin/users";

export type AdminUserRow = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: "user" | "admin";
  createdAt: string;
  favorites: number;
  bagUnits: number;
  signInMethod: string;
};

/**
 * Una cuenta de la lista. El servidor decide si el cambio es legal (último
 * administrador, cuenta propia…) y devuelve el motivo, que se muestra aquí.
 */
export function UserRow({ user, isSelf }: { user: AdminUserRow; isSelf: boolean }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ error?: string; ok?: string } | null>(null);

  function run(action: () => Promise<{ error?: string; ok?: string }>) {
    setMessage(null);
    startTransition(async () => setMessage(await action()));
  }

  return (
    <div className="grid gap-3 bg-paper px-4 py-3.5 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="grid gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-medium">{user.name ?? "Sin nombre"}</span>
          {user.role === "admin" && (
            <span className="bg-ink px-1.5 py-0.5 text-[8px] tracking-[0.15em] text-paper uppercase">
              Admin
            </span>
          )}
          {isSelf && <span className="text-[10px] tracking-[0.1em] text-gold uppercase">Tú</span>}
        </div>
        <span className="text-[11px] break-all text-muted">
          {user.email}
          {user.phone ? ` · ${user.phone}` : ""}
        </span>
        <span className="text-[11px] text-muted">
          {user.signInMethod} · alta {user.createdAt} · {user.favorites}{" "}
          {user.favorites === 1 ? "favorito" : "favoritos"} · {user.bagUnits} en bolsa
        </span>
        {message?.error && <span className="text-[11px] text-red-700">{message.error}</span>}
        {message?.ok && <span className="text-[11px] text-gold">{message.ok}</span>}
      </div>

      <div className="flex items-center gap-4 sm:justify-end">
        <button
          type="button"
          disabled={pending || isSelf}
          onClick={() => run(() => setUserRole(user.id, user.role === "admin" ? "user" : "admin"))}
          className="cursor-pointer border border-ink/20 px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase transition-colors duration-200 ease-out hover:border-ink disabled:cursor-default disabled:opacity-40"
        >
          {user.role === "admin" ? "Quitar admin" : "Hacer admin"}
        </button>
        <button
          type="button"
          disabled={pending || isSelf}
          onClick={() => {
            if (
              !window.confirm(
                `¿Eliminar la cuenta de ${user.email}? Se borran también sus favoritos y su bolsa.`
              )
            ) {
              return;
            }
            run(() => deleteUser(user.id));
          }}
          className="cursor-pointer border-0 bg-transparent text-[10px] tracking-[0.1em] text-red-700 uppercase underline-offset-4 hover:underline disabled:cursor-default disabled:opacity-40"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
