"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { StoreProvider } from "@/lib/store";
import { SiteSettingsProvider } from "@/lib/settings-context";
import type { SiteSettings } from "@/lib/settings";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";

/** Routes with their own shell (split screen or admin panel): no nav/footer/WhatsApp float. */
const BARE_ROUTES = ["/login", "/registro"];

export function SiteChrome({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const bare = pathname.startsWith("/admin") || BARE_ROUTES.includes(pathname);
  // Estas rutas traen su propia barra fija de compra en móvil (ver
  // ProductOrderPanel/BagList) — el flotante de WhatsApp se aparta ahí.
  const hasMobileBuyBar = pathname.startsWith("/producto/") || pathname === "/bolsa";

  // The providers wrap everything — including the panel and the login screen —
  // so session, bag and settings survive any navigation between sections.
  return (
    <SessionProvider>
      <SiteSettingsProvider settings={settings}>
        <StoreProvider>
          {bare ? (
            children
          ) : (
            <>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <WhatsAppFloat hiddenOnMobile={hasMobileBuyBar} />
            </>
          )}
        </StoreProvider>
      </SiteSettingsProvider>
    </SessionProvider>
  );
}
