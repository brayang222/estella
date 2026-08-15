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
  async redirects() {
    return [
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
