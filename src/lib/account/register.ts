"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { prisma } from "@/lib/db";

export type RegisterFormState = { error?: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+()\s-]{7,20}$/;
const MIN_PASSWORD = 8;
const BCRYPT_ROUNDS = 10;

/** Only same-origin paths — never let a form field steer the redirect off-site. */
function safeCallback(value: FormDataEntryValue | null) {
  const raw = typeof value === "string" ? value : "";
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/cuenta";
}

export async function registerCustomer(
  _prevState: RegisterFormState | undefined,
  formData: FormData
): Promise<RegisterFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const callbackUrl = safeCallback(formData.get("callbackUrl"));

  if (name.length < 2) return { error: "Escribe tu nombre (mínimo 2 caracteres)." };
  if (name.length > 80) return { error: "El nombre es demasiado largo." };
  if (!EMAIL_PATTERN.test(email)) return { error: "Escribe un correo válido." };
  if (phone && !PHONE_PATTERN.test(phone)) {
    return { error: "El teléfono solo puede tener números, espacios y + ( ) -." };
  }
  if (password.length < MIN_PASSWORD) {
    return { error: `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.` };
  }
  if (password !== confirm) return { error: "Las contraseñas no coinciden." };

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { passwordHash: true },
  });
  if (existing) {
    return {
      error: existing.passwordHash
        ? "Ya existe una cuenta con este correo. Inicia sesión."
        : "Este correo ya tiene una cuenta creada con Google. Entra con el botón de Google.",
    };
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  try {
    await prisma.user.create({
      data: { name, email, phone: phone || null, passwordHash },
    });
  } catch (error) {
    // Two signups for the same address at once: the unique index wins.
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return { error: "Ya existe una cuenta con este correo. Inicia sesión." };
    }
    throw error;
  }

  try {
    // Throws a NEXT_REDIRECT on success — deliberately not caught below.
    await signIn("credentials", { email, password, redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Tu cuenta quedó creada, pero no pudimos entrar. Inicia sesión." };
    }
    throw error;
  }

  return {};
}
