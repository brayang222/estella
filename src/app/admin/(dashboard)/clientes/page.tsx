import { auth } from "@/auth";
import { UserRow, type AdminUserRow } from "@/components/admin/UserRow";
import { prisma } from "@/lib/db";

export const metadata = { title: "Clientes" };

type Props = {
  searchParams: Promise<{ q?: string }>;
};

const dateFormat = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function AdminUsersPage({ searchParams }: Props) {
  const [{ q }, session] = await Promise.all([searchParams, auth()]);
  const query = q?.trim() ?? "";

  const users = await prisma.user.findMany({
    where: query
      ? {
          OR: [
            { email: { contains: query, mode: "insensitive" } },
            { name: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: [{ role: "desc" }, { createdAt: "desc" }],
    take: 200,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      passwordHash: true,
      accounts: { select: { provider: true } },
      _count: { select: { favorites: true } },
      cartItems: { select: { quantity: true } },
    },
  });

  const rows: AdminUserRow[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: dateFormat.format(user.createdAt),
    favorites: user._count.favorites,
    bagUnits: user.cartItems.reduce((total, line) => total + line.quantity, 0),
    signInMethod:
      user.accounts.length > 0
        ? user.accounts.map((account) => account.provider).join(", ")
        : user.passwordHash
          ? "correo y contraseña"
          : "sin método de acceso",
  }));

  const admins = rows.filter((row) => row.role === "admin").length;

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="m-0 font-display text-[26px]">Clientes</h1>
        <p className="m-0 max-w-[62ch] text-[13px] leading-[1.7] text-muted">
          Todas las cuentas de la tienda. Dale acceso al panel a quien lo necesite con “Hacer
          admin”: es lo que espera quien ve la pantalla de “acceso pendiente”.
        </p>
      </div>

      <form className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Buscar por nombre o correo…"
          aria-label="Buscar cuentas"
          className="w-full max-w-[320px] border border-ink/20 bg-transparent px-3 py-2 text-[13px] focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          className="cursor-pointer border border-ink/20 px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ease-out hover:border-ink"
        >
          Buscar
        </button>
        <span className="text-[11px] text-muted">
          {rows.length} {rows.length === 1 ? "cuenta" : "cuentas"} · {admins}{" "}
          {admins === 1 ? "administrador" : "administradores"}
        </span>
      </form>

      {rows.length === 0 ? (
        <p className="text-[13px] text-muted">
          {query ? `Ninguna cuenta coincide con "${query}".` : "Todavía no hay cuentas."}
        </p>
      ) : (
        <div className="grid gap-px overflow-hidden border border-ink/12 bg-ink/12">
          {rows.map((row) => (
            <UserRow key={row.id} user={row} isSelf={row.id === session?.user?.id} />
          ))}
        </div>
      )}
    </div>
  );
}
