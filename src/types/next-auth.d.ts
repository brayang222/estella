import type { DefaultSession } from "next-auth";

type Role = "user" | "admin";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  /** authorize() returns the role so the jwt callback doesn't re-query for it. */
  interface User {
    role?: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
  }
}
