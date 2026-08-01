/**
 * Real client reviews, exactly as the salon printed them.
 *
 * There are two. That is the honest number, and two real reviews with names
 * attached convert better than a wall of invented ones — the first thing a
 * careful client does is check whether the person exists.
 *
 * TODO(salon): send more when you have them, and paste your Google review URL
 * into `googleUrl` below so the "read more" link points somewhere real.
 */

export type Review = {
  quote: string;
  author: string;
  service: string;
};

export const reviews: Review[] = [
  {
    quote:
      "Here is my honest review on Dechen Studio. Personally Dechen herself is such a sweet heart, lovely and hard working woman. She really cares about quality. They don't compromise — only high-end, ethical products. I had zero irritation, and the results were always fabulous. Their team is also extremely well-mannered, patient, and knowledgeable. Thank you for always making me feel so great at studio.",
    author: "Tenzin Mariko",
    service: "Haircut with Top Artist",
  },
  {
    quote:
      "Dechen is a true artist! She transformed my hair with the most beautiful balayage. I've never felt so confident. The salon has such a calming and positive energy.",
    author: "Living Tia",
    service: "Balayage with Creative Director",
  },
];

/** TODO(salon): replace with the salon's own Google reviews link. */
export const googleUrl =
  "https://www.google.com/maps/search/?api=1&query=Dechen+Salon+Majnu+ka+Tilla+Delhi";
