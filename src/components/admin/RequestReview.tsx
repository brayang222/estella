import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { SITE_URL } from "@/lib/site";
import { reviewPageUrl, waLink, waReviewMessage } from "@/lib/whatsapp";

/**
 * Botón para pedirle la reseña a la clienta por WhatsApp una vez entregado el
 * pedido. Abre el chat con el mensaje y los enlaces ya escritos — el admin
 * solo revisa y envía. Las reseñas llegan como pendientes y se aprueban en
 * /admin/resenas, así que nada se publica sin revisión.
 */
export function RequestReview({
  customerName,
  phone,
  items,
}: {
  customerName: string | null;
  phone: string | null;
  items: { name: string; slug: string }[];
}) {
  return (
    <div className="grid gap-2 border border-ink/12 p-5">
      <span className="text-[10px] tracking-[0.15em] text-muted uppercase">Después de entregar</span>

      {items.length === 0 ? (
        <p className="m-0 text-[12px] text-muted">
          Ninguna pieza de este pedido sigue en el catálogo, así que no hay ficha donde dejar la
          reseña.
        </p>
      ) : !phone ? (
        <p className="m-0 text-[12px] text-muted">
          Esta clienta no tiene WhatsApp guardado. Agrégalo en su cuenta para poder pedirle la
          reseña desde aquí.
        </p>
      ) : (
        <>
          <a
            href={waLink(
              waReviewMessage(
                customerName,
                items,
                reviewPageUrl(SITE_URL, items.map((item) => item.slug))
              ),
              phone
            )}
            target="_blank"
            rel="noopener"
            className="flex w-fit items-center gap-2.5 bg-ink px-5 py-2.5 text-[11px] tracking-[0.15em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold"
          >
            <WhatsAppIcon className="size-4" />
            Pedir reseña
          </a>
          <p className="m-0 text-[12px] text-muted">
            Abre el chat con el mensaje listo y un enlace que ya trae marcadas las piezas de
            este pedido. Las reseñas llegan pendientes de aprobación.
          </p>
        </>
      )}
    </div>
  );
}
