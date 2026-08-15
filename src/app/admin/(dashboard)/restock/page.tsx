import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { dismissRestockRequests } from "@/lib/admin/restock";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/products";

export const metadata = { title: "Restock" };

const dateFormat = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function AdminRestockPage() {
  const grouped = await prisma.restockRequest.groupBy({
    by: ["productId"],
    _count: { _all: true },
    _max: { createdAt: true },
    orderBy: { _count: { productId: "desc" } },
  });

  const products = await prisma.product.findMany({
    where: { id: { in: grouped.map((g) => g.productId) } },
    select: { id: true, slug: true, name: true, price: true, available: true },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  const rows = grouped
    .map((group) => ({
      product: byId.get(group.productId),
      count: group._count._all,
      latestAt: group._max.createdAt!,
    }))
    .filter((row): row is typeof row & { product: NonNullable<typeof row.product> } =>
      Boolean(row.product)
    );

  return (
    <div className="grid max-w-[680px] gap-8">
      <div className="grid gap-1">
        <h1 className="m-0 font-display text-[26px]">Restock</h1>
        <p className="m-0 text-[12px] text-muted">
          Piezas agotadas que las clientas pidieron que se avisara cuando volvieran, ordenadas por
          demanda. El pedido en sí sigue llegando por WhatsApp.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="m-0 text-[13px] text-muted">Nadie ha pedido avisos de restock todavía.</p>
      ) : (
        <div className="grid gap-px overflow-hidden border border-ink/12 bg-ink/12">
          {rows.map(({ product, count, latestAt }) => (
            <div key={product.id} className="flex items-center justify-between gap-4 bg-paper px-4 py-4">
              <div className="grid gap-1">
                <Link
                  href={`/producto/${product.slug}`}
                  target="_blank"
                  className="text-[13px] hover:text-gold"
                >
                  {product.name}
                </Link>
                <span className="text-[11px] text-muted">
                  {formatPrice(product.price)} · {product.available ? "disponible de nuevo" : "agotada"} ·
                  última solicitud {dateFormat.format(latestAt)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[13px] tabular-nums">{count}</span>
                <DeleteButton
                  action={dismissRestockRequests.bind(null, product.id)}
                  confirmMessage={`¿Borrar las ${count} solicitudes de "${product.name}"?`}
                >
                  Descartar
                </DeleteButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
