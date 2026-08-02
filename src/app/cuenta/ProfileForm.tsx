"use client";

import { useActionState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { updateProfile, type ProfileFormState } from "@/lib/account/actions";

const inputClass =
  "border border-ink/20 bg-transparent px-3.5 py-3 text-[14px] focus:border-ink focus:outline-none";
const labelClass = "text-[10px] tracking-[0.15em] text-muted uppercase";

export function ProfileForm({
  name,
  email,
  phone,
}: {
  name: string | null;
  email: string;
  phone: string | null;
}) {
  const [state, formAction, pending] = useActionState<ProfileFormState | undefined, FormData>(
    updateProfile,
    undefined
  );
  const { update } = useSession();

  // Refresh the JWT so the rest of the app sees the new name without a re-login.
  useEffect(() => {
    if (state?.ok) update();
    // `update` is a new function identity on every render — depending on it
    // would re-fire this effect forever.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.ok]);

  return (
    <form action={formAction} className="grid max-w-[420px] gap-4">
      <label className="grid gap-1.5">
        <span className={labelClass}>Nombre</span>
        <input
          type="text"
          name="name"
          defaultValue={name ?? ""}
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
          className={inputClass}
        />
      </label>

      <label className="grid gap-1.5">
        <span className={labelClass}>Correo</span>
        <input
          type="email"
          value={email}
          readOnly
          disabled
          className={`${inputClass} text-muted opacity-70`}
        />
        <span className="text-[11px] text-muted">
          El correo identifica tu cuenta y no se puede cambiar aquí.
        </span>
      </label>

      <label className="grid gap-1.5">
        <span className={labelClass}>WhatsApp</span>
        <input
          type="tel"
          name="phone"
          defaultValue={phone ?? ""}
          autoComplete="tel"
          placeholder="+57 300 000 0000"
          className={`${inputClass} placeholder:text-ink/25`}
        />
      </label>

      {state?.error && (
        <p className="m-0 text-[12px] text-red-700" role="alert">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="m-0 text-[12px] text-gold" role="status">
          Datos guardados.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 w-fit cursor-pointer bg-ink px-8 py-3.5 text-[11px] tracking-[0.2em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold disabled:cursor-default disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
