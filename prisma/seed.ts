import { prisma } from "../src/lib/db";

type SeedProduct = {
  slug: string;
  referenceCode: string;
  name: string;
  category: "manillas" | "collares" | "anillos" | "aretes";
  price: number;
  tag: string;
  placeholderLabel: string;
  sortOrder: number;
};

const products: SeedProduct[] = [
  {
    slug: "manilla-aurora",
    referenceCode: "MAN-001",
    name: "Manilla Aurora",
    category: "manillas",
    price: 189000,
    tag: "Serie 01",
    placeholderLabel: "manilla eslabón fino",
    sortOrder: 0,
  },
  {
    slug: "collar-lumiere",
    referenceCode: "COL-001",
    name: "Collar Lumière",
    category: "collares",
    price: 249000,
    tag: "Nuevo",
    placeholderLabel: "collar cadena espejo",
    sortOrder: 1,
  },
  {
    slug: "anillo-solene",
    referenceCode: "ANI-001",
    name: "Anillo Solene",
    category: "anillos",
    price: 159000,
    tag: "Serie 02",
    placeholderLabel: "anillo banda pulida",
    sortOrder: 2,
  },
  {
    slug: "aretes-nuit",
    referenceCode: "ARE-001",
    name: "Aretes Nuit",
    category: "aretes",
    price: 139000,
    tag: "Nuevo",
    placeholderLabel: "aretes gota",
    sortOrder: 3,
  },
  {
    slug: "manilla-riviere",
    referenceCode: "MAN-002",
    name: "Manilla Rivière",
    category: "manillas",
    price: 219000,
    tag: "Últimas",
    placeholderLabel: "manilla tenis",
    sortOrder: 4,
  },
  {
    slug: "collar-etoile",
    referenceCode: "COL-002",
    name: "Collar Étoile",
    category: "collares",
    price: 279000,
    tag: "Serie 03",
    placeholderLabel: "collar con dije",
    sortOrder: 5,
  },
  {
    slug: "anillo-duo",
    referenceCode: "ANI-002",
    name: "Anillo Duo",
    category: "anillos",
    price: 175000,
    tag: "Serie 01",
    placeholderLabel: "anillo doble aro",
    sortOrder: 6,
  },
  {
    slug: "aretes-perle",
    referenceCode: "ARE-002",
    name: "Aretes Perle",
    category: "aretes",
    price: 149000,
    tag: "Últimas",
    placeholderLabel: "aretes huggie",
    sortOrder: 7,
  },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
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
