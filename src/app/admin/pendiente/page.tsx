import type { Metadata } from "next";
import Link from "next/link";
import { auth, signOut } from "@/auth";

export const metadata: Metadata = {
  title: "Acceso pendiente",
  robots: { index: false, follow: false },
};

/**
 * Only reachable by trying to open /admin without the role. The account itself
 * works normally, so the first thing offered is a way back into it.
 */
export default async function AdminPendingPage() {
  const session = await auth();

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-gutter text-center">
      <div className="grid w-full max-w-[430px] gap-6">
        <span className="font-display text-[28px] tracking-[0.1em] uppercase">Estella</span>
        <div className="grid gap-3">
          <h1 className="m-0 font-display text-[22px]">Panel solo para el equipo</h1>
          <p className="m-0 text-[13px] leading-[1.8] text-muted text-pretty">
            Tu cuenta ({session?.user?.email}) está activa y puedes usarla con normalidad, pero el
            panel de administración es solo para el equipo de Estella.
          </p>
        </div>
        <div className="grid gap-3">
          <Link
            href="/cuenta"
            className="bg-ink px-6 py-3.5 text-[11px] tracking-[0.2em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold"
          >
            Ir a mi cuenta
          </Link>
          <Link
            href="/"
            className="border border-ink/20 px-6 py-3.5 text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ease-out hover:border-ink"
          >
            Volver a la tienda
          </Link>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="cursor-pointer border-0 bg-transparent text-[10px] tracking-[0.2em] text-muted uppercase underline-offset-4 hover:text-ink hover:underline"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
