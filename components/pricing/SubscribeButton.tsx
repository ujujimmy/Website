"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonEl } from "@/components/ui/Button";
import type { Tier, Currency } from "@/content/pricing";

/**
 * Subscribe button.
 *
 * Loads Razorpay's checkout script only when the visitor actually clicks —
 * it's a third-party script, and mounting it on a page most people only read
 * would put it on the critical path for nothing.
 *
 * When a tier has no configured plan ID, this renders the ordinary enquiry
 * CTA instead. That's the default today: for a service at this price point,
 * scoping the work before taking a card is usually the right order anyway.
 */

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadCheckout(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function SubscribeButton({
  tier,
  currency,
}: {
  tier: Tier;
  currency: Currency;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<{ name: string; email: string } | null>(
    null,
  );

  const planId = tier.razorpayPlanId?.[currency];

  // No plan configured for this tier/currency — fall back to the enquiry flow.
  if (!planId) {
    return (
      <Button
        href={tier.cta.href}
        variant={tier.featured ? "primary" : "secondary"}
        className="mt-7 w-full"
      >
        {tier.cta.label}
      </Button>
    );
  }

  async function start(name: string, email: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId: tier.id, currency, name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      const ready = await loadCheckout();
      if (!ready || !window.Razorpay) {
        setError("Couldn't load the payment window. Check your connection.");
        return;
      }

      const checkout = new window.Razorpay({
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "Northbound",
        description: `${tier.name} — ${tier.cadence}`,
        prefill: { name, email },
        theme: { color: "#6d5cf6" },
        handler: () => {
          // Confirmation only. The webhook is what actually records the sale —
          // this callback can be triggered by anyone with the page open.
          router.push("/thank-you?subscribed=1");
        },
        modal: {
          ondismiss: () => setBusy(false),
        },
      });
      checkout.open();
    } catch {
      setError("Couldn't reach the payment provider.");
    } finally {
      setBusy(false);
    }
  }

  if (!details) {
    return (
      <div className="mt-7">
        <ButtonEl
          variant={tier.featured ? "primary" : "secondary"}
          className="w-full"
          onClick={() => setDetails({ name: "", email: "" })}
        >
          Subscribe to {tier.name}
        </ButtonEl>
      </div>
    );
  }

  return (
    <form
      className="mt-7 flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const name = String(form.get("name") ?? "").trim();
        const email = String(form.get("email") ?? "").trim();
        if (name.length < 2 || !email.includes("@")) {
          setError("Please enter your name and a valid email.");
          return;
        }
        start(name, email);
      }}
    >
      <input
        name="name"
        placeholder="Your name"
        autoComplete="name"
        aria-label="Your name"
        className="w-full rounded-xl border border-line bg-ink-2/80 px-4 py-2.5 text-sm text-fg placeholder:text-faint focus:border-brand-2 focus:outline-none"
      />
      <input
        name="email"
        type="email"
        placeholder="Your email"
        autoComplete="email"
        aria-label="Your email"
        className="w-full rounded-xl border border-line bg-ink-2/80 px-4 py-2.5 text-sm text-fg placeholder:text-faint focus:border-brand-2 focus:outline-none"
      />
      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
      <ButtonEl
        type="submit"
        variant={tier.featured ? "primary" : "secondary"}
        disabled={busy}
        className="w-full"
      >
        {busy ? "Opening…" : `Continue to payment`}
      </ButtonEl>
    </form>
  );
}
