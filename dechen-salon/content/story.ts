/**
 * The homepage scroll story — seven acts.
 *
 * Index === act id, and the id is what the 3D strand reads to know which shape
 * to morph toward (see lib/strand/acts.ts). Keep this array and that one the
 * same length and in the same order.
 *
 * `ground` decides the background the act sits on. The story starts and ends in
 * blush and deepens through the middle, so the silk strand has contrast exactly
 * where the visual is doing the most work.
 */

import { brand } from "./brand";
import { shadeFamilies } from "./menu";

export type Ground = "blush" | "rose" | "plum";

export type Act = {
  id: number;
  key: string;
  /** Label for the scroll rail. */
  label: string;
  ground: Ground;
  /** Which side the copy sits on, so the strand has the other side. */
  side: "left" | "right" | "center";
};

export const acts: Act[] = [
  { id: 0, key: "open", label: "DECHEN", ground: "blush", side: "center" },
  { id: 1, key: "philosophy", label: "Philosophy", ground: "blush", side: "left" },
  { id: 2, key: "cut", label: "The cut", ground: "rose", side: "right" },
  { id: 3, key: "color", label: "Color", ground: "plum", side: "left" },
  { id: 4, key: "length", label: "Length", ground: "plum", side: "right" },
  { id: 5, key: "care", label: "Care", ground: "plum", side: "left" },
  { id: 6, key: "visit", label: "Visit", ground: "blush", side: "center" },
];

export const story = {
  open: {
    place: "Majnu-ka-Tilla · New Delhi",
    title: brand.name,
    tagline: brand.tagline,
    sub: "A women-led, Tibetan-owned salon where modern hair artistry meets mindful, cruelty-free practice.",
    scrollHint: "Scroll",
  },

  philosophy: {
    eyebrow: "Our philosophy",
    headline: "Beauty is healing.",
    sub: "Rooted in our Tibetan values and Buddhist principles, we combine modern hair artistry with mindful, cruelty-free practices — creating a space where tradition meets transformation.",
    points: [
      "Vegan and cruelty-free, because compassion isn't a product line",
      "A safe, welcoming space — hair care as a form of therapy",
      "Careers and mentorship for Tibetan youth in beauty",
    ],
    link: { label: "What we stand for", href: "/about" },
  },

  cut: {
    eyebrow: "The craft",
    headline: "Every cut is a chance to redefine.",
    sub: "Hair has always been more than appearance — it's identity, confidence, and cultural expression. With expert hands and a deep understanding of hair structure, we create looks that are not only beautiful, but deeply personal.",
    link: { label: "Cuts & styling", href: "/services/cuts-and-styling" },
  },

  color: {
    eyebrow: "Color",
    headline: "The right shade is the one that suits you.",
    sub: "We are experts in recommending how the right color can enhance your personality — the latest techniques, matched to your skin tone rather than to a photograph.",
    shades: shadeFamilies,
    link: { label: "Color & balayage", href: "/services/hair-color" },
  },

  length: {
    eyebrow: "Extensions",
    headline: "Length, from the person who wrote the course.",
    sub: "Dechen became India's first Master Hair Extensions Trainer before she opened this chair. Keratin bonds, micro beads, flat tips, tapes and clip-ins — from 16 inches to 30.",
    link: { label: "Extensions menu", href: "/services/hair-extensions" },
  },

  care: {
    eyebrow: "Repair",
    headline: "We put the bonds back.",
    sub: "Lightening, heat and time break the disulfide bonds inside every strand. Olaplex rebuilds them; our nanoplastia smooths without harsh chemistry. This is the part of the appointment that keeps working after you leave.",
    link: { label: "Treatments", href: "/services/treatments" },
  },

  visit: {
    eyebrow: "Come and sit with us",
    headline: "We'd love to meet your hair.",
    sub: "Walk in, or send a message and we'll find you a time. Colour and extensions are best booked ahead so we can give them the hours they deserve.",
  },
} as const;
