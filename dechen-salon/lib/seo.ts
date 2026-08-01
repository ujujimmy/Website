import { brand } from "@/content/brand";
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
export function salonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": `${brand.url}/#salon`,
    name: brand.name,
    description: brand.description,
    url: brand.url,
    ...(brand.contact.email ? { email: brand.contact.email } : {}),
    telephone: brand.contact.phone,
    image: `${brand.url}/img/hero.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: brand.address.street,
      addressLocality: brand.address.locality,
      addressRegion: brand.address.region,
      postalCode: brand.address.postalCode,
      addressCountry: brand.address.country,
    },
    hasMap: brand.address.mapsUrl,
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
    hasOfferCatalog: {
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
    },
  };
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
    image: `${brand.url}/img/founder.jpg`,
    worksFor: { "@id": `${brand.url}/#salon` },
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
    itemReviewed: { "@id": `${brand.url}/#salon` },
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
