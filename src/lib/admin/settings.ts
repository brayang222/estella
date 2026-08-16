"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { DEFAULT_SITE_SETTINGS, normalizeWhatsappNumber } from "@/lib/settings";
import { requireAdmin } from "./auth";

export type SettingsFormState = { error?: string; ok?: boolean };

/** Vacío, o una URL http(s) bien formada. */
function readUrl(value: FormDataEntryValue | null): string | null | undefined {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export async function updateSiteSettings(
  _prevState: SettingsFormState | undefined,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin();

  const whatsappNumber = normalizeWhatsappNumber(String(formData.get("whatsappNumber") ?? ""));
  const whatsappGreeting = String(formData.get("whatsappGreeting") ?? "").trim();
  const marqueeItems = String(formData.get("marqueeItems") ?? "").trim();
  const productNote = String(formData.get("productNote") ?? "").trim();
  const instagramUrl = readUrl(formData.get("instagramUrl"));
  const tiktokUrl = readUrl(formData.get("tiktokUrl"));
  const freeShippingRaw = String(formData.get("freeShippingFrom") ?? "").replace(/\D/g, "");
  const freeShippingFrom = Number(freeShippingRaw);

  // Indicativo + número: 10 dígitos ya es un celular local sin indicativo, y
  // 15 es el máximo que admite el estándar internacional.
  if (whatsappNumber.length < 10 || whatsappNumber.length > 15) {
    return { error: "El número de WhatsApp debe tener entre 10 y 15 dígitos, con indicativo (ej. 57 para Colombia)." };
  }
  if (whatsappGreeting.length < 5) {
    return { error: "Escribe el mensaje con el que se abre WhatsApp." };
  }
  if (instagramUrl === undefined) return { error: "El enlace de Instagram no es una URL válida." };
  if (tiktokUrl === undefined) return { error: "El enlace de TikTok no es una URL válida." };
  if (!marqueeItems) return { error: "Escribe al menos una frase para el letrero." };
  if (!productNote) return { error: "Escribe la nota que aparece en cada ficha." };
  // 0 vale: significa envío gratis siempre.
  if (!Number.isInteger(freeShippingFrom) || freeShippingFrom < 0) {
    return { error: "El umbral de envío gratis debe ser un número de 0 en adelante." };
  }

  const data = {
    whatsappNumber,
    whatsappGreeting,
    instagramUrl,
    tiktokUrl,
    marqueeItems,
    productNote,
    freeShippingFrom,
  };

  await prisma.siteSetting.upsert({
    where: { id: "default" },
    create: { id: "default", ...DEFAULT_SITE_SETTINGS, ...data },
    update: data,
  });

  // Los ajustes salen en el chrome de todas las páginas (navbar, footer,
  // botón flotante), así que se regenera el árbol completo.
  revalidatePath("/", "layout");
  return { ok: true };
}
