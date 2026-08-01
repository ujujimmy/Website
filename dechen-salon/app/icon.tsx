import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** A gold D on blush — the salon's initial, legible at 16px. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbe3f1",
          color: "#9a6e06",
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "-0.02em",
        }}
      >
        D
      </div>
    ),
    size,
  );
}
