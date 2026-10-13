/**
 * SINGLE SWAP POINT for PinRank.
 *
 * Everything that differs per deployment lives here. Copy lives in
 * src/i18n/{nl,fr,en}.mjs. Search this folder for `TODO(` before going live —
 * the build prints every one it finds.
 */

export default {
  brand: "PinRank",

  /** Canonical origin, no trailing slash. Feeds canonical tags, hreflang and the sitemap. */
  siteUrl: "https://pinrank.be", // TODO(domain): set to the real domain

  /**
   * Booking. The funnel ends in a Cal.com calendar embedded right after the
   * qualifier, prefilled with the visitor's answers.
   *
   * calLink is "username/event-slug" from your Cal.com event URL. Leave it
   * empty and the funnel falls back to WhatsApp only.
   *
   * Cal.com runs an EU instance (cal.eu) — better for Belgian GDPR. If you use
   * it, set calOrigin to "https://cal.eu" and calEmbedJs to
   * "https://app.cal.eu/embed/embed.js".
   */
  calLink: "", // TODO(booking): e.g. "pinrank/gratis-gesprek"
  calOrigin: "https://cal.com",
  calEmbedJs: "https://app.cal.com/embed/embed.js",

  /**
   * WhatsApp number, bare: country code, no +, no spaces. (Belgian mobile: +32 468 06 00 41)
   */
  whatsapp: "32468060041",

  /** Meta Pixel ID. Loads only after the visitor accepts cookies (GDPR). */
  metaPixelId: "", // TODO(pixel)

  /**
   * Optional. Every qualifier submission is POSTed here as JSON (text/plain,
   * so no CORS preflight) — point it at a Make / Zapier / n8n webhook that
   * writes to a Google Sheet, so you can follow up people who answered the
   * questions but never booked. Events: lead, booked, whatsapp_click.
   */
  leadWebhook: "",

  /**
   * TODO(price): confirm the period. Assumed €800 per month excl. VAT.
   * period: "month" | "once". Set show: false to keep price for the call.
   */
  price: { amount: 800, currency: "EUR", period: "month", show: true },

  /**
   * Belgian law requires the legal name, address and enterprise number on the
   * site. Shown in the footer and the privacy policy.
   */
  company: {
    name: "PinRank", // TODO(company): registered legal name
    address: "", // TODO(company): registered address
    vat: "", // TODO(company): KBO/BCE enterprise number, e.g. BE 0123.456.789
    email: "hello@pinrank.be", // TODO(company): confirm the inbox receives mail
  },

  /**
   * Real client results only. Each: { quote, name, business, city }.
   * The section stays hidden while this is empty — an invented testimonial
   * found out once costs more than having none.
   */
  testimonials: [],

  languages: ["nl", "fr", "en"],
  defaultLanguage: "nl",
};
