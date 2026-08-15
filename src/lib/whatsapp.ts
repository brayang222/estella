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

export function waProductMessage(name: string, price: string, quantity = 1) {
  const piece = quantity > 1 ? `${quantity} unidades de la ${name}` : `la ${name}`;
  return `Hola Estella, me interesa ${piece} (${price}). ¿Está disponible?`;
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
  items: { name: string; url: string }[]
) {
  const greeting = customerName ? `Hola ${customerName}` : "Hola";
  const list = items.map((item) => `• ${item.name}\n${item.url}`).join("\n\n");
  return `${greeting}, ¡gracias por tu compra en Estella! ✨\n\n¿Nos cuentas cómo te fue? Puedes dejar tu reseña aquí:\n\n${list}\n\nToma menos de un minuto y nos ayuda muchísimo a seguir creciendo.`;
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
  customerName?: string | null
) {
  const list = items
    .map((item) => `- ${item.quantity} × ${item.name} (ref. ${item.reference}) — ${item.price}`)
    .join("\n");
  const greeting = customerName ? `Hola Estella, soy ${customerName}.` : "Hola Estella.";
  return `${greeting} Quiero hacer este pedido:\n${list}\n\nTotal: ${total}\n¿Me confirmas disponibilidad y envío?`;
}
