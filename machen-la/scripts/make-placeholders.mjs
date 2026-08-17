/**
 * Generates one placeholder per image slot, at the exact pixel dimensions the
 * real photograph must have.
 *
 * They are deliberately plain: a solid --ink field, a hairline --dzong frame,
 * and the intended subject written on it in --wall. No stock photography, no
 * grey silhouettes, nothing that could be mistaken for a finished asset and
 * shipped by accident.
 *
 *   node scripts/make-placeholders.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "images");

const INK = "#1A1614";
const WALL = "#EDE6D8";
const DZONG = "#9E3A3E";
const BUTTER = "#E8A33D";

/**
 * Mirrors src/data/images.ts. Kept as plain data here rather than imported,
 * because this script runs outside the TypeScript build.
 */
const SLOTS = [
  {
    file: "interior-evening.jpg",
    width: 1080,
    height: 1350,
    title: "Wide interior, evening",
    brief: "The room with the lights on. Shoot from a corner for depth.",
  },
  {
    file: "hot-pot-table.jpg",
    width: 1080,
    height: 1080,
    title: "Hot pot, full table",
    brief: "Steam visible. Slightly above the table edge, not overhead.",
  },
  {
    file: "momo-platter-overhead.jpg",
    width: 1080,
    height: 1080,
    title: "Momo platter, overhead",
    brief: "Straight down. Sauce in frame, plain surface underneath.",
  },
  {
    file: "frontage-lane.jpg",
    width: 1080,
    height: 1350,
    title: "Frontage from the lane",
    brief: "So someone walking up recognises it. Include the sign.",
  },
  {
    file: "morning-coffee-window.jpg",
    width: 1080,
    height: 1350,
    title: "Coffee, window, morning light",
    brief: "Real early light. This picture sells the 7:30 opening.",
  },
  {
    file: "staff-kitchen.jpg",
    width: 1080,
    height: 1080,
    title: "Staff or the chef",
    brief: "Working, not posed in a line. Ask permission first.",
  },
];

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Naive greedy wrap — good enough for two short lines of placeholder text. */
function wrap(text, max) {
  const out = [];
  let line = "";
  for (const word of text.split(" ")) {
    if ((line + " " + word).trim().length > max) {
      out.push(line.trim());
      line = word;
    } else {
      line += " " + word;
    }
  }
  if (line.trim()) out.push(line.trim());
  return out;
}

async function build(slot) {
  const { width, height, title, brief, file } = slot;
  const pad = Math.round(width * 0.08);
  const titleSize = Math.round(width * 0.062);
  const briefSize = Math.round(width * 0.032);
  const metaSize = Math.round(width * 0.028);

  const titleLines = wrap(title, 20);
  const briefLines = wrap(brief, 34);

  const titleBlock = titleLines
    .map(
      (l, i) =>
        `<text x="${pad}" y="${height / 2 - 40 + i * titleSize * 1.15}" fill="${WALL}" font-family="Georgia, serif" font-size="${titleSize}" font-weight="600">${esc(l)}</text>`,
    )
    .join("");

  const briefBlock = briefLines
    .map(
      (l, i) =>
        `<text x="${pad}" y="${height / 2 + titleLines.length * titleSize * 0.6 + 60 + i * briefSize * 1.5}" fill="${WALL}" opacity="0.62" font-family="Helvetica, Arial, sans-serif" font-size="${briefSize}">${esc(l)}</text>`,
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${INK}"/>
    <rect x="${pad / 2}" y="${pad / 2}" width="${width - pad}" height="${height - pad}"
          fill="none" stroke="${DZONG}" stroke-width="2"/>
    <text x="${pad}" y="${pad * 1.6}" fill="${BUTTER}" font-family="monospace"
          font-size="${metaSize}" letter-spacing="${metaSize * 0.14}">REPLACE ME</text>
    ${titleBlock}
    ${briefBlock}
    <text x="${pad}" y="${height - pad}" fill="${WALL}" opacity="0.45" font-family="monospace"
          font-size="${metaSize}">${width} x ${height}</text>
  </svg>`;

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 88, progressive: true })
    .toFile(join(OUT, file));

  return `  ${file.padEnd(30)} ${width}x${height}`;
}

await mkdir(OUT, { recursive: true });
const lines = [];
for (const slot of SLOTS) lines.push(await build(slot));

// A 1200x630 social card, generated the same way so nothing on the site points
// at a missing file.
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${INK}"/>
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="${DZONG}" stroke-width="2"/>
  <text x="96" y="188" fill="${WALL}" font-family="Georgia, serif" font-size="62" font-weight="600">MACHEN LA</text>
  <text x="96" y="250" fill="${WALL}" opacity="0.6" font-family="monospace" font-size="24" letter-spacing="5">TIBET KITCHEN</text>
  <text x="96" y="392" fill="${WALL}" font-family="Georgia, serif" font-size="54" font-weight="600">The first kitchen open</text>
  <text x="96" y="458" fill="${WALL}" font-family="Georgia, serif" font-size="54" font-weight="600">in Majnu ka Tilla.</text>
  <text x="96" y="536" fill="${BUTTER}" font-family="monospace" font-size="28">07:30 - 22:00, every day</text>
</svg>`;
await sharp(Buffer.from(ogSvg)).jpeg({ quality: 90 }).toFile(join(OUT, "og-default.jpg"));

await writeFile(
  join(OUT, ".gitkeep"),
  "Placeholders are generated by scripts/make-placeholders.mjs\n",
);

console.log("\nPlaceholders written to public/images:");
console.log(lines.join("\n"));
console.log("  og-default.jpg                 1200x630");
console.log("\nSee REPLACE-THESE.md before launch.\n");
