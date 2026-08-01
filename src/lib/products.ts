export type ProductCategory = "manillas" | "collares" | "anillos" | "aretes";

export type Product = {
  id: string;
  name: string;
  price: string;
  category: ProductCategory;
  tag: string;
  placeholderLabel: string;
  image?: string;
};

export const products: Product[] = [
  {
    id: "manilla-aurora",
    name: "Manilla Aurora",
    price: "$189.000",
    category: "manillas",
    tag: "Serie 01",
    placeholderLabel: "manilla eslabón fino",
  },
  {
    id: "collar-lumiere",
    name: "Collar Lumière",
    price: "$249.000",
    category: "collares",
    tag: "Nuevo",
    placeholderLabel: "collar cadena espejo",
  },
  {
    id: "anillo-solene",
    name: "Anillo Solene",
    price: "$159.000",
    category: "anillos",
    tag: "Serie 02",
    placeholderLabel: "anillo banda pulida",
  },
  {
    id: "aretes-nuit",
    name: "Aretes Nuit",
    price: "$139.000",
    category: "aretes",
    tag: "Nuevo",
    placeholderLabel: "aretes gota",
  },
  {
    id: "manilla-riviere",
    name: "Manilla Rivière",
    price: "$219.000",
    category: "manillas",
    tag: "Últimas",
    placeholderLabel: "manilla tenis",
  },
  {
    id: "collar-etoile",
    name: "Collar Étoile",
    price: "$279.000",
    category: "collares",
    tag: "Serie 03",
    placeholderLabel: "collar con dije",
  },
  {
    id: "anillo-duo",
    name: "Anillo Duo",
    price: "$175.000",
    category: "anillos",
    tag: "Serie 01",
    placeholderLabel: "anillo doble aro",
  },
  {
    id: "aretes-perle",
    name: "Aretes Perle",
    price: "$149.000",
    category: "aretes",
    tag: "Últimas",
    placeholderLabel: "aretes huggie",
  },
];

export const categoryFilters: { key: "todo" | ProductCategory; label: string }[] = [
  { key: "todo", label: "Todo" },
  { key: "manillas", label: "Manillas" },
  { key: "collares", label: "Collares" },
  { key: "anillos", label: "Anillos" },
  { key: "aretes", label: "Aretes" },
];

/** "$189.000" (COP, "." as thousands separator) -> 189000 */
export function priceToNumber(price: string): number {
  return Number(price.replace(/[^0-9]/g, ""));
}
