import { ImageResponse } from "next/og";
import { brand } from "@/content/brand";

/**
 * Generated once at build time. `output: "export"` has no server to render
 * images on demand, so this must be explicitly static.
 */
export const dynamic = "force-static";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${brand.name} — ${brand.tagline}`;

/**
 * The share card: the site's own front page, at postcard size.
 *
 * Drawn rather than photographed, so it stays on-brand whatever the page and
 * never ships a 200KB image to a crawler. The rules and the single lacquer mark
 * are the same three elements the site is built from.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3eee7",
          padding: "64px 72px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#16120f",
              fontFamily: "sans-serif",
            }}
          >
            {`${brand.shortName}   ·   Salon`}
          </div>
          <div
            style={{
              fontSize: 20,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#7e2a1e",
              fontFamily: "sans-serif",
            }}
          >
            Majnu-ka-Tilla, New Delhi
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 150,
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              color: "#16120f",
            }}
          >
            Hair as
          </div>
          <div
            style={{
              fontSize: 150,
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              color: "#16120f",
            }}
          >
            identity.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #d4cabb",
            paddingTop: 26,
          }}
        >
          <div
            style={{
              fontSize: 26,
              color: "#6b6158",
              fontFamily: "sans-serif",
              maxWidth: 720,
              lineHeight: 1.35,
            }}
          >
            A women-led, Tibetan-owned salon. Colour, extensions and bond repair.
          </div>
          <div style={{ fontSize: 34, fontStyle: "italic", color: "#7e2a1e" }}>
            {brand.tagline}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
