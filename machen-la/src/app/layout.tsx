import type { Metadata, Viewport } from "next";
import { Fraunces, Karla, JetBrains_Mono } from "next/font/google";
import { RESTAURANT, SITE_URL } from "@/data/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyBar } from "@/components/StickyBar";
import { JsonLd } from "@/components/JsonLd";
import { restaurantLd } from "@/lib/seo";
import "./globals.css";

/**
 * Fraunces and Karla are preloaded; JetBrains Mono is not.
 *
 * The rule was originally "preload the display face only", but measurement
 * moved it. Once Fraunces was slimmed down, the LCP element on the home page
 * stopped being the h1 and became the lede paragraph — which is Karla, above
 * the fold, and was arriving late enough that its swap-in repaint was setting
 * LCP. Preloading it took the page from 98 to 99, LCP 2.3s to 2.2s, TBT 70ms to
 * 40ms and CLS to a flat zero.
 *
 * Mono is genuinely below-the-fold-ish — prices, labels, the spice scale — and
 * stays unpreloaded so it does not compete for the first connection on a 4G
 * handset. All three are self-hosted by next/font; nothing is fetched from
 * Google at runtime.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  // `opsz` only, and that is a performance decision as much as a typographic
  // one. Driving the optical size axis is the point of choosing Fraunces —
  // display sizes get the high-contrast, tightly-spaced cut and smaller
  // headings get the sturdier one, out of a single file.
  //
  // SOFT and WONK were in this list at first, both pinned to 0 in globals.css,
  // i.e. to their own defaults — no visual effect whatsoever. They took the
  // woff2 from 67KB to 118KB, and because the face repaints the h1 when it
  // swaps in, that weight landed straight on LCP. Measured on the same
  // throttled-4G profile: 2.9s with the two dead axes, 2.3s without them.
  axes: ["opsz"],
  display: "swap",
  variable: "--font-fraunces",
  preload: true,
});

const karla = Karla({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-karla",
  preload: true,
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${RESTAURANT.name} — Tibetan Food in Majnu ka Tilla, Delhi`,
    template: `%s — ${RESTAURANT.name}`,
  },
  description:
    "Tibetan kitchen in Majnu ka Tilla, Delhi. Open 7:30 AM to 10 PM every day — momos, hot pot, ramen and coffee, from first thing in the morning.",
  applicationName: RESTAURANT.name,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#1A1614",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`${fraunces.variable} ${karla.variable} ${jetbrains.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-butter focus:px-4 focus:py-3 focus:font-mono focus:text-meta focus:uppercase focus:text-ink"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <StickyBar />
        <JsonLd data={restaurantLd()} />
      </body>
    </html>
  );
}
