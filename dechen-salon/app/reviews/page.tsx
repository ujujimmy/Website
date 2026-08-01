import type { Metadata } from "next";
import { reviews, googleUrl } from "@/content/reviews";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { whatsappLink, bookingMessage } from "@/content/brand";
import { JsonLd } from "@/components/JsonLd";
import { reviewsLd, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What clients say about DECHEN Salon in Majnu-ka-Tilla — high-end ethical products, a calming space, and colour by India's first Master Hair Extensions Trainer.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="In our clients' words"
        title="What people say after."
        sub="Two reviews, both real, both named. We would rather show you these than a wall of testimonials nobody can check."
      />

      <div className="px-6 pb-16">
        <ul className="mx-auto grid w-full max-w-4xl gap-5 md:grid-cols-2">
          {reviews.map((review, i) => (
            <Reveal as="li" key={review.author} delay={i * 0.08}>
              <figure className="panel flex h-full flex-col">
                <span
                  aria-hidden="true"
                  className="font-display text-6xl leading-none text-rose-deep"
                >
                  &ldquo;
                </span>
                <blockquote className="-mt-4 flex-1 text-base leading-relaxed text-muted">
                  {review.quote}
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-4 border-t border-line pt-6">
                  {/* A monogram rather than a stock avatar — we do not have
                      photographs of these clients and will not imply we do. */}
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-petal font-display text-lg text-gold-ink"
                  >
                    {review.author.charAt(0)}
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">
                      {review.author}
                    </span>
                    <span className="mt-0.5 block text-xs text-gold-ink">
                      {review.service}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>

      <section className="px-6 pb-24 text-center">
        <h2 className="text-2xl sm:text-3xl">Been in already?</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
          A review from you helps someone else in Majnu-ka-Tilla find us.
          It takes a minute, and it means a great deal.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={googleUrl} size="lg" variant="secondary" external>
            Leave a Google review
          </Button>
          <Button href={whatsappLink(bookingMessage)} size="lg" external>
            Book your next visit
            <Arrow />
          </Button>
        </div>
      </section>

      <JsonLd data={reviewsLd()} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Reviews", path: "/reviews" },
        ])}
      />
    </>
  );
}
