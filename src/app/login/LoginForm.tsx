"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.61z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.19l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.7A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.16.29-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}

const inputClass =
  "border border-ink/20 bg-transparent px-3.5 py-3 text-[14px] focus:border-ink focus:outline-none";
const labelClass = "text-[10px] tracking-[0.15em] text-muted uppercase";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <div className="grid gap-6">
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/admin" })}
        className="flex cursor-pointer items-center justify-center gap-3 border border-ink/20 bg-transparent py-3.5 text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ease-out hover:border-ink hover:bg-paper-alt"
      >
        <GoogleIcon />
        Continuar con Google
      </button>

      <div className="flex items-center gap-3 text-[10px] tracking-[0.2em] text-muted uppercase">
        <span className="h-px flex-1 bg-ink/12" />o<span className="h-px flex-1 bg-ink/12" />
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="grid gap-1.5">
          <span className={labelClass}>Correo</span>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="grid gap-1.5">
          <span className={labelClass}>Contraseña</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
          />
        </label>
        {error && <p className="m-0 text-[12px] text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 cursor-pointer bg-ink py-3.5 text-[11px] tracking-[0.2em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold disabled:cursor-default disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
