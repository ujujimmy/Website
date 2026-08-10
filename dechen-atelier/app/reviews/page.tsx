import type { Metadata } from "next";
import { pages } from "@/content/copy";
import { reviews, googleUrl } from "@/content/reviews";
import { PageHead } from "@/components/layout/PageHead";
import { ReviewsFeature } from "@/components/home/ReviewsFeature";
import { Button, Arrow } from "@/components/ui/Button";
import { whatsappLink, bookingMessage } from "@/content/brand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, reviewsLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What clients say about DECHEN Salon, Majnu-ka-Tilla — in full, with names.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <>
      <PageHead
        eyebrow={pages.reviews.eyebrow}
        title={pages.reviews.title}
        lead={pages.reviews.lead}
        aside={
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="micro link-rule text-lacquer"
          >
            Read more on Google
          </a>
        }
      />

      <div className="gutter pb-24">
        <ReviewsFeature />
      </div>

      <section className="bg-paper-2">
        <div className="gutter py-20 md:py-24">
          <h2 className="t-section max-w-2xl">
            {reviews.length === 2
              ? "Two reviews, not twenty."
              : "In their words."}
          </h2>
          <p className="prose-measure mt-6">
            We would rather publish the ones we can point at than fill a page.
            If we have done your hair, we would be glad of a line — and if we got
            something wrong, we would rather hear it from you first.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={whatsappLink(bookingMessage)} external>
              Book an appointment
              <Arrow />
            </Button>
            <Button href="/gallery" variant="line">
              See the work
            </Button>
          </div>
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
