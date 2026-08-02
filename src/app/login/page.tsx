import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  robots: { index: false, follow: false },
};

/** Auth.js error codes that reach us as ?error= on the login page. */
const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "Ese correo ya tiene una cuenta con contraseña. Entra con tu correo y contraseña.",
  AccessDenied: "No pudimos completar el acceso. Intenta de nuevo.",
  Configuration: "Hay un problema de configuración del acceso. Escríbenos por WhatsApp.",
};

type Props = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { callbackUrl, error } = await searchParams;
  // Only same-origin paths: a ?callbackUrl pointing off-site would turn the
  // login screen into an open redirect.
  const safeCallback =
    callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : undefined;

  return (
    <AuthShell
      title="Iniciar sesión"
      intro="Entra con Google o con tu correo y guarda tus favoritos y tu bolsa en cualquier dispositivo."
    >
      <LoginForm
        callbackUrl={safeCallback}
        initialError={error ? (ERROR_MESSAGES[error] ?? "No pudimos iniciar sesión.") : undefined}
      />
    </AuthShell>
  );
}
