import type { NextConfig } from "next";

const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

// When photos move off this project (NEXT_PUBLIC_IMAGE_BASE_URL points at a
// CDN/storage domain instead of being empty), next/image needs that host
// allow-listed. Derive it from the same env var instead of hardcoding it, so
// switching hosts is a one-line env change, not a code change too.
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
if (imageBaseUrl) {
  const url = new URL(imageBaseUrl);
  remotePatterns.push({
    protocol: url.protocol.replace(":", "") as "http" | "https",
    hostname: url.hostname,
  });
}

const nextConfig: NextConfig = {
  images: { remotePatterns },
  // Enlaces viejos del catálogo (?categoria=collares) a su página propia.
  // Va aquí y no en la página para que /productos pueda prerenderizarse: leer
  // searchParams en el componente la volvía dinámica y sin caché.
  //
  // ponytail: Next arrastra el query al destino y no permite soltarlo, así que
  // el enlace viejo aterriza en /productos/collares?categoria=collares. Es
  // cosmético — la página se ve igual y su canonical apunta a la URL limpia,
  // así que Google consolida. Si algún día molesta, hay que moverlo a proxy.ts,
  // que sí puede reescribir la URL, a costa de correr en cada visita.
  /**
   * Cabeceras de seguridad. En producción solo llegaba HSTS, que la pone
   * Vercel; estas cuatro cubren clickjacking, sniffing de MIME, fuga de
   * referrer y permisos de dispositivo que el sitio no usa.
   *
   * ponytail: falta Content-Security-Policy a propósito. Es la que más
   * protege y la que más rompe — el sitio usa estilos en línea, GSAP y
   * next/image, así que una CSP mal calibrada tumba la página entera. Va
   * aparte, con pruebas, no de pasada.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Nadie debería poder incrustar la tienda en un iframe ajeno.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Evita que el navegador adivine el tipo de un archivo servido.
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // El sitio no pide cámara, micrófono ni ubicación.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Piezas renombradas a su nombre comercial real. Las URLs viejas ya
      // estaban indexadas, así que se redirigen en vez de dejarlas en 404:
      // el 301 le dice a Google que la página se mudó y le traspasa lo que
      // había acumulado. Se pueden retirar cuando Search Console deje de
      // reportar tráfico hacia ellas (meses, no semanas).
      ...(
        [
          ["manilla-tenis-clasica", "collar-karina-corazon"],
          ["manilla-tenis-corazones", "pulsera-karina-circular"],
          ["collar-corazon-rojo", "collar-corazon"],
          ["manilla-tenis-piedra-de-color", "pulsera-tennis"],
          ["collar-abrazo", "collar-pareja"],
          ["manilla-dije-corazones", "pulsera-corazones-fantasiosos"],
          ["manilla-eslabon", "pulsera-gucci"],
          ["manilla-cuentas-medallon", "pulsera-san-benito-tres-oros"],
        ] as const
      ).map(([viejo, nuevo]) => ({
        source: `/producto/${viejo}`,
        destination: `/producto/${nuevo}`,
        permanent: true,
      })),
      {
        source: "/productos",
        has: [{ type: "query", key: "categoria", value: "(?<categoria>.*)" }],
        destination: "/productos/:categoria",
        permanent: true,
      },
    ];
  },
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
