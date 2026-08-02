import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Estella — Accesorios hechos a mano en Colombia";

/** El destello de cuatro puntas del monograma (public/logo/estella-monograma.svg). */
function Sparkle() {
  return (
    <svg width={40} height={40} viewBox="0 0 64 64" style={{ display: "flex" }}>
      <path
        fill="#9A7B45"
        d="M50.389830508474574 6.5 L54.569830508474574 13.32 L61.389830508474574 17.5 L54.569830508474574 21.68 L50.389830508474574 28.5 L46.209830508474575 21.68 L39.389830508474574 17.5 L46.209830508474575 13.32 Z"
      />
    </svg>
  );
}

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#14120F",
          color: "#F6F4F0",
        }}
      >
        <Sparkle />
        <div
          style={{ display: "flex", fontSize: 100, letterSpacing: "26px", paddingLeft: "26px", marginTop: 18 }}
        >
          ESTELLA
        </div>
        <div
          style={{
            display: "flex",
            width: 120,
            height: 1,
            background: "#9A7B45",
            marginTop: 36,
            marginBottom: 36,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: "6px",
            color: "#9A7B45",
            textTransform: "uppercase",
          }}
        >
          Accesorios hechos a mano en Colombia
        </div>
      </div>
    ),
    { ...size }
  );
}
