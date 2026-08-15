"use server";

import { prisma } from "@/lib/db";
import { getCustomer } from "./account/session";

/** Se llama al hacer clic en "Avisarme cuando vuelva" — no bloquea el enlace a WhatsApp. */
export async function recordRestockRequest(slug: unknown) {
  if (typeof slug !== "string") return;

  const [product, customer] = await Promise.all([
    prisma.product.findUnique({ where: { slug }, select: { id: true } }),
    getCustomer(),
  ]);
  if (!product) return;

  await prisma.restockRequest.create({
    data: { productId: product.id, userId: customer?.id },
  });
}
