// TODO: reemplazar por el número real de WhatsApp Business de Estella antes de publicar.
export const WHATSAPP_NUMBER = "573126177800";

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WA_GENERAL_MESSAGE =
  "Hola Estella, quiero ver las piezas disponibles.";

export function waProductMessage(name: string, price: string) {
  return `Hola Estella, me interesa la ${name} (${price}). ¿Está disponible?`;
}
