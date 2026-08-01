/**
 * The three stylist tiers.
 *
 * This is the salon's actual pricing structure — every colour and cut service
 * is quoted three ways — so it doubles as the team model. Copy is from the
 * catalog's "Our Stylist Tiers" spread.
 *
 * TODO(salon): if you'd like individual stylists named and photographed on the
 * team page, send names and roles and they slot in under the matching tier.
 */

export type TierId = "top" | "creative" | "director";

export type Tier = {
  id: TierId;
  name: string;
  strapline: string;
  body: string;
  perfectFor: string;
  /** Sort order, cheapest first. Also drives the braid animation on /team. */
  rank: number;
};

export const tiers: Tier[] = [
  {
    id: "top",
    name: "Top Artist",
    strapline: "Reliable. Skilled. Style experts.",
    body: "Top Artists are the foundation of the DECHEN experience — trusted professionals with proven skill in classic and modern hairstyling. Known for their warm approach and consistent results, they specialise in everyday glam, smooth hair rituals, and personalised looks tailored to your lifestyle.",
    perfectFor:
      "Maintenance cuts, root touch-ups, hair rituals, and signature salon styling.",
    rank: 1,
  },
  {
    id: "creative",
    name: "Creative Artist",
    strapline: "Trendsetters. Innovators. Colour specialists.",
    body: "Our Creative Artists are highly trained stylists who bring a modern, fashion-forward edge to every service. From balayage to bold cuts, they're known for their artistry and technical finesse. Trained directly under Dechen, they translate the latest techniques into wearable, confident styles.",
    perfectFor:
      "Creative colour, fashion-forward styling, precision cuts, and advanced techniques.",
    rank: 2,
  },
  {
    id: "director",
    name: "Creative Director",
    strapline: "Visionary. Educator. Transformation specialist.",
    body: "Dechen is the soul of the salon — a global artist with 15+ years of experience. As India's first Master Hair Extensions Trainer and a former educator with Toni & Guy, Olaplex and Balmain, she leads with unmatched expertise. Every look crafted by Dechen carries her signature blend of precision, science, and soul.",
    perfectFor:
      "Total transformations, corrective colour, advanced hair science, and luxury styling.",
    rank: 3,
  },
];

export const tierById = Object.fromEntries(tiers.map((t) => [t.id, t])) as Record<
  TierId,
  Tier
>;

/** Short labels for the price tables, where column width is tight. */
export const tierShort: Record<TierId, string> = {
  top: "Top Artist",
  creative: "Creative Artist",
  director: "Creative Director",
};
