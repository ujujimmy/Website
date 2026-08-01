import "server-only";
import crypto from "node:crypto";
import { tiers, type Currency } from "@/content/pricing";

/**
 * Razorpay Subscriptions.
 *
 * Three rules hold this together, and none of them should be relaxed:
 *
 * 1. `RAZORPAY_KEY_SECRET` is server-only. It never reaches the browser and is
 *    never returned from an API route. Only the public key id is exposed.
 * 2. The browser sends a tier id, never a plan id or an amount. The server
 *    maps tier -> plan, so a visitor editing the request cannot subscribe
 *    themselves to a cheaper plan or a price of their choosing.
 * 3. Nothing is treated as paid until a webhook arrives AND its HMAC
 *    signature verifies. A browser redirect proves nothing — anyone can hit
 *    the success URL directly.
 */

const API = "https://api.razorpay.com/v1";

export type RazorpayConfig = {
  keyId: string;
  keySecret: string;
  webhookSecret: string;
};

/** Returns null when payments aren't configured, so the site degrades cleanly. */
export function getRazorpayConfig(): RazorpayConfig | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!keyId || !keySecret || !webhookSecret) return null;
  return { keyId, keySecret, webhookSecret };
}

function authHeader({ keyId, keySecret }: RazorpayConfig) {
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
}

/** Resolves a tier id + currency to a configured plan. Never trusts the client. */
export function resolvePlan(tierId: string, currency: Currency) {
  const tier = tiers.find((t) => t.id === tierId);
  if (!tier) return null;
  const planId = tier.razorpayPlanId?.[currency];
  if (!planId) return null;
  return { tier, planId };
}

export type CreateSubscriptionInput = {
  tierId: string;
  currency: Currency;
  email: string;
  name: string;
  /** Distinct per attempt; makes a double-submit safe. */
  idempotencyKey: string;
};

export type CreateSubscriptionResult =
  | { ok: true; subscriptionId: string; keyId: string }
  | { ok: false; error: string };

export async function createSubscription(
  input: CreateSubscriptionInput,
): Promise<CreateSubscriptionResult> {
  const config = getRazorpayConfig();
  if (!config) return { ok: false, error: "Payments are not configured yet." };

  const resolved = resolvePlan(input.tierId, input.currency);
  if (!resolved) {
    return { ok: false, error: "That plan isn't available for this currency." };
  }

  try {
    const res = await fetch(`${API}/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: authHeader(config),
        "Content-Type": "application/json",
        // Razorpay dedupes on this, so a double-click cannot create two subs.
        "X-Razorpay-Idempotency-Key": input.idempotencyKey,
      },
      body: JSON.stringify({
        plan_id: resolved.planId,
        // Monthly plan billed indefinitely until cancelled. 120 months is
        // Razorpay's practical maximum for an open-ended subscription.
        total_count: 120,
        customer_notify: 1,
        notes: {
          tier: resolved.tier.name,
          email: input.email,
          name: input.name,
        },
      }),
    });

    const body = await res.json();
    if (!res.ok) {
      // Razorpay's message can name internal config; log it, don't surface it.
      console.error("[razorpay] create subscription failed:", body);
      return { ok: false, error: "Could not start the subscription. Please try again." };
    }

    return { ok: true, subscriptionId: body.id, keyId: config.keyId };
  } catch (err) {
    console.error("[razorpay] create subscription threw:", err);
    return { ok: false, error: "Could not reach the payment provider." };
  }
}

/**
 * Verifies a Razorpay webhook signature.
 *
 * Uses a timing-safe comparison: a plain `===` on an HMAC leaks information
 * through how long the comparison takes, which is enough to forge a signature
 * given enough attempts.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
  webhookSecret: string,
): boolean {
  if (!signature) return false;

  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Verifies the signature Razorpay Checkout hands back in the browser.
 *
 * Useful for showing an immediate confirmation, but it is NOT proof of
 * payment for your records — treat the webhook as the source of truth.
 */
export function verifyCheckoutSignature(
  params: { subscriptionId: string; paymentId: string; signature: string },
  keySecret: string,
): boolean {
  const expected = crypto
    .createHmac("sha256", keySecret)
    // Razorpay signs payment_id + "|" + subscription_id for subscriptions.
    .update(`${params.paymentId}|${params.subscriptionId}`)
    .digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(params.signature, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
