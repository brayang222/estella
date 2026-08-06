import { OrderCreateForm } from "@/components/admin/OrderCreateForm";
import { prisma } from "@/lib/db";

export default async function NewOrderPage() {
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true },
  });
  const customers = users.map((user) => ({
    id: user.id,
    label: user.name ? `${user.name} — ${user.email}` : user.email,
  }));

  return (
    <div className="grid gap-6">
      <h1 className="m-0 font-display text-[26px]">Nuevo pedido</h1>
      <p className="m-0 text-[12px] text-muted">
        Regístralo después de confirmar por WhatsApp. En el siguiente paso agregas las piezas.
      </p>
      <OrderCreateForm customers={customers} />
    </div>
  );
}
