import type { Metadata } from "next";
import { Plate } from "@/components/Plate";
import { JsonLd } from "@/components/JsonLd";
import { MapEmbed } from "@/components/MapEmbed";
import { OpenNow } from "@/components/OpenNow";
import { IMAGES } from "@/data/images";
import { FAQS } from "@/data/faq";
import { RESTAURANT, WHATSAPP_RESERVE } from "@/data/site";
import { breadcrumbLd, faqLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Find us — Machen La Tibet Kitchen, Majnu ka Tilla, Delhi",
  description:
    "Machen La Tibet Kitchen, Rabsel House 47, Majnu-ka-Tilla, Delhi 110054. Open 7:30 AM to 10 PM every day. Directions from the bus stand, parking, and how to book a table.",
  path: "/visit",
});

export default function VisitPage() {
  return (
    <>
      <section className="mx-auto max-w-[76rem] px-5 pt-12 sm:px-8 sm:pt-16">
        <h1 className="font-display max-w-[20ch] text-display-l font-semibold text-wall">
          Finding Machen La in Majnu ka Tilla
        </h1>

        <div className="mt-10 grid gap-12 md:grid-cols-[1fr_auto] md:gap-16">
          <div>
            <address className="not-italic">
              <a
                href={RESTAURANT.links.map}
                target="_blank"
                rel="noopener noreferrer"
                className="block max-w-[30ch] font-display text-display-m font-medium text-wall underline decoration-rule underline-offset-8 hover:text-butter"
              >
                {RESTAURANT.address.full}
              </a>
            </address>

            <div className="hairline mt-10 border-t pt-6">
              <h2 className="font-mono text-meta uppercase text-wall-faint">Hours</h2>
              <p className="mt-3 font-mono text-price text-wall">
                {RESTAURANT.hours.human}
              </p>
              <OpenNow />
            </div>

            {/* Three big targets, in the thumb zone on a phone and unmissable on
                a desktop. These stay the primary route even with the map
                embedded below — an iframe shows you where the place is, but
                turn-by-turn happens in the app holding your GPS. */}
            <div className="mt-10 grid gap-3 sm:max-w-md">
              <a
                href={RESTAURANT.links.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-14 items-center justify-between bg-butter px-5 font-mono text-meta uppercase text-ink"
              >
                <span>Directions in Google Maps</span>
                <span aria-hidden="true">→</span>
              </a>
              <a
                href={`tel:${RESTAURANT.phone.tel}`}
                className="hairline flex min-h-14 items-center justify-between border px-5 font-mono text-meta uppercase text-wall hover:border-butter"
              >
                <span>Call {RESTAURANT.phone.display}</span>
                <span aria-hidden="true">→</span>
              </a>
              <a
                href={WHATSAPP_RESERVE}
                target="_blank"
                rel="noopener noreferrer"
                className="hairline flex min-h-14 items-center justify-between border px-5 font-mono text-meta uppercase text-wall hover:border-butter"
              >
                <span>Book a table on WhatsApp</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <p className="mt-6 font-mono text-meta uppercase text-wall-faint">
              {RESTAURANT.geo.lat}, {RESTAURANT.geo.lng}
            </p>
          </div>

          <div className="md:border-l md:border-[color:var(--color-rule)] md:pl-16">
            <Plate
              slot={IMAGES.frontage}
              sizes="(max-width: 640px) 100vw, 420px"
              maxWidth={416}
            />
            <p className="mt-4 max-w-[32ch] font-mono text-meta uppercase text-wall-faint">
              What to look for from the lane
            </p>
          </div>
        </div>
      </section>

      {/* ═══ THE MAP ══════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] px-5 pt-20 sm:px-8 sm:pt-24">
        <MapEmbed />
      </section>

      {/* ═══ THE WALK IN ══════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] px-5 pt-24 sm:px-8 sm:pt-32">
        <h2 className="font-display text-display-l font-medium text-wall">
          The walk in
        </h2>
        <div className="mt-8 max-w-[58ch] space-y-6 text-body text-wall-dim">
          <p>
            Majnu ka Tilla is a dense settlement of narrow lanes and the address
            does less work than the walk does. Traffic stops at the edge — come in
            on foot from the main road, follow the lane past the shops, and you
            are in the colony within a minute.
          </p>
          <p>
            We are at Rabsel House 47, in New Aruna Colony. If the numbering
            defeats you, ask anyone for Machen La. It is a small settlement and
            people will point.
          </p>
          <p>
            Coming off a bus from Dharamsala or Manali, you are already at the
            right end of the city — the terminus is at the edge of the colony and
            we are a short walk inside it.
          </p>
        </div>
      </section>

      {/* ═══ FAQ ══════════════════════════════════════════════════════════
          The same array renders the page and the FAQPage structured data, so
          the two can never drift apart.
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] px-5 pt-24 sm:px-8 sm:pt-32">
        <h2 className="font-display text-display-l font-medium text-wall">
          Questions people ask
        </h2>

        <dl className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
          {FAQS.map((faq) => (
            <div key={faq.q} className="hairline border-t pt-5">
              <dt className="font-display text-display-m font-medium text-wall">
                {faq.q}
              </dt>
              <dd className="mt-3 max-w-[48ch] text-body text-wall-dim">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <JsonLd data={faqLd()} />
      <JsonLd data={breadcrumbLd([{ name: "Visit", path: "/visit" }])} />
    </>
  );
}
