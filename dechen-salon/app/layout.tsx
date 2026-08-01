import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import { brand } from "@/content/brand";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { RevealRoot } from "@/components/providers/RevealRoot";
import { JsonLd } from "@/components/JsonLd";
import { salonLd } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Fraunces for display. It has the warmth of an old serif without the stiffness,
 * which is the register the salon's own catalog is written in.
 *
 * Regular only, upright and italic — the two faces the design actually uses.
 * Asking for 400/500/600 across both styles pulled six files and 129KB of font,
 * and because the headline is the largest-contentful-paint element, the late
 * swap moved LCP from 1.1s to over 7s on throttled mobile.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s — ${brand.name}`,
  },
  description: brand.description,
  applicationName: brand.name,
  keywords: [
    "hair salon Majnu ka Tilla",
    "hair extensions Delhi",
    "balayage Delhi",
    "Tibetan salon Delhi",
    "Olaplex Delhi",
    "hair colour New Aruna Nagar",
  ],
  openGraph: {
    type: "website",
    siteName: brand.name,
    locale: "en_IN",
    url: brand.url,
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#fbe3f1",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // `no-js` is removed before first paint by the script below. If scripts are
    // blocked it survives, and globals.css uses it to force the scroll reveals
    // visible rather than leaving the page blank.
    <html lang="en" className={`no-js ${inter.variable} ${fraunces.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js')`,
          }}
        />
      </head>
      <body>
        <a href="#main" className="sr-only-focusable panel px-4 py-2 text-sm">
          Skip to content
        </a>

        <SmoothScroll />
        <RevealRoot />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton />

        <JsonLd data={salonLd()} />
      </body>
    </html>
  );
}
