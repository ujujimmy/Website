import type { MetadataRoute } from "next";
import { brand } from "@/content/brand";

/** Written once at build time — `output: "export"` has no server to render it. */
export const dynamic = "force-static";


export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${brand.url}/sitemap.xml`,
    host: brand.url,
  };
}
