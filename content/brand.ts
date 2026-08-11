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

  /**
   * Contact routes.
   *
   * `phone` is deliberately null rather than placeholder digits. A site whose
   * entire argument is "every number here is checkable" cannot ship a number
   * from the reserved 555-01XX fictional block — one visitor who recognises
   * it discounts every other figure on the page. Every consumer treats null
   * as "this route does not exist yet" and omits the link; fill it in and the
   * footer link, the contact card, the footer nav entry and the JSON-LD
   * `telephone` all come back on their own.
   *
   * WhatsApp is real and carries the load in the meantime. It works from any
   * country without the visitor paying for an international call, which makes
   * it the better primary channel here regardless.
   *
   * TODO(brand): a local US line (even a forwarding one) materially lifts
   * foreign trust. Add it here when there is one.
   */
  contact: {
    email: "hello@northbound.agency",
    phone: null as string | null,
    phoneHref: null as string | null,
    whatsapp: "+91 97736 71272",
    /** wa.me wants the number bare — country code, no +, no spaces. */
    whatsappHref: "https://wa.me/919773671272",
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
