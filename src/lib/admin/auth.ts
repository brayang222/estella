import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * proxy.ts already blocks unauthenticated navigation to /admin, but Server
 * Actions post to whatever route rendered the form — a matcher/route change
 * could silently drop that coverage. Call this at the top of every mutating
 * action too, not just pages.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin") redirect("/admin/pendiente");
  return session;
}
