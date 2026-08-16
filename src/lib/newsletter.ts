"use server";

import { prisma } from "@/lib/db";
import { normalizeWhatsappNumber } from "@/lib/settings";
import { superaElCupo } from "@/lib/rate-limit";

export type NewsletterState = { error?: string; ok?: boolean };

/** Público y escribe en la base: mismo criterio que reseñas y registro. */
const CUPO = { limite: 5, ventanaMs: 15 * 60 * 1000 };

/**
 * Suscribe un WhatsApp a la lista de novedades. Un solo campo obligatorio, sin
 * cuenta ni contraseña: para dejar un contacto, pedir nombre, correo y dos
 * veces la contraseña es fricción que cuesta la mayoría de los registros.
 *
 * Si el número ya estaba, se responde igual que si fuera nuevo — decirle a un
 * desconocido "ese número ya está suscrito" filtra quién está en la lista.
 */
export async function subscribeToNewsletter(
  _prevState: NewsletterState | undefined,
  formData: FormData
): Promise<NewsletterState> {
  if (await superaElCupo("novedades", CUPO)) {
    return { error: "Demasiados intentos seguidos. Espera unos minutos." };
  }

  const phone = normalizeWhatsappNumber(String(formData.get("phone") ?? ""));
  const name = String(formData.get("name") ?? "").trim();
  const source = String(formData.get("source") ?? "desconocido").slice(0, 40);

  // 10 dígitos es un celular colombiano sin indicativo; 15 es el máximo del
  // estándar internacional.
  if (phone.length < 10 || phone.length > 15) {
    return { error: "Escribe tu número de WhatsApp con indicativo (ej. 57 300 000 0000)." };
  }
  if (name.length > 80) return { error: "El nombre es demasiado largo." };

  await prisma.newsletterSignup.upsert({
    where: { phone },
    update: {},
    create: { phone, name: name || null, source },
  });

  return { ok: true };
}
