import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="grid min-h-screen bg-paper md:grid-cols-2">
      <div className="relative hidden overflow-hidden md:block">
        <Image
          src="/lookbook/pareja-alas.webp"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-ink/15" />
        <div className="absolute inset-x-0 top-0 p-[clamp(28px,4vw,56px)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- static local SVG mark, next/image adds nothing here */}
          <img src="/logo/estella-monograma-blanco.svg" alt="Estella" className="h-9 w-auto" />
        </div>
        <div className="absolute inset-x-0 bottom-0 grid gap-2.5 p-[clamp(28px,4vw,56px)]">
          <span className="text-[10px] tracking-[0.34em] text-gold uppercase">Estella</span>
          <p className="m-0 max-w-[34ch] font-display text-[22px] leading-[1.35] text-paper">
            Series cortas y numeradas, hechas a mano en Colombia.
          </p>
        </div>
      </div>

      <div className="grid place-items-center px-gutter py-16">
        <div className="grid w-full max-w-[360px] gap-9">
          <div className="grid gap-3 md:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element -- static local SVG mark */}
            <img src="/logo/estella-monograma.svg" alt="Estella" className="h-9 w-auto" />
          </div>
          <div className="grid gap-2">
            <span className="text-[10px] tracking-[0.34em] text-gold uppercase">Estella</span>
            <h1 className="m-0 font-display text-[32px] leading-[1.12]">Iniciar sesión</h1>
            <p className="m-0 text-[13px] leading-[1.7] text-muted">
              Con Google o con tu correo. El acceso al panel lo activa el equipo de Estella.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
