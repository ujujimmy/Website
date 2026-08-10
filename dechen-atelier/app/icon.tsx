import { ImageResponse } from "next/og";

/**
 * Generated once at build time. `output: "export"` has no server to render
 * images on demand, so this must be explicitly static.
 */
export const dynamic = "force-static";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Ink on paper: the salon's initial, legible at 16px. */
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
          background: "#16120f",
          color: "#f3eee7",
          fontFamily: "serif",
          fontSize: 24,
        }}
      >
        D
      </div>
    ),
    size,
  );
}
