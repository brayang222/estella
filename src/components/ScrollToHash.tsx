"use client";

import { useEffect } from "react";

/**
 * Lleva la vista a la sección cuando se entra con el ancla en la URL
 * (/producto/x#resenas, el enlace que se le manda a la clienta por WhatsApp).
 *
 * El navegador ya hace esto solo, pero aquí no alcanza: la ficha se renderiza
 * bajo demanda y se transmite por partes, así que cuando procesa el `#` la
 * sección de reseñas todavía no ha llegado al DOM y el salto se pierde. Al
 * correr después de la hidratación, el elemento ya existe. Medido: sin esto
 * la página se queda en scrollY 0.
 */
export function ScrollToHash({ id }: { id: string }) {
  useEffect(() => {
    if (window.location.hash !== `#${id}`) return;
    // "instant" y no el suave del CSS: la animación se cancela sola con lo que
    // termina de cargar en la ficha y el salto se quedaba a 5px del inicio.
    document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [id]);

  return null;
}
