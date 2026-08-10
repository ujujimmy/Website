import type { MetadataRoute } from "next";
import { brand } from "@/content/brand";
import { chapters } from "@/content/menu";

/** Written once at build time — `output: "export"` has no server to render it. */
export const dynamic = "force-static";


export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/services", priority: 0.9 },
    ...chapters.map((chapter) => ({
      path: `/services/${chapter.slug}`,
      priority: 0.9,
    })),
    // The price list is the page people actually search for.
    { path: "/menu", priority: 0.95 },
    { path: "/about", priority: 0.7 },
    { path: "/founder", priority: 0.8 },
    { path: "/team", priority: 0.7 },
    { path: "/gallery", priority: 0.7 },
    { path: "/reviews", priority: 0.6 },
    { path: "/visit", priority: 0.9 },
  ];

  return routes.map((route) => ({
    url: `${brand.url}${route.path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
