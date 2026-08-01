export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  coverLabel: string;
  coverAngle: number;
  coverTone: 1 | 2 | 3;
  content: string[];
};

export const posts: BlogPost[] = [
  {
    slug: "cuidado-joyas-rodio",
    title: "Cómo cuidar tus joyas de rodio para que brillen siempre",
    excerpt:
      "El rodio es uno de los metales más duros y brillantes que existen, pero no es indestructible. Estos son los cuidados reales que le dan a una pieza años de vida.",
    date: "2026-06-12",
    readTime: "4 min",
    category: "Cuidado",
    coverLabel: "detalle — limpieza de manilla",
    coverAngle: 100,
    coverTone: 2,
    content: [
      "El baño de rodio es lo que le da a una pieza ese brillo espejo y esa resistencia a rayones que no tiene la plata ni el oro sin recubrir. Pero sigue siendo un baño: una capa delicada que conviene cuidar si quieres que dure temporadas, no semanas.",
      "Guárdala por separado. El primer enemigo del rodio no es el agua, es el roce con otras joyas. Metal contra metal desgasta el recubrimiento más rápido que cualquier otra cosa. Usa la bolsita o el paño que viene en el empaque, o al menos un compartimento propio.",
      "Evita el contacto directo con perfume, crema y alcohol. Aplícalos antes de ponerte la pieza, no después. Los químicos de uso diario son la segunda causa más común de que un rodio pierda brillo antes de tiempo.",
      "Para limpiarla, un paño suave y seco basta el noventa por ciento de las veces. Si necesitas algo más, agua tibia con jabón neutro y un secado inmediato — nunca la dejes reposar mojada, y nunca uses productos abrasivos o cepillos de cerdas duras.",
      "Quítatela para dormir, hacer ejercicio, nadar o lavar platos. Suena exagerado hasta que ves la diferencia entre una pieza que se usó así todos los días y una que se cuidó: la segunda se ve nueva después de un año.",
      "Y si después de mucho uso notas que el brillo bajó, no se acabó la pieza: en Estella volvemos a bañar en rodio las piezas que compraste con nosotras. Escríbenos y te contamos cómo.",
    ],
  },
  {
    slug: "como-combinar-joyas-estella",
    title: "3 formas de combinar tus joyas Estella esta temporada",
    excerpt:
      "No se trata de usar más, se trata de usar con intención. Tres maneras de armar un look con tus piezas, de la más discreta a la más protagonista.",
    date: "2026-07-02",
    readTime: "3 min",
    category: "Estilo",
    coverLabel: "editorial — capas y apiladas",
    coverAngle: 132,
    coverTone: 1,
    content: [
      "La joyería no tiene que ser una decisión de todo o nada. Estas tres formas de combinarla son las que más vemos funcionar entre quienes ya llevan Estella, y cada una tiene su momento.",
      "En capas es la más versátil: dos o tres largos distintos de collar, uno pegado al cuello y otro más largo con dije, crean profundidad sin necesitar una pieza statement. Funciona con cuello redondo, con camisa abierta, con vestido escotado.",
      "Apiladas es para la muñeca: mezclar grosores en vez de repetir la misma manilla. Una plana, una tejida, una con broche pequeño. El contraste de texturas hace el trabajo que antes hacía una sola pieza grande.",
      "Una sola pieza es la más difícil de acertar y la que más impacta cuando funciona: un arete escultural, sin collar, sin manillas, con el resto del look en silencio. Es la opción para cuando la joya es el punto focal, no el acompañamiento.",
      "Ninguna de las tres es más correcta que otra — depende del día, de la ocasión y de qué tan protagonista quieras que sea la pieza. Si no sabes por dónde empezar, cuéntanos qué tienes y qué buscas por WhatsApp; armamos la combinación contigo.",
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}
