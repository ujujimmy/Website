import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // This project is self-contained and is meant to be lifted out into its own
  // repository. Pin the trace root to this folder so Next does not walk up and
  // adopt the unrelated lockfile in the parent directory.
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),

  // Every route in this site is statically prerendered — there is no server
  // logic anywhere. We deliberately do NOT set `output: "export"`, because an
  // exported build forces `images.unoptimized` and then next/image emits the
  // original JPEG untouched: no AVIF, no WebP, no responsive srcset. The source
  // photography is already compressed Instagram output, so serving it twice-
  // compressed at the wrong size is exactly the thing we are trying to avoid.
  //
  // On Vercel (the deploy target) this is still a fully static site — the same
  // HTML, served from the edge — with a real image pipeline in front of it.
  //
  // If you ever need a portable `out/` folder instead (S3, nginx, a USB stick),
  // add `output: "export"` and `images: { unoptimized: true }` here. Nothing
  // else in the codebase has to change; you just lose AVIF/WebP.
  images: {
    formats: ["image/avif", "image/webp"],
    // The sources are ~1080px square/4:5 Instagram files and every slot is
    // capped well below that. There is no point generating widths we will
    // never request — see the `sizes` on each <Plate>.
    imageSizes: [256, 320, 384, 540, 640],
    deviceSizes: [640, 750, 828, 1080],
  },
};

export default nextConfig;
