import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Estella — Joyería en series numeradas, hecha a mano en Colombia";

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
        <div style={{ display: "flex", fontSize: 100, letterSpacing: "26px", paddingLeft: "26px" }}>
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
          Series numeradas · Colombia
        </div>
      </div>
    ),
    { ...size }
  );
}
