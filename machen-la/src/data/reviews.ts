/**
 * Lines drawn from real Google reviews.
 *
 * Paraphrased, with any direct quote kept very short and marked. Nothing here
 * is invented, and no reviewer is named — the site shows what people said, not
 * a stock photo of a face beside five gold stars.
 */

export type ReviewLine = {
  id: string;
  /** The paraphrase we print. */
  text: string;
  /** A short verbatim fragment, if there is one worth keeping. */
  quote: string | null;
  source: "Google review";
};

export const REVIEW_LINES: ReviewLine[] = [
  {
    id: "interiors",
    text: "Monastery-influenced interiors, spacious seating, indoors and out. One reviewer said walking in",
    quote: "takes you to the hills",
    source: "Google review",
  },
  {
    id: "food",
    text: "Momos that taste authentic, and the buff and green cabbage stir fry called light in flavour but delicious.",
    quote: null,
    source: "Google review",
  },
];
