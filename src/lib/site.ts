export const SITE_NAME = "Estella";

/**
 * Dominio público del sitio. Escrito en el código a propósito, sin leer
 * NEXT_PUBLIC_SITE_URL: al ser una variable `NEXT_PUBLIC_*` su valor se
 * incrusta durante el build, así que un despliegue con la variable mal puesta
 * (ausente, en otro entorno, en otro proyecto o con el dominio de Vercel)
 * congelaba el dominio equivocado en canonical, og:image y sitemap — que fue
 * justo lo que hizo que Google rechazara las 25 URLs del sitemap.
 *
 * El dominio es uno solo y no cambia; si algún día cambia, se edita esta línea
 * y listo. Con `www` porque es a donde resuelve el dominio hoy.
 */
export const SITE_URL = "https://www.estella.com.co";

export const SITE_DESCRIPTION =
  "Accesorios hechos a mano en Colombia: manillas, collares, anillos y aretes. Asesoría personalizada por WhatsApp y envíos asegurados a todo el país.";

// Instagram, TikTok y el número de WhatsApp ya no viven aquí: se editan en
// /admin/ajustes. Ver src/lib/settings.ts.

/**
 * Imagen de vista previa al compartir. Hay que pasarla explícitamente en toda
 * página que declare su propio `openGraph`: Next solo hereda ese objeto del
 * layout cuando la página no lo define, y al definirlo lo reemplaza entero —
 * incluidas las imágenes. Sin esto, el enlace se comparte sin foto.
 */
export const OG_IMAGE = "/opengraph-image.jpg";
