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
  { slug: "manillas", label: "Manillas", sortOrder: 0 },
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
  tag: string;
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
    price: 129000,
    tag: "Nuevo",
    images: ["/products/collar-margarita.webp"],
    placeholderLabel: "collar margarita",
    sortOrder: 0,
  },
  {
    slug: "manilla-tenis-clasica",
    referenceCode: "MAN-001",
    name: "Manilla Tenis Clásica",
    categorySlug: "manillas",
    price: 199000,
    tag: "Clásico",
    images: ["/products/manilla-tenis-clasica.webp"],
    placeholderLabel: "manilla tenis clásica",
    sortOrder: 1,
  },
  {
    slug: "collar-girasol",
    referenceCode: "COL-002",
    name: "Collar Girasol",
    categorySlug: "collares",
    price: 149000,
    tag: "Nuevo",
    images: ["/products/collar-girasol.webp"],
    placeholderLabel: "collar girasol",
    sortOrder: 2,
  },
  {
    slug: "manilla-tenis-corazones",
    referenceCode: "MAN-002",
    name: "Manilla Tenis Corazones",
    categorySlug: "manillas",
    price: 209000,
    tag: "Nuevo",
    images: ["/products/manilla-tenis-corazones.webp"],
    placeholderLabel: "manilla tenis corazones",
    sortOrder: 3,
  },
  {
    slug: "collar-corazon-rojo",
    referenceCode: "COL-003",
    name: "Collar Corazón",
    categorySlug: "collares",
    price: 119000,
    tag: "Serie 01",
    images: ["/products/collar-corazon-rojo.webp"],
    placeholderLabel: "collar corazón rojo",
    sortOrder: 4,
  },
  {
    slug: "manilla-tenis-piedra-de-color",
    referenceCode: "MAN-003",
    name: "Manilla Tenis Piedra de Color",
    categorySlug: "manillas",
    price: 219000,
    tag: "Últimas",
    images: ["/products/manilla-tenis-piedra-de-color.webp"],
    placeholderLabel: "manilla tenis piedra de color",
    sortOrder: 5,
  },
  {
    slug: "collar-abrazo",
    referenceCode: "COL-004",
    name: "Collar Abrazo",
    categorySlug: "collares",
    price: 169000,
    tag: "Serie 01",
    images: ["/products/collar-abrazo.webp"],
    placeholderLabel: "collar abrazo",
    sortOrder: 6,
  },
  {
    slug: "manilla-dije-corazones",
    referenceCode: "MAN-004",
    name: "Manilla Dije Corazones",
    categorySlug: "manillas",
    price: 149000,
    tag: "Serie 01",
    images: ["/products/manilla-dije-corazones.webp"],
    placeholderLabel: "manilla dije corazones",
    sortOrder: 7,
  },
  {
    slug: "collar-eres-mi-mundo",
    referenceCode: "COL-005",
    name: "Collar Eres Mi Mundo",
    categorySlug: "collares",
    price: 179000,
    tag: "Serie 02",
    images: ["/products/collar-eres-mi-mundo.webp"],
    placeholderLabel: "collar eres mi mundo",
    sortOrder: 8,
  },
  {
    slug: "manilla-eslabon",
    referenceCode: "MAN-005",
    name: "Manilla Eslabón",
    categorySlug: "manillas",
    price: 139000,
    tag: "Serie 02",
    images: ["/products/manilla-eslabon.webp"],
    placeholderLabel: "manilla eslabón",
    sortOrder: 9,
  },
  {
    slug: "collar-pareja-alas-de-angel",
    referenceCode: "COL-006",
    name: "Collar Pareja Alas de Ángel",
    categorySlug: "collares",
    price: 239000,
    tag: "Set x2",
    images: ["/products/collar-pareja-alas-de-angel.webp"],
    placeholderLabel: "collar pareja alas de ángel",
    sortOrder: 10,
  },
  {
    slug: "manilla-cuentas-medallon",
    referenceCode: "MAN-006",
    name: "Manilla Cuentas Medallón",
    categorySlug: "manillas",
    price: 159000,
    tag: "Nuevo",
    images: ["/products/manilla-cuentas-medallon.webp"],
    placeholderLabel: "manilla cuentas con medallón",
    sortOrder: 11,
  },
  {
    slug: "collar-inicial-personalizada",
    referenceCode: "COL-007",
    name: "Collar Inicial Personalizada",
    categorySlug: "collares",
    price: 159000,
    tag: "Personalizado",
    images: ["/products/collar-inicial-personalizada.webp"],
    placeholderLabel: "collar inicial personalizada",
    sortOrder: 12,
  },
];

async function main() {
  const categoryIdBySlug = new Map<string, string>();

  for (const category of categories) {
    const row = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    categoryIdBySlug.set(row.slug, row.id);
  }
  console.log(`Seeded ${categories.length} categories.`);

  for (const { categorySlug, images, ...product } of products) {
    const categoryId = categoryIdBySlug.get(categorySlug);
    if (!categoryId) throw new Error(`Unknown category slug: ${categorySlug}`);
    const row = await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...product, categoryId },
      create: { ...product, categoryId },
    });

    const orderedImages = images.slice(0, 4);
    for (const [index, url] of orderedImages.entries()) {
      const order = index + 1;
      await prisma.productImage.upsert({
        where: { productId_order: { productId: row.id, order } },
        update: { url },
        create: { productId: row.id, url, order },
      });
    }
    // Keep re-runs idempotent: drop any images beyond what this seed now lists.
    await prisma.productImage.deleteMany({
      where: { productId: row.id, order: { gt: orderedImages.length } },
    });
  }
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
