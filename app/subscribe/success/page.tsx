import type { Metadata } from "next";
import { tiers } from "@/content/pricing";
import { brand } from "@/content/brand";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Payment confirmed",
  description: "Your plan is active.",
  robots: { index: false, follow: false },
};

export default async function SubscribeSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  const tier = tiers.find((t) => t.id === plan);

  const next = [
    {
      step: "Now",
      body: "Razorpay has emailed your mandate confirmation and receipt. That's your proof of the monthly amount and the date it recurs.",
    },
    {
      step: "Within one business day",
      body: "We email you a kickoff questionnaire and a link to book the onboarding call. Nothing starts moving until we've talked.",
    },
    {
      step: "Week one",
      body: "Google Business Profile audit and the first round of fixes go live. You'll see the changes as we make them, not in a report a month later.",
    },
  ];

  return (
    <main className="flex min-h-screen items-center py-32">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span
            aria-hidden="true"
            className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-linear-to-br from-brand to-brand-2"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 fill-none stroke-ink stroke-[2.5]"
            >
              <path
                d="M5 12.5l4.5 4.5L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <h1 className="mt-8 text-4xl font-semibold leading-tight sm:text-5xl">
            You&apos;re on{tier ? ` ${tier.name}` : " board"}.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Payment authorised and your monthly mandate is set up. Here&apos;s
            what happens next.
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

        <div className="mt-12 flex justify-center">
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </div>

        <p className="mt-10 text-center text-sm text-faint">
          Receipt not arrived, or something look wrong?{" "}
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
