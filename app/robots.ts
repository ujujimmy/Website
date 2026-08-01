import type { MetadataRoute } from "next";
import { brand } from "@/content/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Conversion confirmation and checkout pages — no reason to index
      // these, and /api is machine-only (Razorpay webhooks live there).
      disallow: ["/thank-you", "/subscribe", "/api/"],
    },
    sitemap: `${brand.url}/sitemap.xml`,
    host: brand.url,
  };
}
