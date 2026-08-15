import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { requireCustomer } from "@/lib/account/session";
import { formatPrice } from "@/lib/products";
import { ProfileForm } from "./ProfileForm";

const dateFormat = new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" });

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false, follow: false },
};

const cardClass = "grid gap-2.5 border border-ink/12 p-6 transition-colors duration-300 ease-out";

export default async function CuentaPage() {
  const customer = await requireCustomer();

  const [favoriteCount, cartLines, orders] = await Promise.all([
    prisma.favorite.count({ where: { userId: customer.id } }),
    prisma.cartItem.findMany({ where: { userId: customer.id }, select: { quantity: true } }),
    prisma.order.findMany({
      where: { userId: customer.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
  ]);
  const bagCount = cartLines.reduce((total, line) => total + line.quantity, 0);
  const firstName = customer.name?.trim().split(" ")[0];

  return (
    <section className="grid gap-[clamp(30px,4vw,50px)] px-gutter pt-[clamp(120px,15vw,168px)] pb-section-y">
      <div className="grid gap-3">
        <span className="text-[10px] tracking-[0.34em] text-gold uppercase">Mi cuenta</span>
        <h1 className="m-0 font-display text-[clamp(28px,4.2vw,50px)] leading-[1.06] tracking-[-0.01em]">
          Hola{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="m-0 max-w-[52ch] text-[13px] leading-[1.8] text-muted text-pretty">
          Aquí quedan guardados tus datos, tus favoritos y tu bolsa. Los verás igual desde
          cualquier dispositivo donde inicies sesión.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/favoritos" className={`${cardClass} hover:border-ink`}>
          <span className="text-[10px] tracking-[0.2em] text-muted uppercase">Favoritos</span>
          <span className="font-display text-[26px] leading-none">{favoriteCount}</span>
          <span className="text-[12px] text-muted">
            {favoriteCount === 1 ? "pieza guardada" : "piezas guardadas"}
          </span>
        </Link>

        <Link href="/bolsa" className={`${cardClass} hover:border-ink`}>
          <span className="text-[10px] tracking-[0.2em] text-muted uppercase">Mi bolsa</span>
          <span className="font-display text-[26px] leading-none">{bagCount}</span>
          <span className="text-[12px] text-muted">
            {bagCount === 1 ? "unidad lista para pedir" : "unidades listas para pedir"}
          </span>
        </Link>

        {customer.role === "admin" && (
          <Link href="/admin" className={`${cardClass} hover:border-ink`}>
            <span className="text-[10px] tracking-[0.2em] text-muted uppercase">Administración</span>
            <span className="font-display text-[26px] leading-none">Panel</span>
            <span className="text-[12px] text-muted">Productos y categorías</span>
          </Link>
        )}
      </div>

      {orders.length > 0 && (
        <div className="grid gap-6 border-t border-ink/12 pt-[clamp(26px,3vw,40px)]">
          <h2 className="m-0 font-display text-[22px]">Mis pedidos</h2>
          <div className="grid gap-4">
            {orders.map((order) => (
              <div key={order.id} className="grid gap-2 border border-ink/12 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[12px] text-muted">{dateFormat.format(order.createdAt)}</span>
                  <span className="text-[14px]">{formatPrice(order.total)}</span>
                </div>
                <ul className="m-0 grid list-none gap-1 p-0">
                  {order.items.map((item) => (
                    <li key={item.id} className="text-[13px] text-muted">
                      {item.quantity} × {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 border-t border-ink/12 pt-[clamp(26px,3vw,40px)]">
        <div className="grid gap-2">
          <h2 className="m-0 font-display text-[22px]">Mis datos</h2>
          <p className="m-0 text-[12.5px] leading-[1.7] text-muted">
            Usamos tu WhatsApp solo para responder tus pedidos.
          </p>
        </div>
        <ProfileForm name={customer.name} email={customer.email} phone={customer.phone} />
      </div>

      <div className="border-t border-ink/12 pt-[clamp(26px,3vw,40px)]">
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
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
    </section>
  );
}
