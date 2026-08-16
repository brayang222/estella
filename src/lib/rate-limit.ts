import "server-only";
import { headers } from "next/headers";

/**
 * Freno por IP para los formularios públicos que escriben en la base
 * (reseñas y registro). Una persona real nunca lo toca; un script que
 * martille el endpoint queda limitado.
 *
 * ponytail: el contador vive en memoria del proceso. En serverless cada
 * instancia tiene la suya, así que esto frena floods ingenuos, no un ataque
 * decidido y distribuido. Es la defensa proporcional al tamaño de la tienda —
 * el siguiente paso, si algún día hace falta, es un contador compartido
 * (Upstash/Redis) y este archivo es el único punto que cambiaría.
 */
type Registro = { conteo: number; expira: number };

const contadores = new Map<string, Registro>();

/** Se limpia al vuelo para que el Map no crezca sin fin. */
function limpiarVencidos(ahora: number) {
  for (const [clave, registro] of contadores) {
    if (registro.expira <= ahora) contadores.delete(clave);
  }
}

async function ipDelVisitante(): Promise<string> {
  const h = await headers();
  // Vercel siempre pone x-forwarded-for; el primer valor es el cliente real.
  const reenviada = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return reenviada || h.get("x-real-ip") || "desconocida";
}

/**
 * Devuelve true si la petición supera el cupo. `limite` intentos por
 * `ventanaMs` y por IP, con `alcance` para no mezclar formularios distintos.
 */
export async function superaElCupo(
  alcance: string,
  { limite, ventanaMs }: { limite: number; ventanaMs: number }
): Promise<boolean> {
  const ahora = Date.now();
  if (contadores.size > 500) limpiarVencidos(ahora);

  const clave = `${alcance}:${await ipDelVisitante()}`;
  const registro = contadores.get(clave);

  if (!registro || registro.expira <= ahora) {
    contadores.set(clave, { conteo: 1, expira: ahora + ventanaMs });
    return false;
  }

  registro.conteo += 1;
  return registro.conteo > limite;
}
