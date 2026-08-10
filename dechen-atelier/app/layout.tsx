import type { Metadata, Viewport } from "next";
import { Archivo, Bodoni_Moda } from "next/font/google";
import { brand } from "@/content/brand";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { RevealRoot } from "@/components/providers/RevealRoot";
import { JsonLd } from "@/components/JsonLd";
import { salonLd } from "@/lib/seo";
import "./globals.css";

/**
 * Bodoni for display.
 *
 * A high-contrast didone is the face of fashion publishing, and it is the
 * single strongest signal the design makes about where this salon sits. It is
 * used at large sizes only — below about 20px its hairlines disappear.
 *
 * Both faces are variable, so this is two files rather than the eight a
 * weight-by-weight request would pull. The headline is the largest-contentful-
 * paint element on most pages, and every extra font file delays it.
 */
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

/** Archivo for everything else: a neutral grotesque that holds up at 11px
 *  under 0.2em of tracking, which is what the label voice demands of it. */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
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
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f3eee7",
  colorScheme: "light",
};

/**
 * Marks the document as scripted before anything paints.
 *
 * Every entrance animation is defined under `.js`, so the served HTML shows all
 * of its content and this class is what opts into hiding it again. Get that the
 * wrong way round and a reader with a slow connection, a blocked bundle or no
 * JavaScript at all gets a blank page — which is the most common way an
 * animated site fails, and the least excusable.
 */
const MARK_SCRIPTED = `document.documentElement.classList.add("js")`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${bodoni.variable} ${archivo.variable}`}>
      <body className="min-h-dvh antialiased">
        <script dangerouslySetInnerHTML={{ __html: MARK_SCRIPTED }} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:bg-ink focus:px-5 focus:py-3 focus:text-cream"
        >
          Skip to content
        </a>

        <Nav />
        <main id="main">{children}</main>
        <Footer />

        <div className="grain" aria-hidden="true" />

        <RevealRoot />
        <JsonLd data={salonLd()} />
      </body>
    </html>
  );
}
