/**
 * Editorial copy.
 *
 * Every line the site says in its own voice lives here, so the register stays
 * consistent and a rewrite is one file rather than a hunt through components.
 *
 * The voice: short sentences, plain words, no superlatives. The salon's actual
 * credentials are unusual enough that describing them flatly is more impressive
 * than dressing them up — "India's first Master Hair Extensions Trainer" needs
 * no adjective in front of it, and putting one there would make a reader
 * suspect the claim.
 *
 * WHAT IS NOT IN HERE: prices (content/menu.ts), the founder's own words
 * (content/founder.ts), the philosophy and the eight pillars
 * (content/philosophy.ts), and the client reviews (content/reviews.ts). Those
 * are the salon's, verbatim, and nothing in this file may contradict them.
 */

export const home = {
  hero: {
    lines: ["Hair as", "identity."],
    lead: "A women-led, Tibetan-owned salon in Majnu-ka-Tilla, New Delhi. Colour, extensions and bond repair, from the chair of India's first Master Hair Extensions Trainer.",
  },

  /** The ticker under the hero. Facts only — this is the site's credentials line. */
  ticker: [
    "India's first Master Hair Extensions Trainer",
    "All-India Educator — Olaplex",
    "Balmain",
    "BBCOS Italy",
    "Fifteen years",
    "Vegan & cruelty-free",
    "Women-led, Tibetan-owned",
    "Majnu-ka-Tilla, New Delhi",
  ],

  statement: {
    title: "Beauty is healing.",
    body: [
      "DECHEN Salon is built on the belief that beauty is healing, empowering and deeply personal. Rooted in Tibetan values and Buddhist principles, we combine modern hair artistry with mindful, cruelty-free practice.",
      "In practice that means three things. We tell you what your hair can actually take. We use products that were not tested on anything living. And we price everything in public, so nobody is quoted a number at the till.",
    ],
  },

  services: {
    title: "Four chapters.",
    lead: "Everything we do falls under one of these. Every price is published.",
  },

  colour: {
    title: "Colour, matched to you.",
    body: "Balayage, babylights, ash tones, global colour. We start from your skin tone and how much upkeep you honestly want, not from a photograph — a shade that suits you at the sink and nowhere else is not a result.",
    shadesNote: "The five families we work through at consultation.",
  },

  extensions: {
    title: "Length, done properly.",
    body: "Tapes, wefts, toppers, clip-ins and fishnet volume, from sixteen inches to thirty. Fitted by the artist who trains other artists to fit them — which mostly shows in what happens to your own hair over the following year.",
  },

  founder: {
    eyebrow: "The founder",
    title: "Dechen Dolkar.",
    body: "Fifteen years, a national teaching practice and a chair in Majnu-ka-Tilla. She trained stylists at Toni & Guy and Looks before opening her own room.",
  },

  lookbook: {
    title: "Looks we work from.",
    lead: "Reference shots, not our own clients — point at one and we'll tell you what it takes on your hair.",
    /**
     * Said plainly, because a client who works out for herself that a gallery
     * is stock photography stops believing the prices too. The real work is on
     * Instagram, and sending people there is worth more than a gallery
     * pretending to be something it isn't.
     */
    instagram: "Real client work, before-and-afters and reels are on Instagram.",
  },

  reviews: {
    title: "In their words.",
  },

  visit: {
    title: "Two doors, one street.",
    lead: "DECHEN Salon and DECHEN Salon & Academy are both in Majnu-ka-Tilla. Same hours, same number, same prices — come to whichever is nearer. Walk in for a cut; message ahead for colour or extensions, which start with a conversation we would rather not rush.",
  },
} as const;

/** Page-level introductions. One per route, in the same voice. */
export const pages = {
  services: {
    eyebrow: "Services",
    title: "What we do.",
    lead: "Four chapters, every price published. If you are not sure which one you need, send a photograph and we will tell you.",
  },
  menu: {
    eyebrow: "Price index",
    title: "Every price.",
    lead: "Cutting and colour are quoted at three artist levels. The products, the care and the time are the same at all three — the difference is who is holding the scissors.",
  },
  about: {
    eyebrow: "The salon",
    title: "What we stand for.",
    lead: "Eight positions, written down. They are the reason the salon exists in the form it does.",
  },
  founder: {
    eyebrow: "Founder & Creative Director",
    title: "Dechen Dolkar.",
    lead: "India's first Master Hair Extensions Trainer, All-India Educator for Olaplex, Balmain and BBCOS Italy, and the person in the last chair.",
  },
  team: {
    eyebrow: "The team",
    title: "Three levels.",
    lead: "Every artist here works to the same standard and uses the same products. What changes with the level is experience — and that is the only thing you are paying more for.",
  },
  gallery: {
    eyebrow: "Lookbook",
    title: "Looks we work from.",
    lead: "Colour, cuts and length — ask for any of it by name. These are reference shots rather than photographs of our own clients; the real ones are on Instagram, where you'll also find before-and-afters and reels.",
  },
  reviews: {
    eyebrow: "Reviews",
    title: "In their words.",
    lead: "Two clients, named, in full. We would rather show you two real ones than twenty we wrote ourselves.",
  },
  visit: {
    eyebrow: "Visit",
    title: "Two doors in Majnu-ka-Tilla.",
    lead: "DECHEN Salon and DECHEN Salon & Academy are both in New Aruna Nagar, on one number and one set of hours. Come to whichever is nearer — walk in for a cut, message ahead for anything longer.",
  },
} as const;
