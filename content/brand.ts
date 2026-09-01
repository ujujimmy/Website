/**
 * SINGLE SWAP POINT.
 *
 * Everything brand-specific lives here. When you settle on a real name,
 * domain and contact details, change them once in this file and the whole
 * site — copy, metadata, JSON-LD, sitemap, OG images, footer — follows.
 *
 * TODO(brand): the name and domain are settled; the contact details
 * (a phone line, a working inbox) are still outstanding.
 */

export const brand = {
  name: "jigme.agency",
  /**
   * TODO(brand): set this to the registered entity name once the business is
   * formally registered. It appears in the footer copyright and in JSON-LD
   * `legalName`, so it should match whatever is on the paperwork.
   */
  legalName: "Jigme",
  /** Used in <title> as "Page — {tagline}" and in OG cards. */
  tagline: "Reviews, Websites & SEO for Local Businesses",
  /** One-sentence positioning. Appears in metadata and JSON-LD. */
  description:
    "We help local businesses earn more 5-star Google reviews, launch websites that convert, and rank where customers are searching. Delhi-based, US hours.",

  /**
   * The canonical origin. No trailing slash.
   *
   * This feeds the canonical tags, the sitemap, the OG image URLs and the
   * JSON-LD `url`, so it has to be the address visitors actually land on.
   * jigme.agency is registered and pointed at this Vercel project, so it is
   * that rather than the *.vercel.app address it used to hold: leaving it on
   * the Vercel host would tell Google the site lives somewhere other than the
   * domain being linked and indexed.
   */
  url: "https://jigme.agency",
  /** Shown as text on the OG card. The brand reads as a domain by design. */
  domain: "jigme.agency",

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
    /**
     * ⚠️ Verify the mailbox exists before relying on this.
     *
     * jigme.agency is registered, but registering a domain does not create a
     * mailbox behind it. Until MX records and an inbox are set up, mail to
     * this address bounces and the site is inviting messages into a void.
     *
     * WhatsApp below is confirmed working and carries the load in the
     * meantime. If the inbox is going to be a while, make this nullable like
     * `phone` above and every mailto drops out of the site on its own.
     *
     * TODO(brand): confirm hello@jigme.agency receives mail, then delete
     * this warning.
     */
    email: "hello@jigme.agency",
    phone: null as string | null,
    phoneHref: null as string | null,
    whatsapp: "+91 97736 71272",
    /** wa.me wants the number bare — country code, no +, no spaces. */
    whatsappHref: "https://wa.me/919773671272",
  },

  /** Honesty beats hiding it — stated plainly in the footer and About page. */
  hours: "Mon–Fri, 9am–6pm ET / 6am–3pm PT",
  /**
   * This read "Remote-first · Serving US · Canada · UK · India", which
   * implies a client base in four countries. There are three clients and
   * all of them are in Delhi. The rest of the site already says this
   * plainly — "Based in Delhi. Set up for your timezone." — so the footer
   * now matches instead of quietly contradicting it.
   */
  locations: ["Delhi, India", "Working US, Canada & UK hours"],

  /**
   * Empty until real accounts exist.
   *
   * These were three invented handles — linkedin.com/company/northbound-agency
   * and friends. Every one was a dead link in the footer, and they were also
   * being published as JSON-LD `sameAs`, which is Google's "these profiles
   * are the same entity" signal. Pointing it at profiles that don't exist is
   * worse than omitting it.
   *
   * TODO(brand): add the real profile URLs. The footer row and the `sameAs`
   * array both come back on their own once this has entries.
   */
  socials: {} as Record<string, string>,

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
