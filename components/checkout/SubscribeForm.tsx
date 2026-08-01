"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Tier } from "@/content/pricing";
import { brand } from "@/content/brand";
import { formatPrice } from "@/lib/format";
import { ButtonEl } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Mirrors the schema in app/api/razorpay/subscription/route.ts for instant
 * feedback. The server re-validates everything — this copy is convenience,
 * never the security boundary. (Same arrangement as AuditForm.)
 */
const schema = z.object({
  business: z.string().min(2, "Please enter your business name"),
  name: z.string().min(2, "Please enter your name"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().optional(),
  notes: z.string().optional(),
  company_website: z.string().optional(), // honeypot
});

type FormValues = z.infer<typeof schema>;

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

/** Minimal shape of the bits of Razorpay Checkout we actually touch. */
type CheckoutResponse = {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = {
  open: () => void;
  on: (event: string, handler: (payload: unknown) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

/**
 * Load Checkout on demand rather than on page load — it's a third-party
 * script on a site that cares about its Lighthouse score, and nobody who
 * doesn't click "Pay" ever needs it.
 */
let scriptPromise: Promise<void> | null = null;

function loadCheckout() {
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${CHECKOUT_SRC}"]`,
    );
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener(
      "error",
      () => {
        // Let a later attempt retry instead of caching the failure forever.
        scriptPromise = null;
        // Ad blockers and strict corporate proxies do block this script, so
        // the message needs to point at the actual likely cause.
        reject(
          new Error(
            "The payment window couldn't load. Check your connection or any " +
              "ad blocker, then try again.",
          ),
        );
      },
      { once: true },
    );
    if (!existing) {
      script.src = CHECKOUT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return scriptPromise;
}

export function SubscribeForm({
  tier,
  testMode,
}: {
  tier: Tier;
  testMode: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "creating" | "checkout" | "verifying"
  >("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  // Guards the async callbacks below from touching state after unmount.
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const busy = status !== "idle";

  const firstCharge =
    tier.price.INR + (tier.setup?.INR ?? 0);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setStatus("creating");

    try {
      await loadCheckout();

      const res = await fetch("/api/razorpay/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, plan: tier.id }),
      });

      const data = (await res.json()) as {
        subscriptionId?: string;
        keyId?: string;
        error?: string;
      };

      if (!res.ok || !data.subscriptionId || !data.keyId) {
        throw new Error(data.error ?? "We couldn't start the payment.");
      }

      if (!alive.current) return;
      openCheckout(data.subscriptionId, data.keyId);
    } catch (err) {
      if (!alive.current) return;
      setStatus("idle");
      setServerError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  const openCheckout = (subscriptionId: string, keyId: string) => {
    const Checkout = window.Razorpay;
    if (!Checkout) {
      setStatus("idle");
      setServerError("Payment window failed to load. Please refresh and retry.");
      return;
    }

    const values = getValues();
    setStatus("checkout");

    const checkout = new Checkout({
      key: keyId,
      subscription_id: subscriptionId,
      name: brand.name,
      description: `${tier.name} — ${formatPrice(tier.price.INR, "INR")}/month`,
      prefill: {
        name: values.name,
        email: values.email,
        ...(values.phone ? { contact: values.phone } : {}),
      },
      notes: { tier: tier.id, business: values.business },
      theme: { color: "#6d5cf6" },
      handler: (response: CheckoutResponse) => {
        void verify(response);
      },
      modal: {
        // Customer closed the modal without paying — back to the form, no
        // error, because nothing actually went wrong.
        ondismiss: () => {
          if (alive.current) setStatus("idle");
        },
      },
    });

    checkout.on("payment.failed", (payload: unknown) => {
      const reason = (
        payload as { error?: { description?: string } } | undefined
      )?.error?.description;
      if (!alive.current) return;
      setStatus("idle");
      setServerError(
        reason ?? "That payment didn't go through. Please try another method.",
      );
    });

    checkout.open();
  };

  const verify = async (response: CheckoutResponse) => {
    if (alive.current) setStatus("verifying");

    try {
      const res = await fetch("/api/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      });
      const data = (await res.json()) as { ok?: boolean };

      if (!data.ok) {
        if (!alive.current) return;
        setStatus("idle");
        setServerError(
          "Your payment went through, but we couldn't verify it automatically. " +
            "Please email us and we'll sort it out straight away — don't pay again.",
        );
        return;
      }
    } catch {
      // The mandate is authorised at this point; a failed verification call is
      // our problem, not theirs, and the webhook will still record it. Send
      // them to the success page rather than implying the payment failed.
      console.error("[razorpay] verification request failed");
    }

    router.push(`/subscribe/success?plan=${tier.id}`);
  };

  const label = {
    idle: `Set up ${formatPrice(firstCharge, "INR")} first payment`,
    creating: "Preparing…",
    checkout: "Waiting for payment…",
    verifying: "Confirming…",
  }[status];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="glass rounded-[var(--radius-card)] p-7 sm:p-9"
    >
      <h2 className="text-xl font-semibold">Your details</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        We need these for the invoice and to know whose account to set up.
      </p>

      {testMode && (
        <p className="mt-5 rounded-xl border border-line bg-ink-2/80 px-4 py-3 text-xs leading-relaxed text-faint">
          <strong className="font-semibold text-brand-2">Test mode.</strong>{" "}
          Razorpay is using test keys — no real money will move.
        </p>
      )}

      {/* Honeypot — visually hidden, never announced, must stay empty. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="rzp_company_website">Do not fill this in</label>
        <input
          id="rzp_company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company_website")}
        />
      </div>

      <div className="mt-6 flex flex-col gap-5">
        <Field label="Business name" error={errors.business?.message} required>
          <input
            type="text"
            autoComplete="organization"
            placeholder="Rivera Dental"
            {...register("business")}
            className={inputClass}
          />
        </Field>

        <Field label="Your name" error={errors.name?.message} required>
          <input
            type="text"
            autoComplete="name"
            {...register("name")}
            className={inputClass}
          />
        </Field>

        <Field label="Email" error={errors.email?.message} required>
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            {...register("email")}
            className={inputClass}
          />
        </Field>

        <Field
          label="Phone"
          hint="Optional, but Razorpay sends mandate reminders by SMS."
          error={errors.phone?.message}
        >
          <input
            type="tel"
            autoComplete="tel"
            {...register("phone")}
            className={inputClass}
          />
        </Field>

        <Field label="Anything we should know?" hint="Optional">
          <textarea
            rows={3}
            placeholder="Your website, locations, anything urgent."
            {...register("notes")}
            className={cn(inputClass, "resize-y")}
          />
        </Field>
      </div>

      {serverError && (
        <p role="alert" className="mt-5 text-sm text-danger">
          {serverError}
        </p>
      )}

      <ButtonEl type="submit" disabled={busy} className="mt-8 w-full">
        {label}
      </ButtonEl>

      {/* Announce progress for screen readers without a visual duplicate. */}
      <span aria-live="polite" className="sr-only">
        {busy ? label : ""}
      </span>

      <p className="mt-5 text-xs leading-relaxed text-faint">
        You&apos;ll authorise a monthly mandate with Razorpay — card, UPI
        AutoPay or net banking. Cancel any time with 30 days notice; we never
        see your card details.
      </p>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-line bg-ink-2/80 px-4 py-3 text-[0.95rem] " +
  "text-fg placeholder:text-faint transition-colors focus:border-brand-2 " +
  "focus:outline-none";

function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-brand-2">
            *
          </span>
        )}
      </span>
      {children}
      {hint && !error && <span className="text-xs text-faint">{hint}</span>}
      {error && (
        <span role="alert" className="text-xs text-danger">
          {error}
        </span>
      )}
    </label>
  );
}
