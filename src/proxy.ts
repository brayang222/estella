import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "admin";
  const pathname = req.nextUrl.pathname;
  const isLoginPage = pathname === "/login";
  const isPendingPage = pathname === "/admin/pendiente";

  if (!isLoggedIn) {
    return isLoginPage ? undefined : NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Logged in, but not (yet) promoted to admin in the DB.
  if (!isAdmin) {
    return isPendingPage ? undefined : NextResponse.redirect(new URL("/admin/pendiente", req.nextUrl));
  }

  // Logged in and admin — bounce away from login/pending, nothing to do there.
  if (isLoginPage || isPendingPage) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
