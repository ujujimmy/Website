import type { Metadata } from "next";
import { pages } from "@/content/copy";
import { images, lookbook } from "@/content/images";
import { PageHead } from "@/components/layout/PageHead";
import { Frame } from "@/components/ui/Frame";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { brand, whatsappLink, bookingMessage } from "@/content/brand";
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
        aside={
          <a
            href={brand.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="micro link-rule text-lacquer"
          >
            Our work on Instagram
          </a>
        }
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
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="t-section max-w-lg text-cream">
                Our own work is on Instagram.
              </h2>
              <p className="prose-measure mt-6">
                The photographs above are reference looks — the shots we work
                from at consultation. Everything we&rsquo;ve actually done sits
                on {brand.socials.instagramHandle}: before-and-afters, colour
                transformations, extension fittings and reels from the chair.
              </p>
              <div className="mt-9">
                <Button href={brand.socials.instagram} external>
                  See it on Instagram
                  <Arrow />
                </Button>
              </div>
            </div>

            <div className="lg:pt-3">
              <h2 className="t-sub text-cream">Bring us a photograph.</h2>
              <p className="prose-measure mt-5 text-sm">
                Any of these can be a starting point. Send one over and
                we&rsquo;ll tell you honestly what it takes on your hair, what it
                costs, and how long it holds.
              </p>
              <div className="mt-7">
                <Button
                  href={whatsappLink(bookingMessage)}
                  variant="line"
                  external
                >
                  Send it on WhatsApp
                  <Arrow />
                </Button>
              </div>
            </div>
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
