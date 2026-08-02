import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/queries";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="m-0 font-display text-[26px]">Ajustes del sitio</h1>
        <p className="m-0 max-w-[62ch] text-[13px] leading-[1.7] text-muted">
          Lo que cambies aquí se aplica de inmediato en toda la tienda: botones de WhatsApp,
          redes y textos fijos.
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
