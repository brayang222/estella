import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "Crear cuenta",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function RegistroPage({ searchParams }: Props) {
  const { callbackUrl } = await searchParams;
  const safeCallback =
    callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : undefined;

  return (
    <AuthShell
      title="Crear cuenta"
      intro="Guarda tus favoritos y tu bolsa, y pide por WhatsApp sin volver a escribir tus datos."
    >
      <RegisterForm callbackUrl={safeCallback} />
    </AuthShell>
  );
}
