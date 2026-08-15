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
        {/*
          The climbing-stars mark, at the size the identity sheet allows the
          full five. Rendered as an inline SVG because satori would otherwise
          need to fetch a font covering ★, and that download fails at build.
        */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="112" height="58" viewBox="0 0 100 52">
            {[
              ["5.13,40.91 6.40,44.56 10.27,44.64 7.18,46.98 8.30,50.68 5.13,48.47 1.96,50.68 3.08,46.98 -0.01,44.64 3.86,44.56", 0.45],
              ["20.41,31.34 22.04,36.00 26.98,36.10 23.04,39.09 24.47,43.82 20.41,40.99 16.36,43.82 17.79,39.09 13.85,36.10 18.79,36.00", 0.59],
              ["38.74,21.47 40.76,27.29 46.92,27.41 42.01,31.13 43.79,37.03 38.74,33.51 33.69,37.03 35.47,31.13 30.56,27.41 36.72,27.29", 0.73],
              ["60.67,11.03 63.19,18.26 70.85,18.42 64.75,23.05 66.96,30.38 60.67,26.01 54.39,30.38 56.60,23.05 50.50,18.42 58.16,18.26", 0.86],
              ["86.98,0.00 90.08,8.93 99.53,9.12 92.00,14.83 94.74,23.88 86.98,18.48 79.22,23.88 81.96,14.83 74.43,9.12 83.88,8.93", 1],
            ].map(([points, opacity]) => (
              <polygon
                key={points as string}
                points={points as string}
                fill="#FFC24D"
                opacity={opacity as number}
              />
            ))}
          </svg>
          <div style={{ color: "#eceef5", fontSize: 30, fontWeight: 700 }}>
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
            The five rotated squares that used to sit here were a stand-in for
            stars from before there was a real mark. With the logo at the top
            of the card they read as a second, worse version of it. The domain
            alone is enough of a footer.
          */}
          <div>{brand.domain}</div>
        </div>
      </div>
    ),
    size,
  );
}
