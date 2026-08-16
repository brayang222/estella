import Link from "next/link";
import { auth, signOut } from "@/auth";

const links = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/restock", label: "Restock" },
  { href: "/admin/resenas", label: "Reseñas" },
  { href: "/admin/novedades", label: "Novedades" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/ajustes", label: "Ajustes" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-paper">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/12 px-gutter py-4">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <span className="font-display text-[18px] tracking-[0.1em] uppercase">
            Estella admin
          </span>
          <nav className="flex gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] tracking-[0.15em] text-muted uppercase hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="text-[11px] tracking-[0.15em] text-muted uppercase hover:text-ink"
          >
            Ver tienda ↗
          </Link>
          <span className="text-[11px] text-muted">{session?.user?.email}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="cursor-pointer border-0 bg-transparent text-[11px] tracking-[0.15em] uppercase underline-offset-4 hover:underline"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>
      <main className="px-gutter py-10">{children}</main>
    </div>
  );
}
