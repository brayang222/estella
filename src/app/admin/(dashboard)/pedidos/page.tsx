import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/products";

export const metadata = { title: "Pedidos" };

const dateFormat = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } }, _count: { select: { items: true } } },
  });

  return (
    <div className="grid max-w-[680px] gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-1">
          <h1 className="m-0 font-display text-[26px]">Pedidos</h1>
          <p className="m-0 text-[12px] text-muted">
            Registro manual de lo confirmado por WhatsApp — le da a cada clienta un historial en su
            cuenta.
          </p>
        </div>
        <Link
          href="/admin/pedidos/nuevo"
          className="cursor-pointer bg-ink px-5 py-2.5 text-[11px] tracking-[0.15em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold"
        >
          Nuevo pedido
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="m-0 text-[13px] text-muted">Todavía no hay pedidos registrados.</p>
      ) : (
        <div className="grid gap-px overflow-hidden border border-ink/12 bg-ink/12">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/pedidos/${order.id}`}
              className="flex items-center justify-between gap-4 bg-paper px-4 py-4 hover:bg-paper-alt"
            >
              <div className="grid gap-1">
                <span className="text-[13px]">{order.user.name ?? order.user.email}</span>
                <span className="text-[11px] text-muted">
                  {dateFormat.format(order.createdAt)} · {order._count.items}{" "}
                  {order._count.items === 1 ? "pieza" : "piezas"}
                </span>
              </div>
              <span className="text-[13px] tabular-nums">{formatPrice(order.total)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
