/**
 * Image manifest.
 *
 * Every photograph on the site is referenced through this file, so replacing
 * one is a single edit here rather than a hunt through components. Dimensions
 * are the real intrinsic sizes — next/image needs them to reserve space, which
 * is what keeps cumulative layout shift at zero.
 *
 * PROVENANCE
 * These were extracted from the salon's own printed catalog (see
 * scripts/extract-images.py) and encoded to WebP by scripts/optimise-images.mjs.
 * Two are genuinely the salon's: `founder` and `extensionsBundles`. The rest are
 * the model and reference shots the catalog uses. They work, but photographs of
 * DECHEN's own clients and interior would be a large upgrade — drop a new file
 * into public/img/, run the optimise script, and update the entry here.
 */

export type Img = {
  src: string;
  width: number;
  height: number;
  /** Describes the image for someone who cannot see it. Never left generic. */
  alt: string;
};

const img = (
  name: string,
  width: number,
  height: number,
  alt: string,
): Img => ({ src: `/img/${name}.webp`, width, height, alt });

export const images = {
  /* Portraits and people */
  hero: img(
    "hero",
    735,
    893,
    "A model with long dark waves and a pink satin bow, photographed against a pink backdrop",
  ),
  founder: img(
    "founder",
    596,
    640,
    "Dechen Dolkar, founder and Creative Director of DECHEN Salon, standing in the salon in a red jacket",
  ),

  /* Cuts */
  cutsBanner: img(
    "cuts-banner",
    1600,
    1067,
    "A length of brown hair laid beside a pair of cutting shears",
  ),
  cutLayers: img(
    "cut-layers",
    589,
    884,
    "A long layered cut with a soft blow-dried finish",
  ),

  /* Colour */
  shades: img(
    "shades",
    663,
    827,
    "The salon's shade chart: Warm Smoke, Copper Carmel, Honey Bronde, Golden Blonde and Creamy Platinum shown side by side",
  ),
  colorBalayage: img(
    "color-balayage",
    663,
    994,
    "Freehand balayage graduating from a dark root to a sun-kissed mid-length",
  ),
  colorAsh: img(
    "color-ash",
    663,
    994,
    "A cool ash blonde with the warmth fully neutralised",
  ),
  colorBabylights: img(
    "color-babylights",
    736,
    923,
    "Micro-fine babylights blended through long hair",
  ),
  colorHighlightsFull: img(
    "color-highlights-full",
    473,
    844,
    "Full-head highlights adding multi-toned dimension to dark brown hair",
  ),
  colorHighlightsHalf: img(
    "color-highlights-half",
    663,
    880,
    "Half-head highlights through the top sections of shoulder-length hair",
  ),
  colorMoneyPiece: img(
    "color-money-piece",
    735,
    981,
    "A silver money-piece framing the face against dark hair",
  ),
  colorMenCap: img(
    "color-men-cap",
    736,
    1104,
    "Cap highlights lightening a short textured men's cut",
  ),

  /* Extensions */
  extensionsBundles: img(
    "extensions-bundles",
    1594,
    897,
    "Bundles of extension hair in several shades, fanned out beside a stack of tape wefts",
  ),

  /* Treatments */
  olaplexBeforeAfter: img(
    "olaplex-before-after",
    736,
    977,
    "The same head of hair before and after treatment: frizzy and dry on the left, smooth and glossy on the right",
  ),
  treatmentNanoplastia: img(
    "treatment-nanoplastia",
    736,
    1259,
    "Long hair with a poker-straight, high-gloss finish after a smoothing treatment",
  ),
  treatmentScalp: img(
    "treatment-scalp",
    720,
    810,
    "A scalp massage during a hair spa treatment, the client's eyes closed",
  ),
  retailOlaplex7: img(
    "retail-olaplex-7",
    736,
    1104,
    "A bottle of Olaplex No.7 Bonding Oil",
  ),
  retailOlaplex6: img(
    "retail-olaplex-6",
    736,
    1104,
    "A bottle of Olaplex No.6 Bond Smoother, with before and after results beneath it",
  ),

  /* Lookbook */
  lookBalayageWarm: img(
    "look-balayage-warm",
    736,
    1327,
    "Long waves in a warm balayage, lightening towards the ends",
  ),
  lookBalayageBronde: img(
    "look-balayage-bronde",
    736,
    1104,
    "A bronde balayage with soft beachy waves",
  ),
  lookLayersBlonde: img(
    "look-layers-blonde",
    600,
    900,
    "Blown-out layers with a curtain fringe in a blended blonde",
  ),
  lookWaves: img("look-waves", 720, 1280, "Loose glossy waves on long hair"),
} satisfies Record<string, Img>;

export type ImageKey = keyof typeof images;

/** The lookbook grid on /gallery and the scrolling strip on the homepage. */
export const lookbook: ImageKey[] = [
  "lookBalayageWarm",
  "colorBalayage",
  "lookWaves",
  "colorBabylights",
  "cutLayers",
  "colorAsh",
  "lookBalayageBronde",
  "colorMoneyPiece",
  "lookLayersBlonde",
  "colorHighlightsFull",
  "treatmentNanoplastia",
  "colorHighlightsHalf",
  "extensionsBundles",
  "colorMenCap",
];
