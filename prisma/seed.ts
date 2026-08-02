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
    price: 129000,
    available: true,
    tag: "Nuevo",
    description:
      "Collar en rodio con dije de margarita en esmalte blanco y centro dorado, montado sobre cadena veneciana de caída media. Una pieza fresca y femenina para uso diario que no se opaca ni mancha la piel. Ideal para llevar sola o en capas con otros collares Estella.",
    measurements: "Cadena: 42 cm + 5 cm de extensor. Dije: 1.2 cm.",
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
    available: true,
    tag: "Clásico",
    description:
      "Manilla tenis clásica en rodio con línea continua de circonias talla brillante engastadas una a una. El acabado espejo mantiene el brillo con el uso diario y el broche de seguridad evita pérdidas. La pulsera más versátil de la colección: va con jean y con vestido de fiesta.",
    measurements: "Largo: 17 cm + 2 cm de extensor. Ajustable a la mayoría de muñecas.",
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
    available: true,
    tag: "Nuevo",
    description:
      "Collar en rodio con dije de girasol tallado en relieve y cadena veneciana delgada. Un símbolo de energía y buena suerte, en una pieza pequeña que se lleva todos los días. Perfecto como regalo de cumpleaños o detalle de agradecimiento.",
    measurements: "Cadena: 42 cm + 5 cm de extensor. Dije: 1.3 cm.",
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
    available: true,
    tag: "Nuevo",
    description:
      "Manilla tenis en rodio con corazones alternados entre circonias, en acabado dorado espejo. Combina el brillo de una tenis clásica con un detalle romántico y discreto. Excelente regalo de aniversario o de San Valentín.",
    measurements: "Largo: 17 cm + 2 cm de extensor.",
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
    available: true,
    tag: "Serie 01",
    description:
      "Collar en rodio con medallón circular en esmalte blanco y corazón rojo pintado a mano. Una pieza de la Serie 01, en tiraje corto y numerado. Su tamaño moderado lo hace cómodo para uso diario y fácil de combinar en capas.",
    measurements: "Cadena: 40 cm + 5 cm de extensor. Medallón: 1.5 cm de diámetro.",
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
    available: true,
    tag: "Últimas",
    description:
      "Manilla tenis en rodio con piedras de color engastadas en línea continua, disponible en tonos verde y cristal. Últimas unidades de esta referencia de serie corta. Aporta un acento de color a un look neutro sin recargarlo.",
    measurements: "Largo: 17 cm + 2 cm de extensor.",
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
    available: true,
    tag: "Serie 01",
    description:
      "Collar en rodio con dije de pareja abrazada, esculpido en volumen sobre cadena veneciana. Una pieza simbólica de la Serie 01, pensada para regalar a quien te acompaña. Acabado espejo hipoalergénico apto para piel sensible.",
    measurements: "Cadena: 45 cm + 5 cm de extensor. Dije: 2.5 cm de alto.",
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
    available: true,
    tag: "Serie 01",
    description:
      "Manilla en rodio de eslabón plano con dijes de corazón colgantes que se mueven con la muñeca. Pieza de la Serie 01 en tiraje limitado. Se ve espectacular apilada con una manilla tenis del mismo tono.",
    measurements: "Largo: 16 cm + 3 cm de extensor.",
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
    available: true,
    tag: "Serie 02",
    description:
      "Collar en rodio con dije de corazón calado y figura de madre e hijo en el centro, con circonias en el contorno. Una pieza cargada de significado, ideal como regalo del Día de la Madre. Serie 02, en tiraje corto y numerado.",
    measurements: "Cadena: 42 cm + 5 cm de extensor. Dije: 2 cm.",
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
    available: true,
    tag: "Serie 02",
    description:
      "Manilla en rodio de eslabón grueso tipo cadena, con broche reforzado y acabado espejo. Una pieza de carácter que funciona sola como declaración o apilada con piezas más delgadas. Serie 02, en cantidad limitada.",
    measurements: "Largo: 18 cm + 2 cm de extensor.",
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
    available: true,
    tag: "Set x2",
    description:
      "Set de dos collares en rodio con alas de ángel complementarias: una en plata envejecida y otra en dorado con circonias. Al unirlas forman un corazón completo, pensado para parejas, madre e hija o mejores amigas. Incluye las dos cadenas venecianas y empaque de regalo.",
    measurements: "Cadena: 40 cm cada una + 5 cm de extensor. Dije: 1.8 cm por mitad.",
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
    available: true,
    tag: "Nuevo",
    description:
      "Manilla en rodio de cuentas facetadas en tonos mixtos con medallón de San Benito. Combina el brillo de las cuentas con un dije de protección tradicional. Cierre ajustable con extensión, se adapta a la mayoría de muñecas.",
    measurements: "Largo: 16 cm + 4 cm de extensor.",
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
    available: true,
    tag: "Personalizado",
    description:
      "Collar en rodio con la inicial que elijas, en tipografía script sobre cadena veneciana delgada. Se produce bajo pedido con la letra que nos indiques por WhatsApp. El regalo personalizado más pedido de Estella: entrega en 2 a 4 días hábiles.",
    measurements: "Cadena: 40 cm + 5 cm de extensor. Inicial: 1 cm de alto aprox.",
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
