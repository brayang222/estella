"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ENV_ADMIN_ID } from "@/auth";
import { requireAdmin } from "./auth";

export type UserActionState = { error?: string; ok?: string };

/**
 * Cambia el rol de una cuenta. Dos candados:
 * - nadie se quita a sí mismo el acceso (dejaría el panel sin quien entre);
 * - siempre queda al menos un administrador con cuenta real.
 */
export async function setUserRole(
  userId: string,
  role: "user" | "admin"
): Promise<UserActionState> {
  const session = await requireAdmin();

  if (session.user.id === userId) {
    return { error: "No puedes cambiar tu propio rol." };
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });
  if (!target) return { error: "Esa cuenta ya no existe." };

  if (target.role === "admin" && role === "user") {
    const admins = await prisma.user.count({ where: { role: "admin" } });
    if (admins <= 1) {
      return { error: "Es el único administrador: asciende a alguien más antes de quitarle el acceso." };
    }
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/clientes");
  revalidatePath("/admin");

  return {
    ok:
      role === "admin"
        ? `${target.email} ya puede entrar al panel.`
        : `${target.email} vuelve a ser cliente.`,
  };
}

/** Borra la cuenta y, en cascada, sus favoritos y su bolsa. */
export async function deleteUser(userId: string): Promise<UserActionState> {
  const session = await requireAdmin();

  // El admin de emergencia (solo variables de entorno) no tiene fila propia,
  // así que su id nunca debería llegar aquí; se corta por si acaso.
  if (session.user.id === userId || userId === ENV_ADMIN_ID) {
    return { error: "No puedes eliminar tu propia cuenta." };
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, email: true },
  });
  if (!target) return { error: "Esa cuenta ya no existe." };

  if (target.role === "admin") {
    const admins = await prisma.user.count({ where: { role: "admin" } });
    if (admins <= 1) return { error: "No puedes eliminar al único administrador." };
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/clientes");
  revalidatePath("/admin");

  return { ok: `Cuenta de ${target.email} eliminada.` };
}
