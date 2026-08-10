import { reviews } from "@/content/reviews";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Two reviews, in full, with names.
 *
 * There are two because there are two. A wall of short invented quotes is the
 * cheapest thing on the internet and the first thing a careful client checks —
 * these are real, named people, and the length is part of why they read that
 * way.
 */
export function ReviewsFeature() {
  return (
    <div className="flex flex-col gap-14 md:gap-20">
      {reviews.map((review, i) => (
        <Reveal key={review.author} delay={i * 0.06}>
          <figure>
            <blockquote className="t-quote max-w-3xl">
              &ldquo;{review.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-line pt-4">
              <span className="text-sm font-medium">{review.author}</span>
              <span className="micro text-muted">{review.service}</span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
