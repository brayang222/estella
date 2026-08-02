import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.toLowerCase();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      // Fixed-identity fallback that bypasses the User table entirely (in
      // case the DB is unreachable or every admin account gets locked out).
      // Always resolves to the "admin" role — it's already gated by the
      // env-only ADMIN_EMAIL/ADMIN_PASSWORD_HASH secret.
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;
        if (!ADMIN_EMAIL || email.toLowerCase() !== ADMIN_EMAIL) return null;

        const hash = process.env.ADMIN_PASSWORD_HASH;
        if (!hash) return null;

        const valid = await bcrypt.compare(password, hash);
        if (!valid) return null;

        return { id: "admin-credentials", email, name: "Estella" };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    // Anyone can sign in — a Google sign-in creates a User row via the
    // adapter with role "user" by default (see schema.prisma). Access to
    // /admin itself is gated on role elsewhere (proxy.ts, requireAdmin()),
    // not here.
    signIn: async () => true,
    jwt: async ({ token, user, account }) => {
      if (user) {
        if (account?.provider === "credentials") {
          token.role = "admin";
        } else {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true },
          });
          token.role = dbUser?.role ?? "user";
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.role = (token.role as "user" | "admin" | undefined) ?? "user";
      }
      return session;
    },
  },
});
