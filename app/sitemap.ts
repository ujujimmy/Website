import type { MetadataRoute } from "next";
import { brand } from "@/content/brand";
import { services } from "@/content/services";
import { locations } from "@/content/locations";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: "weekly" | "monthly" | "yearly";
  }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
    { path: "/work", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/audit", priority: 0.9, changeFrequency: "monthly" },
    { path: "/audit/sample", priority: 0.7, changeFrequency: "monthly" },
    { path: "/locations", priority: 0.8, changeFrequency: "monthly" },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${brand.url}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...locations.map((location) => ({
      url: `${brand.url}/locations/${location.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...services.map((service) => ({
      url: `${brand.url}/services/${service.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];
}
