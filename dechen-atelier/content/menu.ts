/**
 * The complete service menu, transcribed from the salon's printed catalog.
 *
 * RULES FOR EDITING
 * - Amounts are plain rupee integers. Formatting happens in lib/price.ts.
 * - Nothing in here is estimated, rounded or filled in. If the catalog printed
 *   a range, it's a range; if it said "onwards", it's `from`; if it said
 *   "Consult", it's `consult`. A price a client can't rely on is worse than no
 *   price at all.
 * - Spelling follows the salon's own catalog ("Color", not "Colour").
 */

import type { TierId } from "./tiers";

export type Price =
  /** A single figure: ₹800 */
  | { kind: "flat"; amount: number }
  /** Printed as two figures separated by a slash: ₹350 / ₹500 */
  | { kind: "dual"; a: number; b: number }
  /** Printed as a span: ₹2,500–3,500 */
  | { kind: "range"; from: number; to: number }
  /** Printed as "onwards": ₹5,000 onwards */
  | { kind: "from"; amount: number }
  /** One figure per stylist tier */
  | { kind: "tiered"; top: number; creative: number; director: number }
  /** Printed as "Consult" */
  | { kind: "consult" };

export type MenuItem = {
  name: string;
  note?: string;
  price: Price;
};

export type MenuGroup = {
  title: string;
  intro?: string;
  /** Rendered above the rows, e.g. length disclaimers. */
  note?: string;
  items: MenuItem[];
};

export type Chapter = {
  slug: "cuts-and-styling" | "hair-color" | "hair-extensions" | "treatments";
  /** Nav and card label. */
  name: string;
  /** H1 on the chapter page. */
  heading: string;
  /** The salon's own intro line for this chapter. */
  intro: string;
  /** One-line blurb for nav and cards. */
  blurb: string;
  seo: { title: string; description: string };
  /** Which of the seven homepage acts this chapter belongs to. */
  act: number;
  groups: MenuGroup[];
  /** Longer editorial notes shown on the chapter page. */
  detail?: { title: string; body: string; points?: string[] }[];
};

export const chapters: Chapter[] = [
  /* ------------------------------------------------------------------ CUTS */
  {
    slug: "cuts-and-styling",
    name: "Cuts & Styling",
    heading: "Cuts and styling",
    intro:
      "Hair has always been more than just appearance — it's identity, confidence, and cultural expression. Our styling services are designed to create looks that are not only beautiful, but deeply personal.",
    blurb: "Precision cuts, blowouts and the everyday rituals that keep them.",
    seo: {
      title: "Haircuts & Styling",
      description:
        "Haircuts, French blowouts and hair rituals at DECHEN Salon, Majnu-ka-Tilla. Priced by Top Artist, Creative Artist and Creative Director.",
    },
    act: 2,
    groups: [
      {
        title: "Haircuts",
        items: [
          { name: "Male Haircut", price: { kind: "dual", a: 350, b: 500 } },
          { name: "Female Haircut", price: { kind: "flat", amount: 800 } },
          {
            // The catalog prints these as three separate lines — "Haircut by
            // Top Artist ₹500", and so on. They are one service at three
            // levels, so they belong in one row under the tier columns. Same
            // three figures, read in a quarter of the time.
            name: "Haircut by artist level",
            note: "Choose the artist you'd like. The cut, the wash and the finish are the same at every level.",
            price: { kind: "tiered", top: 500, creative: 1000, director: 2000 },
          },
        ],
      },
      {
        title: "Blowdry",
        items: [
          { name: "Hair Wash + Blast Dry", price: { kind: "flat", amount: 500 } },
          { name: "Hair Wash + French Blowout", price: { kind: "flat", amount: 1000 } },
          { name: "Head Massage + Wash + Blast Dry", price: { kind: "flat", amount: 800 } },
          { name: "Only French Blowout", price: { kind: "flat", amount: 500 } },
        ],
      },
    ],
    detail: [
      {
        title: "A cut starts with a conversation",
        body: "Your hair's density, growth pattern and how much time you actually have in the morning matter more than any photograph. We talk about all three before the first section is taken.",
      },
    ],
  },

  /* ----------------------------------------------------------------- COLOR */
  {
    slug: "hair-color",
    name: "Hair Color",
    heading: "Hair color",
    intro:
      "We are experts in recommending how you can enhance your personality with the right hair color. We offer the latest coloring techniques tailored to enhance your skin tone.",
    blurb: "Balayage, babylights, ash tones and global color, matched to your skin tone.",
    seo: {
      title: "Hair Color, Balayage & Highlights",
      description:
        "Balayage, ombré, babylights, ash tones, global color and highlights at DECHEN Salon, Majnu-ka-Tilla, New Delhi. Full price list by stylist tier.",
    },
    act: 3,
    groups: [
      {
        title: "Global Color",
        intro: "Give the roots a top-up of color and add extra shine.",
        items: [
          { name: "Men", price: { kind: "flat", amount: 3000 } },
          {
            name: "Women",
            price: { kind: "tiered", top: 5000, creative: 7000, director: 8000 },
          },
        ],
      },
      {
        title: "Highlights",
        items: [
          {
            name: "Men's Cap Highlights",
            note: "Highlights for short hair.",
            price: { kind: "tiered", top: 3500, creative: 4500, director: 7000 },
          },
          {
            name: "Women's Highlights — Full Head",
            note: "Total coverage of the head, creating natural multi-toned color that lightens or darkens hair and adds shine.",
            price: { kind: "tiered", top: 7000, creative: 8000, director: 10000 },
          },
          {
            name: "Women's Highlights — Half Head",
            note: "Partial coverage of the head with highlights.",
            price: { kind: "tiered", top: 5000, creative: 6500, director: 9000 },
          },
          {
            name: "T-section / Money Piece / Hairline Highlights",
            price: { kind: "tiered", top: 2500, creative: 3500, director: 5000 },
          },
        ],
      },
      {
        title: "Signature Techniques",
        items: [
          {
            name: "Balayage | Ombré",
            note: "A celebrated freehand painting technique where color is applied to create a soft, natural-looking graduation of lightness. The result is a sun-kissed, dimensional look with a seamless blend and a low-maintenance, graceful grow-out.",
            price: { kind: "tiered", top: 7000, creative: 8000, director: 15000 },
          },
          {
            name: "Ash Tones",
            note: "Sophisticated, cool-toned shades that neutralise unwanted warmth like brassiness or orange tones. From silvery ash blonde to muted ash brown. A consultation is recommended to select the right ash shade for your skin tone.",
            price: { kind: "tiered", top: 9000, creative: 12000, director: 18000 },
          },
          {
            name: "Babylights",
            note: "Micro-fine, delicate highlights throughout the hair to mimic the subtle, dimensional color seen on children's hair — for an incredibly natural, blended, low-maintenance result.",
            price: { kind: "tiered", top: 8000, creative: 10000, director: 20000 },
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------ EXTENSIONS */
  {
    slug: "hair-extensions",
    name: "Hair Extensions",
    heading: "Hair extensions",
    intro: "Premium quality. Professional application. Natural finish.",
    blurb:
      "Length, volume and fringes — fitted by India's first Master Hair Extensions Trainer.",
    seo: {
      title: "Hair Extensions, Toppers & Wigs",
      description:
        "Keratin bond, micro bead, flat tip, tape and clip-in hair extensions, toppers, ponytails and wigs at DECHEN Salon, Majnu-ka-Tilla, New Delhi.",
    },
    act: 4,
    groups: [
      {
        title: "Permanent Extensions",
        intro: "Application types: Keratin Glue Bond, Micro Beads, Flat Tips.",
        note: "Priced per strand. How many strands you need is decided together at consultation.",
        items: [
          { name: '16"', price: { kind: "flat", amount: 200 } },
          { name: '18"', price: { kind: "flat", amount: 230 } },
          { name: '20"', price: { kind: "flat", amount: 250 } },
          { name: '22"', price: { kind: "flat", amount: 280 } },
          { name: '24"', price: { kind: "flat", amount: 310 } },
          { name: '26"', price: { kind: "flat", amount: 340 } },
          { name: '28"', price: { kind: "flat", amount: 390 } },
          { name: '30"', price: { kind: "flat", amount: 440 } },
        ],
      },
      {
        title: "Tape Extensions",
        items: [
          { name: '18"', price: { kind: "flat", amount: 430 } },
          { name: '22"', price: { kind: "flat", amount: 480 } },
          { name: '24"', price: { kind: "flat", amount: 530 } },
        ],
      },
      {
        title: "Clip-In Extensions",
        items: [
          { name: '5-Clip Sets (18"–22")', price: { kind: "range", from: 10000, to: 13500 } },
          { name: '5-Clip Sets (24"–26")', price: { kind: "range", from: 15000, to: 16000 } },
        ],
      },
      {
        title: "Fishnet Volumizer",
        items: [
          { name: '18"–24"', price: { kind: "range", from: 13999, to: 16999 } },
          { name: '26"', price: { kind: "flat", amount: 19999 } },
          { name: '28"', price: { kind: "flat", amount: 23999 } },
          { name: '30"', price: { kind: "flat", amount: 29999 } },
        ],
      },
      {
        title: "Fringe / Bangs",
        items: [
          { name: "One-Clip Fringe", price: { kind: "flat", amount: 1999 } },
          { name: "3-Clip Fringe", price: { kind: "flat", amount: 3000 } },
        ],
      },
      {
        title: "Hair Toppers",
        intro: "Natural black / brown.",
        items: [
          { name: '18"–20"', price: { kind: "flat", amount: 12500 } },
          { name: '20"–22"', price: { kind: "flat", amount: 16500 } },
          { name: '22"–24"', price: { kind: "flat", amount: 18000 } },
        ],
      },
      {
        title: "Classic Premium Silk Base Toppers",
        items: [
          { name: '16"–18"', price: { kind: "flat", amount: 16800 } },
          { name: '20"–22"', price: { kind: "flat", amount: 24500 } },
        ],
      },
      {
        title: "Other Extensions",
        items: [
          { name: 'Seamless Patches (12"–16")', price: { kind: "range", from: 2500, to: 5000 } },
          { name: "Ponytails", price: { kind: "flat", amount: 9999 } },
          { name: "Wigs", price: { kind: "range", from: 19999, to: 23000 } },
          { name: "Funky Color (Clip-In)", price: { kind: "flat", amount: 499 } },
          { name: "Funky Color (Fusion Bond)", price: { kind: "flat", amount: 299 } },
        ],
      },
    ],
    detail: [
      {
        title: "Fitted by the person who wrote the course",
        body: "Dechen became India's first Master Hair Extensions Trainer before she opened this salon. Bad extensions are not a styling problem, they're a weight-and-tension problem — which is exactly what a trainer spends years learning to get right.",
      },
    ],
  },

  /* ------------------------------------------------------------ TREATMENTS */
  {
    slug: "treatments",
    name: "Treatments",
    heading: "Treatments & repair",
    intro:
      "Deep conditioning, bond repair and scalp therapy — the part of the appointment that keeps working after you leave.",
    blurb: "Olaplex, nanoplastia, hair spa and gloss — repair you can feel.",
    seo: {
      title: "Olaplex, Hair Botox & Hair Spa Treatments",
      description:
        "Olaplex bond repair, hair botox and nanoplastia, scalp treatment, hair spa, cleansing and glow shine treatments at DECHEN Salon, New Delhi.",
    },
    act: 5,
    groups: [
      {
        title: "Bond Repair",
        note: "Nanoplastia is priced per stylist tier, and each figure is a starting price — the catalog prints them as “onwards”, because the final quote depends on the length and density of your hair.",
        items: [
          {
            name: "Olaplex Treatment",
            note: "Repairs and strengthens hair from the inside out by rebuilding broken disulfide bonds damaged by chemical processes, heat styling and environmental factors.",
            price: { kind: "range", from: 2500, to: 3500 },
          },
          {
            name: "Hair Botox / Nanoplastia",
            note: "Organic advanced smoothing and texture treatment. Vegan and cruelty-free, 100% non-chemical, infused with natural botanical ingredients. Prices are starting prices.",
            price: { kind: "tiered", top: 5000, creative: 7000, director: 9000 },
          },
        ],
      },
      {
        title: "Specialty Hair Treatments",
        items: [
          {
            name: "Scalp Treatment / Hair Spa",
            note: "A relaxing and therapeutic service designed to nourish your scalp, promote healthy hair growth, and leave your hair feeling refreshed and revitalised.",
            price: { kind: "range", from: 1500, to: 2500 },
          },
          {
            name: "Botox Hair Spa",
            note: "A luxurious deep conditioning treatment that enhances hair color, intensely hydrates, and leaves hair feeling incredibly smooth and shiny.",
            price: { kind: "consult" },
          },
          {
            name: "Hair Cleansing",
            note: "A deep detox that removes product buildup, hard water minerals and impurities, preparing hair for a fresh start or a new color service.",
            price: { kind: "range", from: 1000, to: 2000 },
          },
          {
            name: "Glow Shine Treatment",
            note: "An express service to refresh your existing color, boost vibrancy and achieve a brilliant, high-gloss shine between full coloring appointments.",
            price: { kind: "range", from: 3000, to: 4500 },
          },
        ],
      },
    ],
    detail: [
      {
        title: "Olaplex, and why we talk about bonds",
        body: "Every time hair is lightened, straightened or heat-styled, disulfide bonds inside the strand break. Olaplex uses a patented ingredient — Bis-Aminopropyl Diglycol Dimaleate — to find those broken bonds and link them back together.",
        points: [
          "Repairs bonds from heat, chemical and mechanical damage",
          "Dramatically improves hair elasticity and strength",
          "Dechen is an All-India Educator for Olaplex",
        ],
      },
      {
        title: "Nanoplastia, without the harsh chemistry",
        body: "Our smoothing treatments are deep conditioning therapies rather than chemical straighteners.",
        points: [
          "100% non-chemical",
          "Reconstructs and repairs hair bonds",
          "Infused with natural botanical ingredients",
          "Long-lasting, frizz-free, shiny hair",
        ],
      },
    ],
  },
];

export const chapterBySlug = Object.fromEntries(
  chapters.map((c) => [c.slug, c]),
) as Record<Chapter["slug"], Chapter>;

/**
 * Whether any service in a chapter is priced by artist level.
 *
 * Extensions are one price whoever fits them, so their chapter gets neither
 * tier column headings nor a tier filter. Offering a control that changes
 * nothing is worse than not offering it.
 */
export function chapterHasTiers(chapter: Chapter): boolean {
  return chapter.groups.some((group) =>
    group.items.some((item) => item.price.kind === "tiered"),
  );
}

/**
 * The five shade families the salon shows on its colour chart. These drive the
 * gradient sweep in the homepage colour act, so the 3D is showing real product
 * rather than decorative colour.
 */
export const shadeFamilies = [
  { name: "Warm Smoke", hex: "#4a3b3a" },
  { name: "Copper Carmel", hex: "#7d4b2c" },
  { name: "Honey Bronde", hex: "#a97c45" },
  { name: "Golden Blonde", hex: "#c9a366" },
  { name: "Creamy Platinum", hex: "#ded2bd" },
] as const;

/** Retail the salon stocks, named in the catalog. */
export const retail = [
  {
    name: "Olaplex No.7 Bonding Oil",
    body: "Smooth, shiny, zero frizz. A few drops on damp or dry hair.",
  },
  {
    name: "Olaplex No.6 Bond Smoother",
    body: "Leave-in treatment. Strengthens, hydrates and reduces frizz for up to 72 hours while speeding up blow-dry time.",
  },
] as const;
