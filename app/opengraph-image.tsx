import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#1C1F27", position: "relative", fontFamily: "sans-serif" }}>
        <div
          style={{
            position: "absolute",
            right: 110,
            top: 90,
            width: 0,
            height: 0,
            borderLeft: "230px solid transparent",
            borderRight: "230px solid transparent",
            borderBottom: "340px solid #E8B4A2",
            opacity: 0.9,
          }}
        />
        <div style={{ position: "absolute", left: 80, bottom: 80, display: "flex", flexDirection: "column", color: "#F2EBE1" }}>
          <div style={{ fontSize: 26, letterSpacing: 6, color: "#A29A93" }}>RAVI ARNAN</div>
          <div style={{ fontSize: 64, fontWeight: 600, marginTop: 12 }}>Developer & Designer</div>
        </div>
      </div>
    ),
    size
  );
}
