import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon. Latin letterform on the ink ground with the maroon frame — the same
 * two decisions the rest of the site makes, at 32 pixels.
 *
 * Generated rather than shipped as a file so it stays in step with the palette,
 * and so /favicon.ico stops 404-ing (which an audit flagged as a console error).
 */
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
          background: "#1A1614",
          border: "2px solid #9E3A3E",
          color: "#E8A33D",
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        M
      </div>
    ),
    size,
  );
}
