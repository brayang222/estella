"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { StoreProvider } from "@/lib/store";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";

/** Routes with their own shell (split screen or admin panel): no nav/footer/WhatsApp float. */
const BARE_ROUTES = ["/login", "/registro"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = pathname.startsWith("/admin") || BARE_ROUTES.includes(pathname);

  // The providers wrap everything — including the panel and the login screen —
  // so session and bag survive any navigation between sections.
  return (
    <SessionProvider>
      <StoreProvider>
        {bare ? (
          children
        ) : (
          <>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <WhatsAppFloat />
          </>
        )}
      </StoreProvider>
    </SessionProvider>
  );
}
