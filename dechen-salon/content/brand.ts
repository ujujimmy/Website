/**
 * SINGLE SWAP POINT for everything salon-specific.
 *
 * The name, tagline, philosophy and positioning below are the salon's own words,
 * taken from the printed catalog. The contact details marked TODO could not be
 * verified — dechensalon.com was unreachable from the build environment — and
 * must be confirmed with the salon before this site goes live.
 */

export const brand = {
  name: "DECHEN Salon",
  shortName: "DECHEN",
  legalName: "Dechen Salon",
  tagline: "Where Passion Meets Purpose",

  /** One sentence. Used in metadata, OG cards and JSON-LD. */
  description:
    "A women-led, Tibetan-owned salon in Majnu-ka-Tilla, New Delhi. Hair colour, extensions, cuts and bond repair by India's first Master Hair Extensions Trainer, using vegan, cruelty-free products.",

  url: "https://dechensalon.com",
  domain: "dechensalon.com",

  contact: {
    /** TODO(salon): confirm the number clients should actually reach you on. */
    phone: "+91 00000 00000",
    phoneHref: "tel:+910000000000",
    /** TODO(salon): confirm. Digits only, country code first — no +, no spaces. */
    whatsapp: "910000000000",
    /** TODO(salon): confirm, or delete and the footer drops the email line. */
    email: "",
  },

  address: {
    /** TODO(salon): confirm the exact shop number and street. */
    street: "New Aruna Nagar, Majnu-ka-Tilla",
    locality: "Timarpur",
    region: "Delhi",
    postalCode: "110054",
    country: "IN",
    /** TODO(salon): paste the salon's own Google Maps share link. */
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Dechen+Salon+Majnu+ka+Tilla+Delhi",
  },

  /**
   * TODO(salon): confirm hours and the weekly off day.
   * `days` uses schema.org shorthand for the JSON-LD opening-hours spec.
   */
  hours: {
    display: "Every day, 10:00 am – 8:00 pm",
    note: "Walk-ins welcome. Colour and extensions are best booked ahead.",
    schema: [
      { days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"], opens: "10:00", closes: "20:00" },
    ],
  },

  socials: {
    instagram: "https://www.instagram.com/dechensalon",
    instagramHandle: "@dechensalon",
  },

  /** Booking is deliberately call/WhatsApp only — no form, no scheduler. */
  primaryCta: { label: "Book on WhatsApp", href: "/visit" },
} as const;

/**
 * Builds a WhatsApp deep link with the message pre-filled, so a client who taps
 * "Book" next to Balayage arrives in the chat with the service already named and
 * the salon knows what the enquiry is about before saying hello.
 */
export function whatsappLink(message?: string) {
  const base = `https://wa.me/${brand.contact.whatsapp}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/** The default enquiry, used by the floating button and the header CTA. */
export const bookingMessage = `Hi ${brand.shortName}! I'd like to book an appointment.`;

/** Service-specific enquiry. */
export function serviceMessage(service: string) {
  return `Hi ${brand.shortName}! I'd like to book ${service}.`;
}
