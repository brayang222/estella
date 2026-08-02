import { NextResponse } from "next/server";
import { auth } from "@/auth";

/** Where a session belongs right after signing in. */
function homeFor(isAdmin: boolean) {
  return isAdmin ? "/admin" : "/cuenta";
}

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "admin";
  const { pathname, search } = req.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/registro";
  const isAdminArea = pathname.startsWith("/admin");
  const isPendingPage = pathname === "/admin/pendiente";

  if (!isLoggedIn) {
    if (isAuthPage) return;
    // Remember where they were headed so login can send them back.
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  // Signed in — /login and /registro have nothing left to offer. The
  // callbackUrl exception matters: a session whose user row is gone gets sent
  // to /login?callbackUrl=… by requireCustomer(), and bouncing it back would
  // loop forever. With the parameter present we let the form render so they
  // can sign in again.
  if (isAuthPage && !req.nextUrl.searchParams.has("callbackUrl")) {
    return NextResponse.redirect(new URL(homeFor(isAdmin), req.nextUrl));
  }

  // /cuenta only needs a session, which we already have. /admin needs the role
  // on top of it — everyone else gets the "acceso pendiente" holding page.
  if (isAdminArea && !isAdmin) {
    return isPendingPage
      ? undefined
      : NextResponse.redirect(new URL("/admin/pendiente", req.nextUrl));
  }

  // Admins have no reason to see that holding page.
  if (isPendingPage && isAdmin) return NextResponse.redirect(new URL("/admin", req.nextUrl));
});

export const config = {
  matcher: ["/admin/:path*", "/cuenta/:path*", "/login", "/registro"],
};
