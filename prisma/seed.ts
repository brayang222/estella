import "dotenv/config";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { PrismaClient } from "../src/generated/prisma/client";

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type SeedCategory = {
  slug: string;
  label: string;
  sortOrder: number;
};

const categories: SeedCategory[] = [
  { slug: "pulseras", label: "Pulseras", sortOrder: 0 },
  { slug: "collares", label: "Collares", sortOrder: 1 },
  { slug: "anillos", label: "Anillos", sortOrder: 2 },
  { slug: "aretes", label: "Aretes", sortOrder: 3 },
];

type SeedProduct = {
  slug: string;
  referenceCode: string;
  name: string;
  categorySlug: string;
  price: number;
  available: boolean;
  tag: string;
  /** Shown on the detail page and reused as the page's meta description. */
  description: string;
  /** Chain/circumference + charm size, shown on the detail page. */
  measurements: string;
  /** Ordered front-to-back; index 0 is `order: 1` and becomes the grid thumbnail. Max 4 shown in the gallery. */
  images: string[];
  placeholderLabel: string;
  sortOrder: number;
};

const products: SeedProduct[] = [
  {
    slug: "collar-margarita",
    referenceCode: "COL-001",
    name: "Collar Margarita",
    categorySlug: "collares",
    price: 22900,
    available: true,
    tag: "Nuevo",
    description:
      "Collar artesanal en rodio con dije de margarita en esmalte blanco y centro dorado, sobre cadena veneciana de caída media. Hecho a mano en Colombia, no se opaca ni mancha la piel. Ideal para uso diario, solo o en capas con otros collares Estella.",
    measurements: "Cadena: 42 cm + 5 cm de extensor. Dije: 1.2 cm.",
    images: ["/products/collar-margarita.webp"],
    placeholderLabel: "collar margarita",
    sortOrder: 0,
  },
  {
    slug: "collar-karina-corazon",
    referenceCode: "MAN-001",
    name: "Collar Karina Corazón",
    categorySlug: "collares",
    price: 84900,
    available: true,
    tag: "Clásico",
    description:
      "Collar tipo tenis con eslabones circulares y circonias engastadas una a una, en acabado espejo. Disponible en dorado y en rodio. Una pieza de brillo continuo, hecha a mano en Colombia, que funciona sola o combinada en capas.",
    measurements: "",
    images: ["/products/manilla-tenis-clasica.webp"],
    placeholderLabel: "collar karina corazón",
    sortOrder: 1,
  },
  {
    slug: "collar-girasol",
    referenceCode: "COL-002",
    name: "Collar Girasol",
    categorySlug: "collares",
    price: 22900,
    available: true,
    tag: "Nuevo",
    description:
      "Collar artesanal en rodio con dije de girasol tallado en relieve y cadena veneciana delgada. Símbolo de energía y buena suerte, hecho a mano en Colombia. Un collar minimalista perfecto como regalo de cumpleaños o detalle de agradecimiento.",
    measurements: "Cadena: 42 cm + 5 cm de extensor. Dije: 1.3 cm.",
    images: ["/products/collar-girasol.webp"],
    placeholderLabel: "collar girasol",
    sortOrder: 2,
  },
  {
    slug: "pulsera-karina-circular",
    referenceCode: "MAN-002",
    name: "Pulsera Karina Circular",
    categorySlug: "pulseras",
    price: 54900,
    available: true,
    tag: "Nuevo",
    description:
      "Pulsera artesanal de eslabones circulares con circonias, en acabado espejo. Hecha a mano en Colombia, con broche de seguridad y extensor. Se lleva sola o apilada con otras pulseras Estella.",
    measurements: "Largo: 17 cm + 2 cm de extensor.",
    images: ["/products/manilla-tenis-corazones.webp"],
    placeholderLabel: "pulsera karina circular",
    sortOrder: 3,
  },
  {
    slug: "collar-corazon",
    referenceCode: "COL-003",
    name: "Collar Corazón",
    categorySlug: "collares",
    price: 22900,
    available: true,
    tag: "Serie 01",
    description:
      "Collar artesanal en rodio con medallón circular en esmalte blanco y corazón rojo pintado a mano. Serie 01, en tiraje corto y numerado. Hecho a mano en Colombia, cómodo para uso diario y fácil de combinar en capas.",
    measurements: "Cadena: 40 cm + 5 cm de extensor. Medallón: 1.5 cm de diámetro.",
    images: ["/products/collar-corazon-rojo.webp"],
    placeholderLabel: "collar corazón rojo",
    sortOrder: 4,
  },
  {
    slug: "pulsera-tennis",
    referenceCode: "MAN-003",
    name: "Pulsera Tennis",
    categorySlug: "pulseras",
    price: 22900,
    available: true,
    tag: "Últimas",
    description:
      "Pulsera tennis artesanal con circonias engastadas en línea continua, disponible en verde y cristal. Hecha a mano en Colombia, con broche de seguridad. Aporta un acento de brillo a un look neutro sin recargarlo.",
    measurements: "Largo: 17 cm + 2 cm de extensor.",
    images: ["/products/manilla-tenis-piedra-de-color.webp"],
    placeholderLabel: "pulsera tennis",
    sortOrder: 5,
  },
  {
    slug: "collar-pareja",
    referenceCode: "COL-004",
    name: "Collar Pareja",
    categorySlug: "collares",
    price: 29900,
    available: true,
    tag: "Serie 01",
    description:
      "Collar artesanal en rodio con dije de pareja abrazada, esculpido en volumen sobre cadena veneciana. Serie 01, hecho a mano en Colombia. Una pieza simbólica para regalar, con acabado espejo apto para piel sensible.",
    measurements: "Cadena: 45 cm + 5 cm de extensor. Dije: 2.5 cm de alto.",
    images: ["/products/collar-abrazo.webp"],
    placeholderLabel: "collar pareja",
    sortOrder: 6,
  },
  {
    slug: "pulsera-corazones-fantasiosos",
    referenceCode: "MAN-004",
    name: "Pulsera Corazones Fantasiosos",
    categorySlug: "pulseras",
    price: 18900,
    available: true,
    tag: "Serie 01",
    description:
      "Pulsera artesanal de eslabón plano con dijes de corazón colgantes que se mueven con la muñeca. Serie 01 en tiraje limitado, hecha a mano en Colombia. Se ve espectacular apilada con una pulsera tennis del mismo tono.",
    measurements: "Largo: 16 cm + 3 cm de extensor.",
    images: ["/products/manilla-dije-corazones.webp"],
    placeholderLabel: "pulsera corazones fantasiosos",
    sortOrder: 7,
  },
  {
    slug: "collar-eres-mi-mundo",
    referenceCode: "COL-005",
    name: "Collar Eres Mi Mundo",
    categorySlug: "collares",
    price: 22900,
    available: true,
    tag: "Serie 02",
    description:
      "Collar artesanal en rodio con dije de corazón calado y figura de madre e hijo, con circonias en el contorno. Serie 02, hecho a mano en Colombia. Una pieza cargada de significado, ideal como regalo del Día de la Madre.",
    measurements: "Cadena: 42 cm + 5 cm de extensor. Dije: 2 cm.",
    images: ["/products/collar-eres-mi-mundo.webp"],
    placeholderLabel: "collar eres mi mundo",
    sortOrder: 8,
  },
  {
    slug: "pulsera-gucci",
    referenceCode: "MAN-005",
    name: "Pulsera Gucci",
    categorySlug: "pulseras",
    price: 18900,
    available: true,
    tag: "Serie 02",
    description:
      "Pulsera artesanal de cadena eslabón mariner en acabado dorado espejo, con broche reforzado. Hecha a mano en Colombia. Delgada y versátil: se lleva sola o apilada con otras pulseras Estella.",
    measurements: "Largo: 18 cm + 2 cm de extensor.",
    images: ["/products/manilla-eslabon.webp"],
    placeholderLabel: "pulsera gucci",
    sortOrder: 9,
  },
  {
    slug: "collar-pareja-alas-de-angel",
    referenceCode: "COL-006",
    name: "Collar Pareja Alas de Ángel",
    categorySlug: "collares",
    price: 22900,
    available: true,
    tag: "Set x2",
    description:
      "Set de dos collares artesanales en rodio con alas de ángel complementarias, una en plata envejecida y otra en dorado con circonias. Al unirlas forman un corazón. Hechos a mano en Colombia, con empaque de regalo incluido.",
    measurements: "Cadena: 40 cm cada una + 5 cm de extensor. Dije: 1.8 cm por mitad.",
    images: ["/products/collar-pareja-alas-de-angel.webp"],
    placeholderLabel: "collar pareja alas de ángel",
    sortOrder: 10,
  },
  {
    slug: "pulsera-san-benito-tres-oros",
    referenceCode: "MAN-006",
    name: "Pulsera San Benito Tres Oros",
    categorySlug: "pulseras",
    price: 24900,
    available: true,
    tag: "Nuevo",
    description:
      "Pulsera artesanal de cuentas facetadas en tres tonos —dorado, oro rosa y plata— con medallas de San Benito. Hecha a mano en Colombia, con cierre ajustable y extensor. Una pieza de protección para uso diario.",
    measurements: "Largo: 16 cm + 4 cm de extensor.",
    images: ["/products/manilla-cuentas-medallon.webp"],
    placeholderLabel: "pulsera san benito tres oros",
    sortOrder: 11,
  },
  {
    slug: "collar-inicial-personalizada",
    referenceCode: "COL-007",
    name: "Collar Inicial Personalizada",
    categorySlug: "collares",
    price: 14900,
    available: true,
    tag: "Personalizado",
    description:
      "Collar artesanal en rodio con la inicial que elijas, en tipografía script sobre cadena veneciana delgada. Hecho a mano en Colombia bajo pedido. El regalo personalizado más pedido de Estella: entrega en 2 a 4 días hábiles.",
    measurements: "Cadena: 40 cm + 5 cm de extensor. Inicial: 1 cm de alto aprox.",
    images: ["/products/collar-inicial-personalizada.webp"],
    placeholderLabel: "collar inicial personalizada",
    sortOrder: 12,
  },
];

/**
 * El seed SOLO crea lo que falta. Nunca pisa una fila existente.
 *
 * Antes hacía `upsert` con `update: { ...product }`, así que cada corrida
 * reescribía precio, nombre, descripción y stock con los valores de este
 * archivo. El 2026-08-02 a las 03:28 UTC eso borró de un golpe los precios
 * reales que se habían cargado desde /admin, y nadie se enteró hasta trece
 * días después — la base no guarda historial de lo que había antes.
 *
 * Un seed puebla una base vacía. Los datos vivos son del admin, no de este
 * archivo. Si alguna vez hace falta reescribir a propósito, que sea un script
 * aparte y con nombre explícito, no un efecto secundario de `migrate`.
 */
async function main() {
  const categoryIdBySlug = new Map<string, string>();
  let nuevasCategorias = 0;
  let nuevosProductos = 0;
  let respetados = 0;

  for (const category of categories) {
    const existente = await prisma.category.findUnique({
      where: { slug: category.slug },
      select: { id: true, slug: true },
    });
    const row = existente ?? (await prisma.category.create({ data: category }));
    if (!existente) nuevasCategorias++;
    categoryIdBySlug.set(row.slug, row.id);
  }
  console.log(`Categorías: ${nuevasCategorias} creadas, ${categories.length - nuevasCategorias} ya existían (intactas).`);

  for (const { categorySlug, images, ...product } of products) {
    const categoryId = categoryIdBySlug.get(categorySlug);
    if (!categoryId) throw new Error(`Unknown category slug: ${categorySlug}`);

    const existente = await prisma.product.findUnique({
      where: { slug: product.slug },
      select: { id: true },
    });
    if (existente) {
      respetados++;
      continue;
    }

    const row = await prisma.product.create({ data: { ...product, categoryId } });
    nuevosProductos++;

    // Solo para la pieza recién creada: nunca se tocan las fotos de una que ya
    // existía, que pueden haberse subido desde el admin.
    for (const [index, url] of images.slice(0, 4).entries()) {
      await prisma.productImage.create({ data: { productId: row.id, url, order: index + 1 } });
    }
  }
  console.log(`Productos: ${nuevosProductos} creados, ${respetados} ya existían (intactos, con sus precios y fotos).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
