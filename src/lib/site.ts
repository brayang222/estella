export const SITE_NAME = "Estella";

// Dominio real de Vercel mientras no haya un dominio propio conectado. Se
// puede sobreescribir con NEXT_PUBLIC_SITE_URL (ej. al conectar
// estella.com.co) sin tocar código — mismo patrón que NEXT_PUBLIC_IMAGE_BASE_URL.
// metadataBase usa esto para armar og:image y las demás URLs absolutas: si
// apunta a un dominio que no sirve el sitio, WhatsApp/Facebook/iMessage no
// pueden descargar la imagen de vista previa y el link se comparte sin ella.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://estella-co.vercel.app";

export const SITE_DESCRIPTION =
  "Manillas, collares, anillos y aretes en series cortas y numeradas, hechos a mano en Colombia. Asesoría personalizada por WhatsApp y envíos asegurados a todo el país.";

// Instagram, TikTok y el número de WhatsApp ya no viven aquí: se editan en
// /admin/ajustes. Ver src/lib/settings.ts.
