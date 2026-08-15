import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon — the climbing-stars mark.
 *
 * Three stars, not five. This is the identity sheet's own rule and it is
 * right: at 16px five stars turn to porridge, and the shape that has to
 * survive is the climb, not the count. Dropping the two smallest keeps the
 * diagonal legible while the tab is a thumbnail.
 *
 * Drawn as polygons rather than text so there is no font to load and no
 * hinting to fight at this size. Gold Light (#FFC24D) on Ink (#0B1220), per
 * the sheet's dark favicon.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0B1220",
          borderRadius: 7,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 96 96">
          <polygon
            points="26.00,68.40 28.02,74.22 34.18,74.34 29.27,78.06 31.05,83.96 26.00,80.44 20.95,83.96 22.73,78.06 17.82,74.34 23.98,74.22"
            fill="#FFC24D"
          />
          <polygon
            points="49.00,40.50 51.80,48.55 60.32,48.72 53.53,53.87 55.99,62.03 49.00,57.16 42.01,62.03 44.47,53.87 37.68,48.72 46.20,48.55"
            fill="#FFC24D"
          />
          <polygon
            points="71.00,9.80 74.67,20.35 85.84,20.58 76.93,27.33 80.17,38.02 71.00,31.64 61.83,38.02 65.07,27.33 56.16,20.58 67.33,20.35"
            fill="#FFC24D"
          />
        </svg>
      </div>
    ),
    size,
  );
}
