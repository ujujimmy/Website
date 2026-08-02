/**
 * Self-select lead capture.
 *
 * Instead of one CTA that has to work for everybody, the visitor picks the
 * sentence that describes them. It qualifies them before they ever fill a
 * field, and it deep-links straight into the audit form with the right option
 * already chosen — so the form opens feeling half-finished.
 *
 * `need` must match the AuditForm service values: reviews | website | seo |
 * everything.
 */

export type Path = {
  need: "reviews" | "website" | "seo" | "everything";
  /** The visitor's own words, in first person. */
  title: string;
  body: string;
  cta: string;
  /** Accent used for the card's tint and border. */
  accent: "brand" | "brand-2" | "soft" | "featured";
};

export const paths: Path[] = [
  {
    need: "website",
    title: "I already have a website",
    body: "Then the question is whether it's actually bringing you customers. We'll check its speed, its structure and what it ranks for — and tell you honestly whether it needs fixing or replacing.",
    cta: "Audit my site",
    accent: "brand",
  },
  {
    need: "reviews",
    title: "I'm already ranking well",
    body: "Good — that's the hard part. Now the deciding factor is what people see when they compare you: your rating, your review count, and whether anyone replied to the last complaint.",
    cta: "Start with reviews",
    accent: "brand-2",
  },
  {
    need: "seo",
    title: "Nobody can find me",
    body: "You're somewhere on page two, which is the same as not existing. We'll show you exactly which searches you're missing and who's taking that traffic instead.",
    cta: "Get me found",
    accent: "soft",
  },
  {
    need: "everything",
    title: "I want it all handled",
    body: "Website, reviews and search, run by one team for one monthly number. You get a report showing leads — not impressions, not 'engagement'.",
    cta: "Handle everything",
    accent: "featured",
  },
];
