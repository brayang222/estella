/**
 * Ajustes editables del sitio. Este archivo lo comparten servidor y cliente:
 * los valores por defecto de abajo son los que estuvieron escritos en el
 * código hasta ahora, y siguen siendo la red de seguridad si la fila de
 * SiteSetting no existe o la base de datos no responde.
 *
 * La lectura vive en getSiteSettings() (src/lib/queries.ts) y la edición en
 * /admin/ajustes.
 */
export type SiteSettings = {
  whatsappNumber: string;
  whatsappGreeting: string;
  instagramUrl: string;
  tiktokUrl: string;
  marqueeItems: string;
  productNote: string;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  whatsappNumber: "573126177800",
  whatsappGreeting: "Hola Estella, quiero ver las piezas disponibles.",
  // Perfil real, sin los parámetros de rastreo que Instagram añade al
  // compartir (igsh, utm_source): en `sameAs` deben ir URLs canónicas.
  instagramUrl: "https://www.instagram.com/estella__co",
  // Sin cuenta de TikTok todavía. Se deja vacío a propósito: apuntar a
  // tiktok.com no vincula ninguna cuenta y ensucia el sameAs.
  tiktokUrl: "",
  marqueeItems: [
    "Accesorios hechos a mano",
    "Envío asegurado a todo el país",
    "Asesoría 1 a 1 por WhatsApp",
    "Empaque de regalo incluido",
  ].join("\n"),
  productNote:
    "Accesorios hechos a mano en Colombia. Empaque de regalo incluido, envío asegurado a todo el país.",
};

/** Una frase por línea, sin vacías. */
export function marqueeLines(settings: SiteSettings): string[] {
  const lines = settings.marqueeItems
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.length > 0 ? lines : marqueeLines(DEFAULT_SITE_SETTINGS);
}

/**
 * Deja solo dígitos: wa.me no acepta espacios, guiones ni "+".
 * "+57 312 617 7800" -> "573126177800"
 */
export function normalizeWhatsappNumber(value: string): string {
  return value.replace(/\D/g, "");
}
