/**
 * SINGLE SWAP POINT.
 *
 * Everything brand-specific lives here. When you settle on a real name,
 * domain and contact details, change them once in this file and the whole
 * site — copy, metadata, JSON-LD, sitemap, OG images, footer — follows.
 *
 * TODO(brand): replace the placeholder name/domain/contact before launch.
 */

export const brand = {
  /** Working placeholder. Swap for the real agency name. */
  name: "Northbound",
  legalName: "Northbound Digital",
  /** Used in <title> as "Page — {tagline}" and in OG cards. */
  tagline: "Reviews, Websites & SEO for Local Businesses",
  /** One-sentence positioning. Appears in metadata and JSON-LD. */
  description:
    "We help local businesses earn more 5-star Google reviews, launch websites that convert, and rank where customers are searching. Delhi-based, US hours.",

  /** No trailing slash. TODO(brand): point at the real domain. */
  url: "https://northbound.agency",
  domain: "northbound.agency",

  contact: {
    email: "hello@northbound.agency",
    /** TODO(brand): a local US number (even a forwarding one) materially lifts foreign trust. */
    phone: "+1 (555) 019-4420",
    phoneHref: "tel:+15550194420",
    /** WhatsApp still matters for the India book of business. */
    whatsapp: "+919000000000",
  },

  /** Honesty beats hiding it — stated plainly in the footer and About page. */
  hours: "Mon–Fri, 9am–6pm ET / 6am–3pm PT",
  locations: ["Remote-first", "Serving US · Canada · UK · India"],

  socials: {
    linkedin: "https://www.linkedin.com/company/northbound-agency",
    instagram: "https://www.instagram.com/northbound.agency",
    x: "https://x.com/northboundhq",
  },

  /** Primary conversion target. Every major CTA points here. */
  primaryCta: {
    label: "Get my free audit",
    href: "/audit",
  },
  secondaryCta: {
    label: "See pricing",
    href: "/pricing",
  },
} as const;

export type Brand = typeof brand;
