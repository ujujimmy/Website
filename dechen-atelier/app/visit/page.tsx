import type { Metadata } from "next";
import { pages } from "@/content/copy";
import {
  brand,
  primaryLocation,
  whatsappLink,
  bookingMessage,
} from "@/content/brand";
import { images } from "@/content/images";
import { PageHead } from "@/components/layout/PageHead";
import { Locations } from "@/components/layout/Locations";
import { Frame } from "@/components/ui/Frame";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Visit",
  description: `${brand.name} — two locations in ${primaryLocation.street}, ${primaryLocation.region}. ${brand.hours.display}. Book by phone or WhatsApp.`,
  alternates: { canonical: "/visit" },
};

export default function VisitPage() {
  const rows = [
    { label: "Hours", value: brand.hours.display },
    {
      label: "Phone",
      value: (
        <a className="link-rule" href={brand.contact.phoneHref}>
          {brand.contact.phone}
        </a>
      ),
    },
    {
      label: "WhatsApp",
      value: (
        <a
          className="link-rule"
          href={whatsappLink(bookingMessage)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {brand.contact.phone}
        </a>
      ),
    },
    {
      label: "Instagram",
      value: (
        <a
          className="link-rule"
          href={brand.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
        >
          {brand.socials.instagramHandle}
        </a>
      ),
    },
  ];

  return (
    <>
      <PageHead
        eyebrow={pages.visit.eyebrow}
        title={pages.visit.title}
        lead={pages.visit.lead}
      />

      {/* Both branches first: it is the question this page exists to answer. */}
      <section className="gutter pb-16 md:pb-20">
        <h2 className="micro mb-8 text-lacquer">Two locations</h2>
        <Locations />
      </section>

      <div className="gutter pb-20 md:pb-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-20">
          <div>
            <h2 className="micro mb-8 text-lacquer">
              Same hours, same number, either address
            </h2>

            <dl>
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-x-8 gap-y-1 border-t border-line py-5 sm:grid-cols-[8rem_minmax(0,1fr)]"
                >
                  <dt className="micro pt-1 text-muted">{row.label}</dt>
                  <dd className="text-sm leading-relaxed">{row.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
              {brand.hours.note}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={whatsappLink(bookingMessage)} external>
                Book on WhatsApp
                <Arrow />
              </Button>
              <Button href={brand.contact.phoneHref} variant="line">
                Call the salon
              </Button>
            </div>
          </div>

          <Reveal variant="wipe">
            {/* Eager: on a desktop viewport this sits beside the contact list,
                inside the first screen, so lazy-loading it makes it the
                largest-contentful-paint element *and* delays it. */}
            <Frame
              img={images.cutsBanner}
              ratio="portrait"
              sizes="(max-width: 64rem) 100vw, 26rem"
              priority
            />
          </Reveal>
        </div>
      </div>

      <section className="on-ink">
        <div className="gutter py-20 md:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="t-section max-w-lg text-cream">
                No forms, no booking app.
              </h2>
              <p className="prose-measure mt-6">
                Message or call, and a person answers. Tell us roughly what you
                want, which of the two you&rsquo;d rather come to, and what your
                hair has had done to it before — that is genuinely all we need to
                give you a time and a price.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:pt-2">
              <div className="border-t border-line-dark pt-4">
                <p className="micro text-brass">Walk in for</p>
                <p className="mt-3 text-sm leading-relaxed text-dim">
                  Cuts, blowdries, hair wash and blast dry, a head massage.
                </p>
              </div>
              <div className="border-t border-line-dark pt-4">
                <p className="micro text-brass">Message ahead for</p>
                <p className="mt-3 text-sm leading-relaxed text-dim">
                  Colour, balayage, extensions, nanoplastia, Olaplex.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Visit", path: "/visit" },
        ])}
      />
    </>
  );
}
