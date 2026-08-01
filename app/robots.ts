import type { MetadataRoute } from "next";
import { brand } from "@/content/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Conversion confirmation page — no reason for it to be indexed.
      disallow: ["/thank-you"],
    },
    sitemap: `${brand.url}/sitemap.xml`,
    host: brand.url,
  };
}
