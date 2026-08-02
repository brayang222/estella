"use client";

import { createContext, useContext } from "react";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "./settings";

/**
 * Los ajustes se leen una sola vez en el layout raíz (servidor) y bajan por
 * contexto a los componentes de cliente que arman enlaces de WhatsApp. Los
 * componentes de servidor no usan esto: llaman a getSiteSettings() directo.
 */
const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
