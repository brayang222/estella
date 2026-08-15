import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { OrganizationJsonLd } from "@/components/JsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { catalogCategories, getCategories, getSiteSettings } from "@/lib/queries";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-poppins",
  display: "swap",
});

const TITLE = `${SITE_NAME} — Accesorios hechos a mano en Colombia`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "accesorios hechos a mano",
    "joyería artesanal Colombia",
    "accesorios artesanales",
    "manillas para regalo",
    "collares minimalistas",
    "anillos minimalistas",
    "accesorios Estella",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "es_CO",
    type: "website",
  },
  // Sin title/description propios a propósito: Next.js los toma de openGraph
  // cuando faltan aquí, así cada página (producto, blog) trae los suyos
  // sin tener que repetirlos — solo images necesitaba ese mismo respaldo,
  // que ya venía cayendo bien.
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Consulta a la base de datos, no una API dinámica: las páginas estáticas
  // siguen prerenderizándose y se regeneran cuando se guardan los ajustes.
  const settings = await getSiteSettings();
  // El footer las enlaza en todas las páginas: es el enlazado interno del que
  // Google saca los sitelinks de categoría bajo el resultado principal.
  const categories = catalogCategories(await getCategories());

  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${poppins.variable} scroll-smooth scroll-pt-[90px]`}
    >
      <body className="overflow-x-clip bg-paper font-body font-light text-ink">
        <OrganizationJsonLd />
        <SiteChrome settings={settings} categories={categories}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
