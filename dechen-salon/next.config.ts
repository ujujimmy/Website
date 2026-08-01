import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Everything is local and pre-sized by scripts/extract-images.mjs, so the
    // only formats worth negotiating are the modern two.
    formats: ["image/avif", "image/webp"],
  },
  // three.js ships both ESM and CJS builds; this keeps the client bundle on the
  // tree-shakeable one.
  transpilePackages: ["three"],
};

export default nextConfig;
