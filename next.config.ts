import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // three.js ships untranspiled ESM in places; keep it in the server bundle graph.
  transpilePackages: ["three"],
  async redirects() {
    return [
      // The audit is the primary CTA — keep the short link working.
      { source: "/free-audit", destination: "/audit", permanent: true },
    ];
  },
};

export default nextConfig;
