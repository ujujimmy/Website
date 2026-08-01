import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { brand } from "@/content/brand";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Scene } from "@/components/three/Scene";
import { RouteTransition } from "@/components/layout/RouteTransition";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { JsonLd } from "@/components/JsonLd";
import { organizationLd, websiteLd } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
  authors: [{ name: brand.legalName, url: brand.url }],
  creator: brand.legalName,
  openGraph: {
    type: "website",
    siteName: brand.name,
    locale: "en_US",
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
  themeColor: "#06070c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // `no-js` is stripped by the inline script below before first paint. If
    // scripts are blocked it survives, and globals.css uses it to force the
    // motion-driven scroll reveals visible instead of leaving the page blank.
    <html lang="en" className={`no-js ${inter.variable} ${sora.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js')`,
          }}
        />
      </head>
      <body>
        <a href="#main" className="sr-only-focusable glass px-4 py-2 text-sm">
          Skip to content
        </a>

        {/* One persistent background layer for the whole site. */}
        <Scene />
        <SmoothScroll />

        <RouteTransition />

        <Header />
        <div id="main">{children}</div>
        <Footer />

        <JsonLd data={organizationLd()} />
        <JsonLd data={websiteLd()} />
      </body>
    </html>
  );
}
