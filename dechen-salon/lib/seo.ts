import { brand, primaryLocation } from "@/content/brand";
import { founder } from "@/content/founder";
import { chapters } from "@/content/menu";
import { reviews } from "@/content/reviews";

/**
 * Structured data.
 *
 * `HairSalon` is the specific schema.org type for this business — using the
 * generic `LocalBusiness` would throw away the category signal that matters
 * most for "hair salon near me" searches.
 */
/** The service catalogue, shared by both branches — they offer the same menu. */
function offerCatalog() {
  return {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: chapters.map((chapter) => ({
      "@type": "OfferCatalog",
      name: chapter.name,
      itemListElement: chapter.groups.flatMap((group) =>
        group.items.map((item) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `${group.title} — ${item.name}`,
          },
        })),
      ),
    })),
  };
}

/**
 * One `HairSalon` node per branch. Google treats each as its own place, which
 * is what puts both on the map for a local search; folding them into a single
 * node with two addresses would put neither there properly.
 */
export function salonLd() {
  return brand.locations.map((location, i) => ({
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": `${brand.url}/#${location.id}`,
    name: location.name,
    description: brand.description,
    url: brand.url,
    ...(brand.contact.email ? { email: brand.contact.email } : {}),
    telephone: brand.contact.phone,
    image: `${brand.url}/img/founder.webp`,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.street,
      addressLocality: location.locality,
      addressRegion: location.region,
      postalCode: location.postalCode,
      addressCountry: location.country,
    },
    hasMap: location.mapsUrl,
    sameAs: [brand.socials.instagram],
    openingHoursSpecification: brand.hours.schema.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: slot.days,
      opens: slot.opens,
      closes: slot.closes,
    })),
    founder: {
      "@type": "Person",
      name: founder.name,
      jobTitle: founder.role,
    },
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    hasOfferCatalog: offerCatalog(),
    ...(i > 0
      ? { parentOrganization: { "@id": `${brand.url}/#${primaryLocation.id}` } }
      : {}),
  }));
}

export function founderLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${brand.url}/founder#person`,
    name: founder.name,
    alternateName: founder.alsoKnownAs,
    jobTitle: founder.role,
    description: founder.short,
    image: `${brand.url}/img/founder.webp`,
    worksFor: { "@id": `${brand.url}/#${primaryLocation.id}` },
    knowsAbout: [
      "Hair extensions",
      "Balayage",
      "Corrective colour",
      "Bond repair",
      "Hair education",
    ],
  };
}

/**
 * Reviews are emitted as standalone `Review` nodes attached to the salon rather
 * than as an `aggregateRating`. We have two named reviews and no verified
 * average — inventing a rating figure to win a stars snippet is exactly the
 * kind of thing that gets structured data ignored, and it would not be true.
 */
export function reviewsLd() {
  return reviews.map((review) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@id": `${brand.url}/#${primaryLocation.id}` },
    reviewBody: review.quote,
    author: { "@type": "Person", name: review.author },
    about: review.service,
  }));
}

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${brand.url}${crumb.path}`,
    })),
  };
}
