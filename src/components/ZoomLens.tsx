"use client";

import { useEffect, useRef, useState } from "react";
import { imageUrl } from "@/lib/images";

/** Cuánto se amplía respecto al tamaño mostrado. */
const ZOOM = 2.6;
/** Ancho que se le pide al optimizador para la capa ampliada. */
const ZOOM_WIDTH = 1920;
/** Aire entre el panel y los bordes de la ventana o de la foto. */
const MARGEN = 16;

type Medidas = {
  /** Recuadro selector sobre la foto, en píxeles dentro de ella. */
  lente: { x: number; y: number; ancho: number; alto: number };
  /** Panel de detalle, en coordenadas de ventana. */
  panel: { left: number; top: number; ancho: number; alto: number };
  /** Desplazamiento y escala del fondo del panel. */
  fondo: { x: number; y: number; ancho: number };
};

/**
 * Lupa de ficha de producto, al estilo de Amazon: sobre la foto original
 * aparece un recuadro que marca la zona señalada, y el detalle ampliado se
 * muestra en un panel aparte a la derecha, sin tapar la foto.
 *
 * El panel se ajusta a lo que quepa en la ventana, no al tamaño de la foto.
 * Esa fue la primera versión y se salía por abajo: la foto mide 4:5, así que
 * con 620px de ancho pasa de 770 de alto y no cabe en una pantalla de
 * portátil. El recuadro se deriva del panel ya recortado —no al revés— para
 * que lo que encierra siga siendo exactamente lo que se ve ampliado.
 *
 * Va en `position: fixed` porque el contenedor de la foto tiene
 * `overflow-hidden` y cualquier posicionamiento absoluto quedaría recortado.
 * Y solo se activa con cursor real y ventana ancha: en táctil no existe el
 * "pasar por encima", y en pantallas estrechas el panel no cabe al lado.
 */
export function ZoomLens({ src, alt }: { src: string; alt: string }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [puedeAmpliar, setPuedeAmpliar] = useState(false);
  const [pedida, setPedida] = useState(false);
  const [medidas, setMedidas] = useState<Medidas | null>(null);

  useEffect(() => {
    // Una sola condición para el recuadro y el panel: mostrar el selector sin
    // su detalle deja un rectángulo sobre la foto que no explica nada.
    const consulta = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 1024px)"
    );
    const aplicar = () => setPuedeAmpliar(consulta.matches);
    aplicar();
    consulta.addEventListener("change", aplicar);
    return () => consulta.removeEventListener("change", aplicar);
  }, []);

  if (!puedeAmpliar) return null;

  const resuelta = imageUrl(src);
  if (!resuelta) return null;
  // q=75: desde Next 16 las calidades están restringidas por configuración y
  // solo esa viene permitida por defecto — cualquier otra devuelve 400.
  const ampliada = `/_next/image?url=${encodeURIComponent(resuelta)}&w=${ZOOM_WIDTH}&q=75`;

  function seguirCursor(evento: React.MouseEvent<HTMLDivElement>) {
    const foto = contenedor.current?.getBoundingClientRect();
    if (!foto) return;

    const limitar = (valor: number, min: number, max: number) =>
      Math.min(Math.max(valor, min), max);

    // 1. El panel cabe en el hueco que quede a la derecha y en el alto libre.
    const anchoPanel = Math.min(foto.width, window.innerWidth - foto.right - MARGEN * 2);
    const altoPanel = Math.min(foto.height, window.innerHeight - MARGEN * 2);
    if (anchoPanel < 160 || altoPanel < 160) {
      setMedidas(null);
      return;
    }

    // 2. El recuadro se deriva del panel: lo encerrado es lo que se ve.
    const anchoLente = anchoPanel / ZOOM;
    const altoLente = altoPanel / ZOOM;
    const x = limitar(evento.clientX - foto.left - anchoLente / 2, 0, foto.width - anchoLente);
    const y = limitar(evento.clientY - foto.top - altoLente / 2, 0, foto.height - altoLente);

    setMedidas({
      lente: { x, y, ancho: anchoLente, alto: altoLente },
      panel: {
        left: foto.right + MARGEN,
        // Se alinea con la foto, pero sin salirse de la ventana por arriba
        // ni por abajo.
        top: limitar(foto.top, MARGEN, window.innerHeight - altoPanel - MARGEN),
        ancho: anchoPanel,
        alto: altoPanel,
      },
      // El fondo se escala respecto a la FOTO, no al panel: así el aumento es
      // 2.6× real y el panel solo recorta cuánto se ve. Se calcula aquí y no
      // en el render porque leer el ref durante el render no es fiable.
      fondo: { x: x * ZOOM, y: y * ZOOM, ancho: foto.width * ZOOM },
    });
    setPedida(true);
  }

  return (
    <>
      <div
        ref={contenedor}
        onMouseLeave={() => setMedidas(null)}
        onMouseMove={seguirCursor}
        className="absolute inset-0 z-[2] cursor-crosshair"
        aria-hidden="true"
      >
        {medidas && (
          <span
            className="pointer-events-none absolute border border-ink/40 bg-paper/25"
            style={{
              left: medidas.lente.x,
              top: medidas.lente.y,
              width: medidas.lente.ancho,
              height: medidas.lente.alto,
            }}
          />
        )}
      </div>

      {medidas && (
        <div
          role="img"
          aria-label={`${alt} — detalle ampliado`}
          className="pointer-events-none fixed z-[60] border border-ink/12 bg-paper shadow-[0_20px_60px_-24px_rgba(20,18,15,.45)]"
          style={{
            left: medidas.panel.left,
            top: medidas.panel.top,
            width: medidas.panel.ancho,
            height: medidas.panel.alto,
            backgroundImage: pedida ? `url("${ampliada}")` : undefined,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${medidas.fondo.ancho}px auto`,
            backgroundPosition: `-${medidas.fondo.x}px -${medidas.fondo.y}px`,
          }}
        />
      )}
    </>
  );
}
