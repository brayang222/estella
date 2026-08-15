import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { OrderItemsManager } from "@/components/admin/OrderItemsManager";
import { RequestReview } from "@/components/admin/RequestReview";
import { deleteOrder } from "@/lib/admin/orders";
import { prisma } from "@/lib/db";

const dateFormat = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

type Props = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const [order, products] = await Promise.all([
    prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: { orderBy: { id: "asc" }, include: { product: { select: { slug: true } } } },
      },
    }),
    prisma.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, price: true } }),
  ]);
  if (!order) notFound();

  return (
    <div className="grid max-w-[640px] gap-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="m-0 font-display text-[26px]">
            Pedido de {order.user.name ?? order.user.email}
          </h1>
          <span className="text-[12px] text-muted">
            {order.user.email} · {dateFormat.format(order.createdAt)}
          </span>
          {order.note && <span className="text-[12px] text-muted">Nota: {order.note}</span>}
        </div>
        <DeleteButton
          action={deleteOrder.bind(null, order.id)}
          confirmMessage="¿Eliminar este pedido? No se puede deshacer."
        >
          Eliminar pedido
        </DeleteButton>
      </div>

      <div className="border border-ink/12 p-5">
        <OrderItemsManager orderId={order.id} items={order.items} products={products} />
      </div>

      <RequestReview
        customerName={order.user.name}
        phone={order.user.phone}
        items={order.items
          // Sin producto vivo no hay ficha a la que enlazar: la pieza se
          // borró del catálogo y el pedido solo guarda su nombre.
          .filter((item) => item.product)
          .map((item) => ({ name: item.name, slug: item.product!.slug }))}
      />

      <Link
        href="/admin/pedidos"
        className="w-fit text-[11px] tracking-[0.1em] text-muted uppercase underline-offset-4 hover:text-ink hover:underline"
      >
        ← Todos los pedidos
      </Link>
    </div>
  );
}
