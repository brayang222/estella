import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.toLowerCase();

/**
 * Id of the env-only admin identity (see the Credentials provider below). It
 * has no User row, so anything that writes rows owned by a user — favoritos,
 * bolsa, datos — must reject it. `getCustomer()` in lib/account/session.ts is
 * the single place that check lives.
 */
export const ENV_ADMIN_ID = "admin-credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Sin esto, next-auth confía solo en AUTH_URL para armar la URL de
  // callback — si esa variable quedó fija al dominio de Vercel, todo el
  // login de Google (y sus cookies host-only) se va para allá aunque el
  // usuario haya entrado por el dominio propio. trustHost hace que cada
  // request use su propio host real.
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const rawEmail = credentials?.email;
        const password = credentials?.password;
        if (typeof rawEmail !== "string" || typeof password !== "string") return null;
        const email = rawEmail.trim().toLowerCase();

        // 1. Fixed-identity admin fallback that bypasses the User table
        // entirely (in case the DB is unreachable or every admin account gets
        // locked out). Gated by the env-only ADMIN_EMAIL/ADMIN_PASSWORD_HASH
        // secret, so it always resolves to the "admin" role.
        const adminHash = process.env.ADMIN_PASSWORD_HASH;
        if (ADMIN_EMAIL && adminHash && email === ADMIN_EMAIL) {
          if (await bcrypt.compare(password, adminHash)) {
            return { id: ENV_ADMIN_ID, email, name: "Estella", role: "admin" as const };
          }
          // Fall through: the same address may also be a real User row with
          // its own password.
        }

        // 2. Normal customer accounts created at /registro.
        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, name: true, email: true, image: true, passwordHash: true, role: true },
        });
        // No passwordHash means the account was created with Google — there is
        // nothing to compare against, so password login can't work for it.
        if (!user?.passwordHash) return null;
        if (!(await bcrypt.compare(password, user.passwordHash))) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    // Anyone can sign in — a Google sign-in creates a User row via the adapter
    // with role "user" by default (see schema.prisma), which is exactly what a
    // customer account is. Access to /admin is gated on role elsewhere
    // (proxy.ts, requireAdmin()), not here.
    signIn: async () => true,
    jwt: async ({ token, user, account, trigger }) => {
      if (user) {
        if (user.id) token.id = user.id;
        if (account?.provider === "credentials") {
          // authorize() above already resolved the role from the DB (or from
          // the env-admin branch), so no second query is needed.
          token.role = (user as { role?: "user" | "admin" }).role ?? "user";
        } else {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true },
          });
          token.role = dbUser?.role ?? "user";
        }
      }

      // Sessions issued before the token carried an `id` (anyone already
      // signed in when this shipped) get healed by email instead of being
      // bounced around /cuenta with no user to load.
      if (!token.id && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = token.role ?? dbUser.role;
        }
      }

      // Saving the profile calls session.update() so the navbar/greeting pick
      // up the new name without forcing a re-login.
      const tokenId = typeof token.id === "string" ? token.id : null;
      if (trigger === "update" && tokenId && tokenId !== ENV_ADMIN_ID) {
        const dbUser = await prisma.user.findUnique({
          where: { id: tokenId },
          select: { name: true, role: true },
        });
        if (dbUser) {
          token.name = dbUser.name;
          token.role = dbUser.role;
        }
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.role = (token.role as "user" | "admin" | undefined) ?? "user";
      }
      return session;
    },
  },
});
