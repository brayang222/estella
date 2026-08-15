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
  /**
   * Foto de portada del lookbook. Sin esto se dibuja el placeholder rayado con
   * `coverLabel` — que es lo que siguen usando los artículos para los que
   * todavía no hay una foto que corresponda (anillos y aretes).
   */
  coverImage?: string;
  content: string[];
  /**
   * Categoría del catálogo de la que habla el artículo. Pinta un enlace al
   * final del post: le sirve a quien lo lee y, de paso, le pasa a la página
   * de categoría los enlaces internos que necesita para posicionar.
   */
  categorySlug?: string;
  /**
   * Sirve para cualquier pieza (cuidado, estilo), así que se usa de relleno en
   * la ficha de producto cuando la categoría no tiene artículos propios. Lo
   * que no lleve esta marca ni `categorySlug` —el contenido para mayoristas,
   * por ejemplo— se queda fuera de las fichas: ahí la clienta compra al detal.
   */
  forAnyPiece?: boolean;
};

// Orden del array = orden en /blog. Se mantiene del más reciente al más
// antiguo para que lo nuevo quede arriba.
export const posts: BlogPost[] = [
  {
    slug: "manillas-artesanales-como-reconocer-una-bien-hecha",
    title: "Manillas artesanales: cómo reconocer una bien hecha",
    excerpt:
      "Dos manillas pueden verse iguales en una foto y durar cosas muy distintas. Estos son los detalles que separan una pieza artesanal de una que se daña en un mes.",
    date: "2026-08-14",
    readTime: "4 min",
    category: "Guía",
    coverLabel: "detalle — cierre y terminado",
    coverAngle: 118,
    coverTone: 1,
    coverImage: "/lookbook/manillas-stack-detail.webp",
    categorySlug: "manillas",
    content: [
      "Las manillas artesanales se reconocen por los detalles que no salen en la foto. En una vitrina o en una pantalla, dos piezas pueden parecer idénticas: el mismo brillo, el mismo tejido, el mismo precio aproximado. La diferencia aparece al mes de uso, y para entonces ya la compraste.",
      "Mira primero el cierre. Es la parte que más se manipula y la primera que falla en una pieza mal hecha. Un broche que se siente flojo, que cuesta cerrar o que se abre solo al engancharse con la ropa no es un detalle menor: es el punto donde vas a perder la manilla. En una pieza bien armada el cierre se siente firme y hace un clic definido.",
      "Revisa los remates. En una manilla tejida o de eslabones, los extremos son donde se nota el trabajo manual. Deben estar cerrados de forma pareja, sin puntas que raspen ni hilos sueltos. Pasar el dedo por todo el contorno es la prueba más simple que existe y casi nadie la hace.",
      "Pregunta por el material del baño. No es lo mismo una pieza bañada en rodio que una con un recubrimiento genérico sin especificar. El rodio es más duro, resiste mejor el rayón y mantiene el brillo por más tiempo — pero cuesta más, y por eso quien lo usa lo dice. Si no está escrito en ninguna parte, vale la pena preguntar antes de comprar.",
      "Fíjate en el peso. Una manilla artesanal bien hecha tiene un peso que se siente al ponérsela, sin llegar a incomodar. Las piezas demasiado livianas suelen ser huecas o de lámina muy delgada, y son las que se deforman con un golpe cotidiano contra una mesa o el borde del carro.",
      "Ninguno de estos puntos requiere ser experta: son cosas que se ven y se sienten en treinta segundos con la pieza en la mano. Si vas a comprar en línea y no puedes tenerla, pide fotos del cierre y de los remates de cerca — nosotras las mandamos por WhatsApp sin problema, y de la pieza real, no del catálogo.",
    ],
  },
  {
    slug: "collares-minimalistas-para-uso-diario",
    title: "Collares minimalistas: la pieza que más termina usándose",
    excerpt:
      "El collar que compras para una ocasión especial se usa tres veces al año. El minimalista se usa todos los días. Por qué pasa eso y cómo elegir el tuyo.",
    date: "2026-08-06",
    readTime: "3 min",
    category: "Estilo",
    coverLabel: "editorial — collar de caída media",
    coverAngle: 145,
    coverTone: 2,
    coverImage: "/lookbook/collares-variedad.webp",
    categorySlug: "collares",
    content: [
      "Los collares minimalistas son, de lejos, las piezas que más se repiten en el uso diario. No es una opinión de tendencia: es lo que vemos en lo que la gente vuelve a pedir. El collar llamativo se compra para un evento y se guarda; el sencillo se pone todas las mañanas sin pensarlo.",
      "La razón es práctica. Una pieza discreta no compite con la ropa, así que sirve con la camisa del trabajo y con el vestido de la noche. No hay que decidir si combina — combina. Y esa ausencia de decisión es justo lo que hace que termine puesto todos los días.",
      "Al elegir, la caída importa más que el dije. Un collar corto, pegado al cuello, funciona con escotes abiertos y camisas desabotonadas. Uno de caída media es el más versátil de todos: cae justo debajo de la clavícula y se ve tanto con cuello redondo como con blusa. Uno largo pide ropa lisa para no encimarse con estampados.",
      "El segundo criterio es el acabado. Si la idea es usarlo a diario, el baño importa más que el diseño: una pieza en rodio aguanta el roce constante con la ropa y el sudor mucho mejor que un recubrimiento sin especificar. Un collar que se usa todos los días recibe en un mes el desgaste que otro recibe en un año.",
      "Y si ya tienes uno, el minimalista es la base ideal para armar capas: sumarle un segundo collar más largo, con un dije pequeño, crea profundidad sin volverse un accesorio protagonista. Es la forma más fácil de que una pieza que ya usas se vea distinta.",
      "Si dudas entre dos largos, escríbenos por WhatsApp y te decimos cuál cae mejor según lo que uses normalmente. Es más rápido que devolver una pieza que no te quedó como esperabas.",
    ],
  },
  {
    slug: "anillos-artesanales-como-saber-tu-talla",
    title: "Anillos artesanales: cómo saber tu talla sin salir de casa",
    excerpt:
      "La talla mal medida es la razón número uno de un cambio. Con un hilo y una regla la sacas en dos minutos, y estos son los errores que hay que evitar.",
    date: "2026-07-29",
    readTime: "4 min",
    category: "Guía",
    coverLabel: "detalle — anillo sobre superficie clara",
    coverAngle: 96,
    coverTone: 3,
    categorySlug: "anillos",
    content: [
      "Los anillos artesanales tienen un problema que no tienen las manillas ni los collares: si la talla falla, la pieza no se usa. Y medirla mal es más fácil de lo que parece, porque casi todos los métodos caseros que circulan tienen el mismo error de fondo.",
      "El método que sí funciona: toma un hilo o una tira de papel delgada, dale la vuelta al dedo sin apretar y marca el punto exacto donde se cruza. Estira la tira sobre una regla y mide los milímetros. Ese número es la circunferencia de tu dedo, y con él te decimos la talla — no hace falta que la interpretes tú.",
      "El error más común es medir apretando. La tira debe quedar ceñida pero deslizarse; si la ajustas hasta que marque la piel, vas a terminar con un anillo que entra a la fuerza y que no sale cuando el dedo se hincha. Mejor que sobre un poco a que falte.",
      "El segundo error es medir a la hora equivocada. Los dedos cambian de tamaño durante el día: en la mañana están más delgados y al final del día, con calor o después de ejercicio, se hinchan. Mide en la tarde, con el cuerpo en temperatura normal. Esa es la medida que te va a servir la mayor parte del tiempo.",
      "Y mide el dedo exacto en el que lo vas a usar. La diferencia entre el anular de una mano y el de la otra suele ser real, y entre un dedo y su vecino es casi siempre de más de una talla. Si el anillo es un regalo y no puedes medir a la persona, un anillo que ya use es la mejor pista: mide el diámetro interno.",
      "Si te queda la duda entre dos tallas, mándanos la medida en milímetros por WhatsApp antes de pedir. Preferimos resolverlo en un mensaje que después con un cambio.",
    ],
  },
  {
    slug: "aretes-artesanales-uso-diario",
    title: "Aretes artesanales: cómo elegir los que sí vas a usar",
    excerpt:
      "Peso, cierre y acabado deciden si unos aretes terminan puestos o guardados. Tres criterios simples antes de comprar.",
    date: "2026-07-22",
    readTime: "3 min",
    category: "Guía",
    coverLabel: "detalle — par sobre lino",
    coverAngle: 124,
    coverTone: 1,
    categorySlug: "aretes",
    content: [
      "Los aretes artesanales son la pieza donde más pesa la comodidad. Un collar incómodo se aguanta una noche; unos aretes incómodos se quitan a la hora y no se vuelven a poner. Por eso vale la pena mirar tres cosas antes de comprar, y el diseño no es la primera.",
      "El peso es el criterio número uno. Un arete pesado jala el lóbulo, y con el uso repetido esa tensión se nota. Si buscas algo para todos los días, prioriza piezas livianas; deja las de mayor tamaño y peso para ocasiones donde no vas a tenerlas puestas doce horas seguidas.",
      "El cierre define si se pierden. Los de presión son cómodos pero se aflojan con el tiempo, y son los que más se caen sin que uno se dé cuenta. Los de rosca y los de palanca son más seguros, aunque toman un segundo más al ponerse. Para un par que uses a diario o para viajar, la seguridad gana.",
      "El acabado importa más aquí que en cualquier otra pieza, porque está en contacto permanente con la piel. Un baño de rodio bien hecho resiste mejor el sudor y los productos de cuidado facial que un recubrimiento genérico. Si tienes la piel sensible a ciertos metales, pregunta por el material antes de comprar — es una consulta razonable y quien fabrica bien la responde sin rodeos.",
      "Un consejo práctico: si vas a estrenar unos aretes en un evento largo, pruébalos un rato en casa unos días antes. Es la única forma de saber si el peso y el cierre te funcionan, y te evita descubrirlo a mitad de la noche.",
      "Si no sabes cuáles te quedarían mejor, cuéntanos por WhatsApp qué tipo de arete usas normalmente y te sugerimos según eso.",
    ],
  },
  {
    slug: "accesorios-al-por-mayor-colombia",
    title: "Accesorios al por mayor en Colombia: qué preguntar antes de elegir proveedor",
    excerpt:
      "Si vas a revender accesorios, el precio es lo último que deberías comparar. Estas son las preguntas que definen si un proveedor te sirve a largo plazo.",
    date: "2026-07-15",
    readTime: "4 min",
    category: "Mayoristas",
    coverLabel: "estudio — piezas en preparación",
    coverAngle: 108,
    coverTone: 2,
    coverImage: "/lookbook/estudio-detalle.webp",
    content: [
      "Comprar accesorios al por mayor en Colombia es fácil; encontrar un proveedor que te sostenga el negocio es otra cosa. Quien empieza a revender suele comparar precios primero, y es el criterio que menos predice cómo va a resultar la relación seis meses después.",
      "La primera pregunta es por la reposición. Un proveedor que te vende un lote hermoso pero no puede repetir las mismas referencias te deja con clientas que quieren “esa misma” y no la tienes. Antes de armar tu catálogo, confirma qué piezas son permanentes y cuáles son de temporada — sobre esas primeras es que se construye una marca.",
      "La segunda es por la consistencia del acabado. Si el primer pedido llega en un baño y el segundo en otro, tus clientas lo van a notar antes que tú. Pregunta explícitamente en qué está bañada cada pieza y si ese proceso es el mismo siempre. Un proveedor serio contesta esto sin ambigüedad.",
      "La tercera es qué pasa cuando algo sale mal. Una pieza con el cierre defectuoso o un lote con una falla puntual son cosas que ocurren en cualquier producción. Lo que distingue a un proveedor es si eso se resuelve o si te quedas con el problema y con la clienta molesta al frente. Vale la pena preguntarlo antes de necesitarlo.",
      "La cuarta, y la que más se olvida: qué tanto te va a competir. Hay proveedores que le venden al por mayor a cinco tiendas de la misma ciudad y también al detal con precios agresivos. Entender cómo maneja eso tu proveedor te evita descubrir tarde que compites contra quien te surte.",
      "En Estella trabajamos con revendedoras en varias ciudades del país y las condiciones dependen del volumen y de la mezcla de piezas, así que no hay una lista única de precios. Escríbenos por WhatsApp con qué tipo de piezas te interesan y armamos una propuesta concreta.",
    ],
  },
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
    coverImage: "/lookbook/medallon-detalle.webp",
    forAnyPiece: true,
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
    coverImage: "/lookbook/collares-capas.webp",
    forAnyPiece: true,
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

/**
 * Artículos para la ficha de un producto: primero los de su categoría y luego
 * los que sirven para cualquier pieza, hasta completar `limit`. Un artículo de
 * otra categoría nunca entra — la guía de tallas de anillos no pinta nada en
 * una manilla.
 */
export function postsForCategory(categorySlug: string, limit = 2): BlogPost[] {
  const own = posts.filter((post) => post.categorySlug === categorySlug);
  const general = posts.filter((post) => post.forAnyPiece);
  return [...own, ...general].slice(0, limit);
}
