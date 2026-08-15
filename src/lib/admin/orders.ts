"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./auth";

export type OrderFormState = { error?: string };

export async function createOrder(
  _prevState: OrderFormState,
  formData: FormData
): Promise<OrderFormState> {
  await requireAdmin();

  const userId = String(formData.get("userId") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  if (!userId) return { error: "Elige una clienta." };

  const order = await prisma.order.create({ data: { userId, total: 0, note: note || null } });
  revalidatePath("/admin/pedidos");
  redirect(`/admin/pedidos/${order.id}`);
}

export async function deleteOrder(id: string) {
  await requireAdmin();
  await prisma.order.delete({ where: { id } });
  revalidatePath("/admin/pedidos");
  redirect("/admin/pedidos");
}

export type OrderItemFormState = { error?: string };

export async function addOrderItem(
  orderId: string,
  _prevState: OrderItemFormState,
  formData: FormData
): Promise<OrderItemFormState> {
  await requireAdmin();

  const productId = String(formData.get("productId") ?? "").trim();
  const quantity = Math.trunc(Number(formData.get("quantity")));
  if (!productId) return { error: "Elige una pieza." };
  if (!Number.isFinite(quantity) || quantity < 1) return { error: "La cantidad debe ser al menos 1." };

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { name: true, price: true },
  });
  if (!product) return { error: "Esa pieza ya no existe." };

  await prisma.$transaction([
    prisma.orderItem.create({
      data: { orderId, productId, name: product.name, price: product.price, quantity },
    }),
    prisma.order.update({
      where: { id: orderId },
      data: { total: { increment: product.price * quantity } },
    }),
  ]);

  revalidatePath(`/admin/pedidos/${orderId}`);
  return {};
}

export async function removeOrderItem(orderId: string, itemId: string) {
  await requireAdmin();

  const item = await prisma.orderItem.findUnique({
    where: { id: itemId },
    select: { price: true, quantity: true },
  });
  if (!item) return;

  await prisma.$transaction([
    prisma.orderItem.delete({ where: { id: itemId } }),
    prisma.order.update({
      where: { id: orderId },
      data: { total: { decrement: item.price * item.quantity } },
    }),
  ]);

  revalidatePath(`/admin/pedidos/${orderId}`);
}
