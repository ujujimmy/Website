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
    /**
     * One number for both branches. Written in international form: the salon
     * gave it as 09002460594, where the leading zero is India's trunk prefix
     * and is dropped once +91 is in front of it.
     */
    phone: "+91 90024 60594",
    phoneHref: "tel:+919002460594",
    /**
     * Digits only, country code first — no +, no spaces. Every booking link on
     * the site is built from this, so a wrong format here breaks all of them.
     */
    whatsapp: "919002460594",
    /** TODO(salon): add an email to show one; the footer drops the line when empty. */
    email: "",
  },

  /**
   * The two branches, both in Majnu-ka-Tilla.
   *
   * TODO(salon): the shop number and street for each. What's here is the
   * neighbourhood — accurate, but not enough to walk to. Neither could be
   * verified from the build environment, and inventing one would send clients
   * to the wrong door. The directions links search Maps for each branch by name
   * until real addresses arrive.
   */
  locations: [
    {
      id: "salon",
      name: "DECHEN Salon",
      role: "The salon",
      street: "New Aruna Nagar, Majnu-ka-Tilla",
      locality: "Timarpur",
      region: "Delhi",
      postalCode: "110054",
      country: "IN",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Dechen+Salon+Majnu+ka+Tilla+New+Delhi",
      directionsUrl:
        "https://www.google.com/maps/dir/?api=1&destination=Dechen+Salon+Majnu+ka+Tilla+New+Delhi",
    },
    {
      id: "academy",
      name: "DECHEN Salon & Academy",
      role: "Salon and training academy",
      street: "New Aruna Nagar, Majnu-ka-Tilla",
      locality: "Timarpur",
      region: "Delhi",
      postalCode: "110054",
      country: "IN",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Dechen+Salon+%26+Academy+Majnu+ka+Tilla+New+Delhi",
      directionsUrl:
        "https://www.google.com/maps/dir/?api=1&destination=Dechen+Salon+%26+Academy+Majnu+ka+Tilla+New+Delhi",
    },
  ],

  /** `days` uses schema.org shorthand for the JSON-LD opening-hours spec. */
  hours: {
    display: "Every day, 9:00 am – 10:00 pm",
    note: "Walk-ins welcome. Colour and extensions are best booked ahead.",
    schema: [
      { days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"], opens: "09:00", closes: "22:00" },
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
 * The branch used wherever a page needs one address rather than the pair.
 */
export const primaryLocation = brand.locations[0];

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
