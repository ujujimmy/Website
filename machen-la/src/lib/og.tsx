import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Shared social card.
 *
 * Deliberately type-only on the ink ground with the maroon frame — the same
 * decision the hero makes, and for the same reason: the available photography
 * is compressed 1080px social output, and a 1200×630 crop of it would look
 * worse in a WhatsApp preview than clean type does.
 *
 * Set in the runtime's built-in face rather than Fraunces. Pulling the display
 * font in here would mean a network fetch during the build, which is a fragile
 * dependency for a card that is 1200 pixels wide and read in half a second.
 */
export function ogImage({ kicker, title }: { kicker: string; title: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1A1614",
          padding: 72,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 36,
            right: 36,
            bottom: 36,
            border: "2px solid #9E3A3E",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 30,
              letterSpacing: 8,
              color: "#EDE6D8",
              fontWeight: 700,
            }}
          >
            MACHEN LA
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 20,
              letterSpacing: 6,
              color: "#A89F92",
            }}
          >
            TIBET KITCHEN
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#E8A33D" }}>
            {kicker.toUpperCase()}
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 62,
              lineHeight: 1.1,
              color: "#EDE6D8",
              fontWeight: 700,
              maxWidth: 900,
            }}
          >
            {title}
          </div>
          <div style={{ marginTop: 28, fontSize: 24, color: "#A89F92" }}>
            07:30 – 22:00, every day · Majnu-ka-Tilla, Delhi
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
