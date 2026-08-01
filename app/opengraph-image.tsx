import { ImageResponse } from "next/og";
import { brand } from "@/content/brand";

export const alt = `${brand.name} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated OG card. Uses only system-available fonts and inline styles so it
 * renders at the edge with no asset fetches — the whole point of next/og here
 * is not needing a design tool in the loop when copy changes.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#06070c",
          padding: 72,
          backgroundImage:
            "radial-gradient(circle at 78% 18%, rgba(109,92,246,0.42) 0%, transparent 55%), radial-gradient(circle at 12% 92%, rgba(34,211,238,0.28) 0%, transparent 50%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "linear-gradient(135deg, #6d5cf6, #22d3ee)",
            }}
          />
          <div style={{ color: "#eceef5", fontSize: 30, fontWeight: 600 }}>
            {brand.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              color: "#eceef5",
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -2,
              maxWidth: 940,
            }}
          >
            Get chosen before they ever call you.
          </div>
          <div style={{ color: "#979eb5", fontSize: 30, maxWidth: 860 }}>
            Google Reviews · Websites · SEO for local businesses
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#6b7288",
            fontSize: 24,
          }}
        >
          {/*
            Drawn as shapes rather than the ★ character: satori has to fetch a
            font that covers the glyph, and that download fails at build time.
          */}
          <div style={{ display: "flex", gap: 7 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: 16,
                  height: 16,
                  background: "#ffc24b",
                  transform: "rotate(45deg)",
                  borderRadius: 3,
                }}
              />
            ))}
          </div>
          <div>{brand.domain}</div>
        </div>
      </div>
    ),
    size,
  );
}
