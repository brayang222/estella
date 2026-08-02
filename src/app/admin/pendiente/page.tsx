import type { Metadata } from "next";
import { auth, signOut } from "@/auth";

export const metadata: Metadata = {
  title: "Acceso pendiente",
  robots: { index: false, follow: false },
};

export default async function AdminPendingPage() {
  const session = await auth();

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-gutter text-center">
      <div className="grid w-full max-w-[420px] gap-6">
        <span className="font-display text-[28px] tracking-[0.1em] uppercase">Estella</span>
        <div className="grid gap-3">
          <h1 className="m-0 font-display text-[22px]">Acceso pendiente</h1>
          <p className="m-0 text-[13px] leading-[1.8] text-muted text-pretty">
            Tu cuenta ({session?.user?.email}) inició sesión correctamente, pero todavía no tiene
            permiso de administrador. Pídele a quien gestiona la tienda que te lo active.
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="cursor-pointer border border-ink/20 bg-transparent px-6 py-3 text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ease-out hover:border-ink"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
