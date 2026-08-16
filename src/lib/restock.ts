"use server";

import { prisma } from "@/lib/db";
import { getCustomer } from "./account/session";

/** Una misma clienta no vuelve a contar en 24 h. */
const USER_WINDOW_MS = 24 * 60 * 60 * 1000;
/**
 * Freno para los clics anónimos, donde no hay a quién deduplicar. Una persona
 * real nunca choca con esto; un script que martille el endpoint queda limitado
 * a una fila por pieza por minuto. Se pierde poca señal: que dos visitantes
 * distintos pidan la misma pieza en el mismo minuto es raro a esta escala.
 */
const ANON_WINDOW_MS = 60 * 1000;

/**
 * Se llama al hacer clic en "Avisarme cuando vuelva" — no bloquea el enlace a
 * WhatsApp. Es un endpoint público que escribe, así que además de validar el
 * slug limita cuántas filas puede generar.
 *
 * ponytail: la ventana anónima es un freno, no una defensa. Si algún día
 * hiciera falta parar un ataque real, el siguiente paso es limitar por IP.
 */
export async function recordRestockRequest(slug: unknown) {
  if (typeof slug !== "string") return;

  const [product, customer] = await Promise.all([
    // published: la pieza tiene que existir para el visitante. Sin este
    // filtro se podían registrar solicitudes sobre borradores.
    prisma.product.findFirst({ where: { slug, published: true }, select: { id: true } }),
    getCustomer(),
  ]);
  if (!product) return;

  const since = new Date(Date.now() - (customer ? USER_WINDOW_MS : ANON_WINDOW_MS));
  const reciente = await prisma.restockRequest.findFirst({
    where: {
      productId: product.id,
      userId: customer?.id ?? null,
      createdAt: { gte: since },
    },
    select: { id: true },
  });
  if (reciente) return;

  await prisma.restockRequest.create({
    data: { productId: product.id, userId: customer?.id },
  });
}
