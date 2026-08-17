/**
 * Every fact about the restaurant, in one place.
 *
 * Rule for this file: nothing goes in here that has not been verified. If a
 * detail is unknown it stays `null` and the interface renders around the gap.
 * A wrong fact on a working restaurant's website is worse than a missing one —
 * it becomes an argument at the table and a one-star review.
 */

/** TODO(client): swap for the real domain. Everything — canonicals, sitemap,
 *  og:image URLs, JSON-LD @id — derives from this one constant. */
export const SITE_URL = "https://machenla.example";

export const RESTAURANT = {
  name: "MACHEN LA Tibet Kitchen",
  /** How the name is written in running prose. */
  shortName: "Machen La",

  positioning: "The first kitchen open in Majnu ka Tilla.",

  /**
   * Formatted character for character as it appears on the Google Business
   * Profile. Do not "tidy" this — NAP consistency across the web is what ties
   * the site to the Google listing, and a reformatted address weakens it.
   */
  address: {
    full: "Rabsel House 47, New Aruna Colony, Majnu-ka-Tilla, New Aruna Nagar, Delhi 110054",
    street: "Rabsel House 47, New Aruna Colony",
    locality: "Majnu-ka-Tilla",
    region: "Delhi",
    postalCode: "110054",
    country: "IN",
  },

  geo: { lat: 28.70228, lng: 77.22901 },

  phone: {
    /** As printed, spaced the way the Google listing spaces it. */
    display: "+91 70425 24233",
    /** As dialled. */
    tel: "+917042524233",
    /** wa.me wants the number bare, no plus. */
    whatsapp: "917042524233",
  },

  hours: {
    opens: "07:30",
    closes: "22:00",
    /** Seven days. Confirmed in the brief. */
    days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ] as const,
    human: "7:30 AM – 10:00 PM, every day",
    short: "07:30 – 22:00",
  },

  cuisine: ["Tibetan", "Asian"] as const,
  priceRange: "₹₹",
  currency: "INR",

  rating: { value: 4.5, count: 398 },

  links: {
    instagram: "https://www.instagram.com/machen_la_tibet_kitchen/",
    /** Deep link straight to the coordinates, not a search for the name —
     *  there are several similarly named places in the colony. */
    map: "https://maps.google.com/?q=28.70228,77.22901",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=28.70228,77.22901",
    /**
     * TODO(client): no Facebook page URL has been supplied. It is deliberately
     * absent from `sameAs` rather than guessed — a wrong sameAs actively
     * misleads Google about which profiles are this business. Add it here and
     * it flows into the structured data automatically.
     */
    facebook: null as string | null,
  },
} as const;

/** Prefilled WhatsApp booking link. Kept short: people edit it before sending. */
export const WHATSAPP_RESERVE = `https://wa.me/${RESTAURANT.phone.whatsapp}?text=${encodeURIComponent(
  "Hello Machen La — I'd like to book a table.",
)}`;

export const NAV = [
  { href: "/menu", label: "Menu" },
  { href: "/story", label: "Story" },
  { href: "/gallery", label: "Gallery" },
  { href: "/visit", label: "Visit" },
] as const;
