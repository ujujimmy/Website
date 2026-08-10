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
 * The share card. Drawn rather than photographed, so it stays on-brand whatever
 * the page and never ships a 200KB image to a crawler.
 */
export default function OpengraphImage() {
  // A fan of strands down the right side, echoing the site's own animation.
  const strands = Array.from({ length: 16 }, (_, i) => {
    const u = i / 15;
    const x = 760 + u * 420;
    const bow = 30 + Math.sin(u * Math.PI) * 90;
    return {
      d: `M ${x} -40 Q ${x + bow} 320 ${x + bow * 0.3} 680`,
      width: 2 + Math.sin(u * Math.PI) * 5,
      opacity: 0.25 + Math.sin(u * Math.PI) * 0.45,
    };
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #fdf2f8 0%, #fbe3f1 55%, #f5bfd8 100%)",
          fontFamily: "serif",
        }}
      >
        <svg width={1200} height={630} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="og-strand" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#3a2430" />
              <stop offset="60%" stopColor="#8c4a63" />
              <stop offset="100%" stopColor="#d8a63c" />
            </linearGradient>
          </defs>
          {strands.map((strand, i) => (
            <path
              key={i}
              d={strand.d}
              fill="none"
              stroke="url(#og-strand)"
              strokeWidth={strand.width}
              strokeLinecap="round"
              opacity={strand.opacity}
            />
          ))}
        </svg>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 80px",
            width: 760,
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#9a6e06",
              fontFamily: "sans-serif",
            }}
          >
            Majnu-ka-Tilla · New Delhi
          </div>
          <div style={{ fontSize: 96, color: "#2b2f44", marginTop: 22, lineHeight: 1 }}>
            DECHEN Salon
          </div>
          <div style={{ fontSize: 40, color: "#c08a0b", marginTop: 20, fontStyle: "italic" }}>
            {brand.tagline}
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#5a5f78",
              marginTop: 28,
              fontFamily: "sans-serif",
              lineHeight: 1.4,
            }}
          >
            A women-led, Tibetan-owned salon. Colour, extensions and repair.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
