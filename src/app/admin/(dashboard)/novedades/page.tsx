import { prisma } from "@/lib/db";
import { waLink } from "@/lib/whatsapp";
import { getSiteSettings } from "@/lib/queries";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export const metadata = { title: "Lista de novedades" };

const dateFormat = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/** Nombre legible del punto del sitio donde se suscribió. */
const ORIGENES: Record<string, string> = {
  portada: "Portada",
  "bolsa-vacia": "Bolsa vacía",
  "favoritos-vacios": "Favoritos vacíos",
};

export default async function NovedadesPage() {
  const [suscritas, settings] = await Promise.all([
    prisma.newsletterSignup.findMany({ orderBy: { createdAt: "desc" } }),
    getSiteSettings(),
  ]);

  // Sirve para saber qué punto del sitio capta y reforzar ese, no adivinar.
  const porOrigen = suscritas.reduce<Record<string, number>>((acc, s) => {
    acc[s.source] = (acc[s.source] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid max-w-[720px] gap-6">
      <div className="grid gap-1">
        <h1 className="m-0 font-display text-[26px]">Lista de novedades</h1>
        <p className="m-0 text-[12px] text-muted">
          Visitantes que dejaron su WhatsApp para enterarse de piezas nuevas. Escríbeles cuando
          entre una serie — no es una lista de spam.
        </p>
      </div>

      {suscritas.length === 0 ? (
        <p className="m-0 text-[13px] text-muted">
          Todavía nadie se ha suscrito. El formulario aparece al final de la portada, en la bolsa
          vacía y en favoritos vacíos.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 border border-ink/12 p-4 text-[12px]">
            <span>
              <strong className="font-display text-[20px] font-normal">{suscritas.length}</strong>{" "}
              en total
            </span>
            {Object.entries(porOrigen).map(([origen, n]) => (
              <span key={origen} className="text-muted">
                {ORIGENES[origen] ?? origen}: {n}
              </span>
            ))}
          </div>

          <div className="grid gap-px overflow-hidden border border-ink/12 bg-ink/12">
            {suscritas.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 bg-paper px-4 py-3"
              >
                <div className="grid gap-1">
                  <span className="text-[13px]">{s.name ?? "Sin nombre"}</span>
                  <span className="text-[11px] text-muted">
                    +{s.phone} · {ORIGENES[s.source] ?? s.source} ·{" "}
                    {dateFormat.format(s.createdAt)}
                  </span>
                </div>
                <a
                  href={waLink(settings.whatsappGreeting, s.phone)}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2 border border-ink/20 px-4 py-2 text-[10px] tracking-[0.15em] uppercase transition-colors duration-300 ease-out hover:border-ink"
                >
                  <WhatsAppIcon className="size-3.5" />
                  Escribir
                </a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
