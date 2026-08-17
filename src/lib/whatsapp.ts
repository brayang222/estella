import { normalizeWhatsappNumber } from "./settings";

/**
 * Enlace a WhatsApp con mensaje prellenado. El número ya no está escrito en
 * el código: viene de los ajustes del sitio (/admin/ajustes), así que hay que
 * pasarlo — `useSiteSettings()` en componentes de cliente, `getSiteSettings()`
 * en los de servidor.
 */
export function waLink(message: string, number: string) {
  return `https://wa.me/${normalizeWhatsappNumber(number)}?text=${encodeURIComponent(message)}`;
}

/**
 * Consulta por una pieza. Dos cosas que parecen detalle y no lo son:
 *
 * El precio se etiqueta "c/u" y se suma el total cuando hay más de una unidad.
 * Antes decía "3 unidades de la Collar Margarita ($22.900)", donde ese valor
 * es el unitario pero se lee como el total — una ambigüedad de precio justo al
 * abrir la conversación de venta.
 *
 * Y la pieza va en una línea propia, sin artículo: los nombres mezclan géneros
 * ("el Collar", "la Pulsera") y cualquier artículo fijo se equivoca en la mitad
 * del catálogo.
 */
export function waProductMessage(
  name: string,
  unitPrice: string,
  quantity = 1,
  total?: string
) {
  const detalle =
    quantity > 1
      ? `• ${quantity} × ${name} — ${unitPrice} c/u${total ? ` (total ${total})` : ""}`
      : `• ${name} — ${unitPrice}`;
  return `Hola Estella, me interesa esta pieza:\n${detalle}\n\n¿Está disponible?`;
}

export function waRestockMessage(name: string) {
  return `Hola Estella, la ${name} aparece agotada. ¿Saben cuándo vuelve a haber disponibilidad?`;
}

/**
 * Mensaje para pedirle la reseña a una clienta después de la entrega. Lleva el
 * enlace directo al formulario de cada pieza que compró — es la forma legítima
 * de conseguir reseñas reales (y con ellas las estrellas en Google): pedírselas
 * a quien sí compró, no inventarlas.
 */
export function waReviewMessage(
  customerName: string | null | undefined,
  items: { name: string }[],
  url: string
) {
  const greeting = customerName ? `Hola ${customerName}` : "Hola";
  const list = items.map((item) => `• ${item.name}`).join("\n");
  return `${greeting}, ¡gracias por tu compra en Estella! ✨\n\n¿Nos cuentas cómo te fue?\n\n${list}\n\nAquí puedes calificarlas todas de una vez:\n${url}\n\nToma menos de un minuto y nos ayuda muchísimo a seguir creciendo.`;
}

/** Enlace a /calificar con las piezas del pedido ya marcadas. */
export function reviewPageUrl(siteUrl: string, slugs: string[]) {
  return `${siteUrl}/calificar?piezas=${encodeURIComponent(slugs.join(","))}`;
}

export function waFavoritesMessage(items: { name: string; price: string }[]) {
  const list = items.map((item) => `- ${item.name} (${item.price})`).join("\n");
  return `Hola Estella, me interesan estas piezas:\n${list}\n¿Me confirmas disponibilidad?`;
}

/**
 * Pedido completo desde la bolsa. Incluye referencia y cantidad de cada pieza
 * para que el pedido llegue listo a confirmar por WhatsApp.
 */
export function waCartMessage(
  items: { name: string; reference: string; price: string; quantity: number }[],
  total: string,
  customerName?: string | null,
  city?: string | null
) {
  const list = items
    .map((item) => `- ${item.quantity} × ${item.name} (ref. ${item.reference}) — ${item.price}`)
    .join("\n");
  // Se quita el punto final del nombre: mucha gente escribe su apellido
  // abreviado ("Valentina R.") y quedaba "soy Valentina R..".
  const nombre = customerName?.trim().replace(/\.+$/, "");
  const greeting = nombre ? `Hola Estella, soy ${nombre}.` : "Hola Estella.";
  // La ciudad va en el mensaje para que la primera respuesta ya pueda traer el
  // costo del envío, que depende del destino. Sin ella hacen falta dos o tres
  // mensajes más antes de poder cotizar.
  const destino = city ? `\nEnvío a: ${city}` : "";
  const cierre = city
    ? "¿Me confirmas disponibilidad y el costo del envío?"
    : "¿Me confirmas disponibilidad y envío?";
  return `${greeting} Quiero hacer este pedido:\n${list}\n\nTotal: ${total}${destino}\n${cierre}`;
}
