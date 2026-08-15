"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./auth";

/** Borra las solicitudes de una pieza — se usa una vez que ya volvió a haber stock. */
export async function dismissRestockRequests(productId: string) {
  await requireAdmin();
  await prisma.restockRequest.deleteMany({ where: { productId } });
  revalidatePath("/admin/restock");
}
