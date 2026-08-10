import type { Metadata } from "next";
import { pages } from "@/content/copy";
import { images, lookbook } from "@/content/images";
import { PageHead } from "@/components/layout/PageHead";
import { Frame } from "@/components/ui/Frame";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { whatsappLink, bookingMessage } from "@/content/brand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Lookbook",
  description:
    "Balayage, babylights, ash tones, layered cuts and extensions — the lookbook from DECHEN Salon, Majnu-ka-Tilla, New Delhi.",
  alternates: { canonical: "/gallery" },
};

/**
 * A staggered two-column grid rather than a even one: alternate items are
 * pushed down, which stops fourteen crops of the same subject reading as a
 * contact sheet.
 */
export default function GalleryPage() {
  return (
    <>
      <PageHead
        eyebrow={pages.gallery.eyebrow}
        title={pages.gallery.title}
        lead={pages.gallery.lead}
      />

      <div className="gutter pb-24">
        <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
          {lookbook.map((key, i) => {
            const img = images[key];
            return (
              <Reveal
                as="li"
                variant="wipe"
                key={key}
                delay={(i % 3) * 0.06}
                className={i % 2 === 1 ? "sm:mt-12" : ""}
              >
                <Frame
                  img={img}
                  ratio="tall"
                  sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 33vw"
                />
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  {img.alt}
                </p>
              </Reveal>
            );
          })}
        </ul>
      </div>

      <section className="on-ink">
        <div className="gutter py-20 md:py-24">
          <h2 className="t-section max-w-2xl text-cream">
            Bring us a photograph.
          </h2>
          <p className="prose-measure mt-6">
            Any of these can be a starting point. Send it over and we&rsquo;ll
            tell you honestly what it takes on your hair, what it costs, and how
            long it holds.
          </p>
          <div className="mt-9">
            <Button href={whatsappLink(bookingMessage)} external>
              Send it on WhatsApp
              <Arrow />
            </Button>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Lookbook", path: "/gallery" },
        ])}
      />
    </>
  );
}
