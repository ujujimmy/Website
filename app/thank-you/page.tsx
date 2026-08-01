import type { Metadata } from "next";
import { brand } from "@/content/brand";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Thanks — your audit is on the way",
  description: "We've received your request and will be in touch shortly.",
  // Conversion confirmation pages should never appear in search results.
  robots: { index: false, follow: false },
};

const next = [
  {
    step: "Now",
    body: "You'll get an email confirming we've got your details. If it doesn't arrive within a few minutes, check spam — and tell us, because that's worth knowing.",
  },
  {
    step: "Within 2 business days",
    body: "We send the written audit: your Google profile against three local competitors, your site's speed and technical issues, and the searches you're missing.",
  },
  {
    step: "After that",
    body: "We'll follow up once to ask if you have questions. If you'd rather we didn't, say so and we won't.",
  },
];

export default function ThankYouPage() {
  return (
    <main className="flex min-h-screen items-center py-32">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span
            aria-hidden="true"
            className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-linear-to-br from-brand to-brand-2"
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-ink stroke-[2.5]">
              <path d="M5 12.5l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>

          <h1 className="mt-8 text-4xl font-semibold leading-tight sm:text-5xl">
            Got it — your audit is being put together.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Thanks for the details. Here&apos;s exactly what happens next, so
            you&apos;re not left wondering.
          </p>
        </div>

        <ol className="mx-auto mt-14 flex max-w-2xl flex-col gap-5">
          {next.map((item) => (
            <li key={item.step} className="glass rounded-2xl p-6 text-left">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-2">
                {item.step}
              </span>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/work" variant="secondary">
            See what we&apos;ve done for others
          </Button>
          <Button href="/" variant="ghost">
            Back to home
          </Button>
        </div>

        <p className="mt-10 text-center text-sm text-faint">
          Something urgent?{" "}
          <a
            href={`mailto:${brand.contact.email}`}
            className="text-brand-2 underline underline-offset-4"
          >
            {brand.contact.email}
          </a>
        </p>
      </div>
    </main>
  );
}
