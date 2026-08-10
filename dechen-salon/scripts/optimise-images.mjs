/**
 * Converts public/img/*.jpg to WebP in place.
 *
 *   node scripts/optimise-images.mjs
 *
 * The site is a static export, which means next/image cannot resize or
 * re-encode anything at request time — whatever is in public/ is what ships. So
 * the encoding happens once, here, at authoring time.
 *
 * Nothing is upscaled: each image is capped at its own intrinsic width, so this
 * only ever removes bytes. Update content/images.ts if any dimension changes.
 */

import sharp from "sharp";
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";

const DIR = "public/img";
const MAX_WIDTH = 1600;
const QUALITY = 78;

const files = (await readdir(DIR)).filter((f) => f.endsWith(".jpg"));
let before = 0;
let after = 0;

for (const file of files) {
  const from = path.join(DIR, file);
  const to = from.replace(/\.jpg$/, ".webp");

  before += (await stat(from)).size;

  const image = sharp(from);
  const meta = await image.metadata();
  const width = Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH);

  await image
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(to);

  const size = (await stat(to)).size;
  after += size;

  await unlink(from);

  console.log(
    `${file.padEnd(30)} ${String(Math.round((await stat(to)).size / 1024)).padStart(4)}KB  ${width}px`,
  );
}

console.log(
  `\n${files.length} images: ${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB ` +
    `(${Math.round((1 - after / before) * 100)}% smaller)`,
);
