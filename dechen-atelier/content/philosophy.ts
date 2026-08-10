/**
 * The salon's philosophy and the eight things it stands for.
 *
 * All of this is the salon's own copy from the catalog, lightly trimmed for
 * screen reading. Nothing here is invented — if a line needs to change, it
 * should change because the salon changed its mind, not because a component
 * needed different text.
 */

export const philosophy = {
  headline: "Beauty is healing.",
  body: "DECHEN Salon is built on the belief that beauty is healing, empowering, and deeply personal. Rooted in our Tibetan values and Buddhist principles, we combine modern hair artistry with mindful, cruelty-free practices — creating a space where tradition meets transformation.",
} as const;

export type Pillar = {
  n: string;
  title: string;
  body: string;
};

/** "What we stand for" — eight pillars, verbatim from the catalog. */
export const pillars: Pillar[] = [
  {
    n: "01",
    title: "Trend Awareness & Global Techniques",
    body: "We bring the latest international hair trends to our community — from interlocking to advanced colouring and styling — while staying grounded in ethical, sustainable beauty practices.",
  },
  {
    n: "02",
    title: "Vegan, Cruelty-Free Products",
    body: "In alignment with our Buddhist values of compassion, we proudly use brands that respect all life. Every product used reflects care — for the planet, animals, and our clients.",
  },
  {
    n: "03",
    title: "Empowering Careers for Tibetan Youth",
    body: "We offer inspiration and guidance for Tibetan girls to explore hair and beauty as a professional career — an industry full of creative freedom and financial growth.",
  },
  {
    n: "04",
    title: "Inspiring Roles & Mentorship",
    body: "Our team members are more than just stylists — they are role models and educators. We nurture the next generation of artists through training and personal example.",
  },
  {
    n: "05",
    title: "Hair Education & Product Knowledge",
    body: "We educate our clients about proper haircare, product usage, and ingredient awareness, helping them make conscious choices for long-term hair health.",
  },
  {
    n: "06",
    title: "Busting Hair Myths",
    body: "We challenge outdated beliefs by sharing real knowledge, science, and results — empowering clients with the truth about their hair.",
  },
  {
    n: "07",
    title: "Redefining Beauty Standards",
    body: "Beauty comes in many forms. We create awareness around self-love, natural beauty, and personal uniqueness, rejecting unrealistic societal beauty pressures.",
  },
  {
    n: "08",
    title: "Hair & Mental Wellness",
    body: "We believe that hair care is more than a service — it's a form of therapy. Our salon is a safe, welcoming, and healing space where clients can reclaim confidence and experience emotional upliftment.",
  },
];

/** "Why choose DECHEN Salon" — the five points from the catalog. */
export const whyChoose: string[] = [
  "Professional-grade services rooted in compassion",
  "Conscious products & clean beauty ethics",
  "A women-led, Tibetan-owned salon for the community",
  "Creative styling backed by education and experience",
  "A holistic approach to hair, beauty, and self-worth",
];
