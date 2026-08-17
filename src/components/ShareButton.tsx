"use client";

import { useState } from "react";

/**
 * Compartir una pieza. Usa la hoja nativa del sistema cuando existe —en móvil,
 * que es de donde viene casi todo el tráfico, ofrece WhatsApp de primeras— y
 * cae a copiar el enlace en escritorio.
 *
 * Importa para esta tienda porque buena parte de las piezas se compran de
 * regalo: enseñarle una a alguien antes de pedirla es parte del proceso, y
 * hasta ahora exigía copiar la URL de la barra a mano.
 */
/** Copia por selección de texto, para navegadores sin Clipboard API usable. */
function copiarConSeleccion(texto: string): boolean {
  const campo = document.createElement("textarea");
  campo.value = texto;
  campo.style.position = "fixed";
  campo.style.opacity = "0";
  document.body.appendChild(campo);
  campo.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(campo);
  }
}

export function ShareButton({ name, className }: { name: string; className?: string }) {
  const [estado, setEstado] = useState<"listo" | "copiado" | "error">("listo");

  async function compartir() {
    const url = window.location.href;
    const datos = { title: `${name} · Estella`, text: `Mira esta pieza de Estella: ${name}`, url };

    if (navigator.share) {
      try {
        await navigator.share(datos);
        return;
      } catch {
        // Cancelar la hoja nativa lanza también: no es un fallo, se sigue de largo.
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setEstado("copiado");
    } catch {
      // La Clipboard API rechaza en Safari viejo, contexto no seguro o sin
      // activación del usuario. Mismo respaldo que usa "Copiar referencia" en
      // ProductOrderPanel, para no dejar el botón muerto en esos casos.
      setEstado(copiarConSeleccion(url) ? "copiado" : "error");
    }
    setTimeout(() => setEstado("listo"), 2200);
  }

  return (
    <button type="button" onClick={compartir} className={className} aria-live="polite">
      {estado === "copiado" ? "Enlace copiado" : estado === "error" ? "Copia el enlace" : "Compartir"}
    </button>
  );
}
