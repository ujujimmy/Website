/**
 * Dechen Dolkar — founder and Creative Director.
 *
 * Quote and career are verbatim from the salon's catalog. The brand list is
 * hers as printed; do not add to it without her say-so, since these are real
 * professional credentials and the first thing an informed client would check.
 */

export const founder = {
  name: "Dechen Dolkar",
  alsoKnownAs: "Burkar Dechen",
  role: "Founder & Creative Director",

  /** Her own words. This is the emotional centre of the whole site. */
  quote:
    "Hair has always been more than just appearance — it's identity, confidence, and cultural expression. At DECHEN Salon, we understand that every haircut and styling session is an opportunity to empower, refresh, and redefine. With expert hands, trend awareness, and a deep understanding of hair structure, we create looks that are not only beautiful — but deeply personal.",

  bio: [
    "With a remarkable 15-year career, Dechen has become a prominent hair influencer, educator, and Creative Director. Starting as India's first master hair extensions trainer, she has styled celebrities and led training at top salons like Toni & Guy and Looks.",
    "As an All-India Educator for brands like Olaplex, Balmain and BBCOS Italy, her expertise has been highlighted at major hair events nationwide. Today, Dechen brings her creative artistry to you at her signature salon.",
  ],

  /** The short version, for cards and the homepage. */
  short:
    "India's first Master Hair Extensions Trainer. Fifteen years, a national teaching practice, and a chair in Majnu-ka-Tilla.",

  credentials: [
    { label: "India's first Master Hair Extensions Trainer", detail: "The qualification she built her teaching practice on" },
    { label: "All-India Educator", detail: "Olaplex · Balmain · BBCOS Italy" },
    { label: "Led training at Toni & Guy and Looks", detail: "Before opening her own salon" },
    { label: "15 years", detail: "In global hair artistry" },
  ],

  brands: ["Olaplex", "Balmain", "BBCOS Italy", "Toni & Guy", "Looks"],
} as const;
