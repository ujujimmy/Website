import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * This repository holds more than one application, so Turbopack finds several
   * lockfiles and has to guess which one is the root. Say it explicitly, or the
   * guess lands on the parent directory and module resolution follows it there.
   */
  turbopack: { root: import.meta.dirname },

  /**
   * Static export.
   *
   * Every route on this site is pre-rendered — there are no API routes, no
   * server actions, nothing that needs to run per request. Exporting to plain
   * HTML means the salon can host it anywhere for free, there is no server to
   * keep alive, no cold start before someone sees the price list, and nothing
   * to break on a framework upgrade at the host's end.
   */
  output: "export",

  images: {
    /**
     * Required by `output: "export"` — there is no server to resize on demand.
     * The images in public/img are already WebP at their final dimensions;
     * scripts/optimise-images.mjs does that encoding once, at authoring time.
     */
    unoptimized: true,
  },
};

export default nextConfig;
