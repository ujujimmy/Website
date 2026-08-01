import { reviews, googleUrl } from "@/content/reviews";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Client reviews.
 *
 * There are two, and they are shown as two. A wall of invented testimonials
 * would be the fastest way to lose a client who checks — and these two are
 * good, specific and named.
 */
export function Reviews({ limit }: { limit?: number }) {
  const shown = limit ? reviews.slice(0, limit) : reviews;

  return (
    <Section id="reviews">
      <SectionHead
        eyebrow="In our clients' words"
        title="What people say after."
        center
      />

      <ul className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
        {shown.map((review, i) => (
          <Reveal as="li" key={review.author} delay={i * 0.08}>
            <figure className="panel flex h-full flex-col">
              <span aria-hidden="true" className="font-display text-5xl leading-none text-rose-deep">
                &ldquo;
              </span>
              <blockquote className="-mt-3 flex-1 text-[0.95rem] leading-relaxed text-muted">
                {review.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-line pt-5">
                <span className="block font-semibold text-ink">{review.author}</span>
                <span className="mt-0.5 block text-xs text-gold-ink">
                  {review.service}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>

      <div className="mt-10 text-center">
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border-b border-gold-ink/40 pb-1 text-sm font-medium text-gold-ink transition-colors hover:border-gold-ink"
        >
          Find us on Google
        </a>
      </div>
    </Section>
  );
}
