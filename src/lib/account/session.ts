import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth, ENV_ADMIN_ID } from "@/auth";
import { prisma } from "@/lib/db";

/**
 * The signed-in customer's row, or null. Every read/write of customer-owned
 * data goes through here so the auth check can't be forgotten at a call site
 * — proxy.ts gating /cuenta is a convenience, not the boundary.
 *
 * Returns null for the env-only admin identity (it has no User row) and for
 * sessions whose row is gone, so a stale cookie can't write orphan records.
 */
export const getCustomer = cache(async () => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id || id === ENV_ADMIN_ID) return null;

  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      createdAt: true,
      passwordHash: true,
    },
  });
});

/** Same, but for pages/actions that can't render without a customer. */
export async function requireCustomer() {
  const session = await auth();
  const id = session?.user?.id;
  if (id === ENV_ADMIN_ID) redirect("/admin");

  const customer = await getCustomer();
  if (!customer) redirect("/login?callbackUrl=%2Fcuenta");
  return customer;
}

/** Customer-shaped view for the UI — never hand `passwordHash` to a component. */
export function toProfile(customer: NonNullable<Awaited<ReturnType<typeof getCustomer>>>) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    role: customer.role,
    createdAt: customer.createdAt,
    hasPassword: customer.passwordHash !== null,
  };
}
