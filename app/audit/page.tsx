import type { Metadata } from "next";
import { AuditForm } from "@/components/forms/AuditForm";
import { Eyebrow } from "@/components/ui/Section";
import { Stars } from "@/components/ui/Stars";
import { testimonials } from "@/content/proof";
import { brand } from "@/content/brand";

export const metadata: Metadata = {
  title: "Free Google & Website Audit",
  description:
    "Get a free written audit of your Google Business Profile, website speed and search visibility — benchmarked against your three closest local competitors.",
  alternates: { canonical: "/audit" },
};

const included = [
  {
    title: "Your Google profile vs. 3 competitors",
    body: "Rating, review count and velocity, category setup, and exactly where you sit in the map pack for your main service.",
  },
  {
    title: "Website speed & technical check",
    body: "Real mobile load time, Core Web Vitals, and the specific things slowing it down — plus whether it's worth fixing or rebuilding.",
  },
  {
    title: "The searches you're missing",
    body: "Buying-intent keywords in your area that you don't currently rank for, and who's taking that traffic instead.",
  },
];

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  const testimonial = testimonials[0];

  return (
    <main className="pb-28 pt-36 sm:pt-44">
      <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        {/* Sell side */}
        <div>
          <Eyebrow>Free audit</Eyebrow>
          <h1 className="mt-5 text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.06]">
            Find out what&apos;s costing you customers.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Tell us about your business and we&apos;ll send back a written audit
            within two business days. A real person looks at it — this
            isn&apos;t an automated PDF.
          </p>

          <ul className="mt-10 flex flex-col gap-6">
            {included.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/15"
                >
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-none stroke-brand-2 stroke-[2.5]">
                    <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>
                  <span className="block font-medium">{item.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">
                    {item.body}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-7 text-sm text-faint">
            <span>No call required</span>
            <span aria-hidden="true">·</span>
            <span>Yours to keep</span>
            <span aria-hidden="true">·</span>
            <span>No obligation</span>
          </div>

          <figure className="mt-10 border-l-2 border-brand/40 pl-5">
            <Stars count={testimonial.rating} size={14} />
            <blockquote className="mt-3 text-sm leading-relaxed text-fg/85">
              “{testimonial.quote}”
            </blockquote>
            <figcaption className="mt-3 text-xs text-faint">
              {testimonial.name}, {testimonial.company} · {testimonial.location}
            </figcaption>
          </figure>
        </div>

        {/* Form side */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <AuditForm defaultPlan={plan} />
          <p className="mt-5 text-center text-xs text-faint">
            Prefer to talk first?{" "}
            <a
              href={`mailto:${brand.contact.email}`}
              className="text-brand-2 underline underline-offset-4"
            >
              {brand.contact.email}
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
