import "server-only";
import crypto from "node:crypto";
import { tiers, type Tier } from "@/content/pricing";

/**
 * Razorpay Subscriptions.
 *
 * Deliberately talks to the REST API over `fetch` rather than pulling in the
 * `razorpay` npm package — the surface we need is three endpoints and two
 * HMACs, and this keeps the server bundle (and the dependency audit) small.
 * Same reasoning as the Resend call in lib/notify.ts.
 *
 * Billing is INR-only. Razorpay accounts are INR-native and charging USD
 * needs International Payments activated separately, so the pricing page can
 * *display* USD while checkout always collects the INR figure.
 *
 * Money crosses three boundaries here and each uses a different unit:
 *   content/pricing.ts  → whole rupees   (15000)
 *   Razorpay API        → paise          (1500000)
 *   the customer's card → whatever the *dashboard plan* says
 * The third one is the dangerous one — the amount actually charged lives in
 * the Razorpay dashboard, not in this repo. `assertPlanMatchesTier` below
 * refuses to create a subscription when the two disagree.
 */

const API = "https://api.razorpay.com/v1";

/** Razorpay works in paise; every amount we send must be an integer. */
export const toPaise = (rupees: number) => Math.round(rupees * 100);

export class RazorpayError extends Error {
  constructor(
    message: string,
    readonly status = 500,
    /** True when the cause is our own configuration, not the customer. */
    readonly isConfigError = false,
  ) {
    super(message);
    this.name = "RazorpayError";
  }
}

/* ------------------------------------------------------------------ config */

type Credentials = { keyId: string; keySecret: string };

export function credentials(): Credentials | null {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) return null;
  return { keyId, keySecret };
}

/** `rzp_live_…` vs `rzp_test_…` — surfaced in the UI so test mode is obvious. */
export function isLiveMode() {
  return credentials()?.keyId.startsWith("rzp_live_") ?? false;
}

/**
 * Plan IDs are created in the Razorpay dashboard (Subscriptions → Plans) and
 * pasted into the environment. There is no API-side way to derive them, so a
 * tier with no plan ID configured simply isn't purchasable yet.
 */
const PLAN_ENV: Record<Tier["id"], string> = {
  starter: "RAZORPAY_PLAN_STARTER",
  growth: "RAZORPAY_PLAN_GROWTH",
  authority: "RAZORPAY_PLAN_AUTHORITY",
};

export function planIdFor(tierId: Tier["id"]): string | null {
  return process.env[PLAN_ENV[tierId]]?.trim() || null;
}

/**
 * Which tiers can actually be paid for right now. Server-only — pass the
 * result down to client components as a prop so the UI never advertises a
 * checkout that would 500 on click.
 */
export function payableTierIds(): Tier["id"][] {
  if (!credentials()) return [];
  return tiers.filter((tier) => planIdFor(tier.id)).map((tier) => tier.id);
}

/**
 * Razorpay requires a finite number of billing cycles up front; monthly plans
 * cap at 100. 60 is five years, which is well past the point where the
 * engagement gets renegotiated anyway.
 */
function totalCount() {
  const raw = Number(process.env.RAZORPAY_TOTAL_COUNT);
  if (!Number.isInteger(raw) || raw < 1 || raw > 100) return 60;
  return raw;
}

/* --------------------------------------------------------------- transport */

async function api<T>(
  path: string,
  init: { method?: "GET" | "POST"; body?: unknown } = {},
): Promise<T> {
  const creds = credentials();
  if (!creds) {
    throw new RazorpayError("Razorpay is not configured.", 503, true);
  }

  const auth = Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString(
    "base64",
  );

  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      method: init.method ?? "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: "no-store",
    });
  } catch (err) {
    console.error("[razorpay] network error:", path, err);
    throw new RazorpayError("Could not reach Razorpay. Please try again.", 502);
  }

  const text = await res.text();
  const json = text ? safeJson(text) : null;

  if (!res.ok) {
    const description =
      (json as { error?: { description?: string } } | null)?.error
        ?.description ?? text.slice(0, 300);
    // Razorpay's own messages are merchant-facing, not customer-facing, so
    // they go to the log and the caller decides what the customer sees.
    console.error("[razorpay] api error:", res.status, path, description);
    throw new RazorpayError(description || "Razorpay request failed.", res.status);
  }

  return json as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------ price safety */

type RazorpayPlan = {
  id: string;
  period: string;
  interval: number;
  item: { amount: number; currency: string; name: string };
};

/** Validated plan IDs, cached for the process lifetime. */
const verifiedPlans = new Set<string>();

/**
 * Guard against the dashboard and content/pricing.ts drifting apart.
 *
 * Without this, editing a price in the repo silently changes what the site
 * *advertises* while Razorpay keeps charging the old amount — the customer
 * agrees to one number and their card is debited another. One extra API call
 * per checkout (cached after the first) is a cheap price for that.
 *
 * Set RAZORPAY_SKIP_PLAN_PRICE_CHECK=1 if you intentionally run promotional
 * plans that differ from the list price.
 */
async function assertPlanMatchesTier(planId: string, tier: Tier) {
  if (process.env.RAZORPAY_SKIP_PLAN_PRICE_CHECK === "1") return;
  if (verifiedPlans.has(planId)) return;

  const plan = await api<RazorpayPlan>(`/plans/${planId}`);
  const expected = toPaise(tier.price.INR);

  const problems = [
    plan.item.currency !== "INR" &&
      `currency is ${plan.item.currency}, expected INR`,
    plan.item.amount !== expected &&
      `amount is ${plan.item.amount} paise, but ${tier.name} is listed at ₹${tier.price.INR} (${expected} paise)`,
    plan.period !== "monthly" &&
      `period is "${plan.period}", but the site advertises monthly billing`,
    plan.interval !== 1 && `interval is ${plan.interval}, expected 1`,
  ].filter(Boolean);

  if (problems.length) {
    throw new RazorpayError(
      `Razorpay plan ${planId} does not match the ${tier.name} tier: ${problems.join("; ")}.`,
      500,
      true,
    );
  }

  verifiedPlans.add(planId);
}

/* ----------------------------------------------------------- subscriptions */

type RazorpaySubscription = {
  id: string;
  status: string;
  short_url?: string;
  plan_id: string;
};

export type SubscriptionDraft = {
  tier: Tier;
  name: string;
  email: string;
  phone?: string;
  business: string;
  notes?: string;
};

/**
 * Create a subscription for a tier and return what the browser needs to open
 * Razorpay Checkout. Nothing is charged here — the customer authorises the
 * mandate in the checkout modal, and the first invoice (setup fee included)
 * is raised on activation.
 */
export async function createSubscription(draft: SubscriptionDraft): Promise<{
  subscriptionId: string;
  keyId: string;
  shortUrl?: string;
}> {
  const creds = credentials();
  if (!creds) {
    throw new RazorpayError("Razorpay is not configured.", 503, true);
  }

  const planId = planIdFor(draft.tier.id);
  if (!planId) {
    throw new RazorpayError(
      `No Razorpay plan configured for the ${draft.tier.name} tier (${PLAN_ENV[draft.tier.id]}).`,
      503,
      true,
    );
  }

  await assertPlanMatchesTier(planId, draft.tier);

  // A one-time setup fee rides along as an addon, so it lands on the first
  // invoice instead of needing a separate payment the customer has to chase.
  const setup = draft.tier.setup?.INR;
  const addons = setup
    ? [
        {
          item: {
            name: `${draft.tier.name} — one-time setup`,
            amount: toPaise(setup),
            currency: "INR",
          },
        },
      ]
    : undefined;

  const subscription = await api<RazorpaySubscription>("/subscriptions", {
    method: "POST",
    body: {
      plan_id: planId,
      total_count: totalCount(),
      quantity: 1,
      // Let Razorpay send its own mandate/receipt emails and SMS.
      customer_notify: 1,
      ...(addons ? { addons } : {}),
      notify_info: {
        notify_email: draft.email,
        ...(draft.phone ? { notify_phone: draft.phone } : {}),
      },
      // Notes come back on every webhook, which is what ties a Razorpay
      // subscription to a human without a customer table on our side.
      notes: {
        tier: draft.tier.id,
        business: draft.business.slice(0, 250),
        name: draft.name.slice(0, 250),
        email: draft.email.slice(0, 250),
        ...(draft.phone ? { phone: draft.phone } : {}),
        ...(draft.notes ? { notes: draft.notes.slice(0, 250) } : {}),
      },
    },
  });

  return {
    subscriptionId: subscription.id,
    // Safe to hand to the browser: the key ID is the public half of the pair.
    keyId: creds.keyId,
    shortUrl: subscription.short_url,
  };
}

export async function fetchSubscription(id: string) {
  return api<RazorpaySubscription & Record<string, unknown>>(
    `/subscriptions/${encodeURIComponent(id)}`,
  );
}

/* -------------------------------------------------------------- signatures */

function hmac(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/** Constant-time compare that tolerates a wrong-length attacker input. */
function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verify the handshake Checkout hands back in its success callback.
 *
 * Note the payload order: subscriptions sign `payment_id|subscription_id`,
 * which is the *reverse* of the one-time-order flow's `order_id|payment_id`.
 * Getting this backwards fails every payment, so don't "fix" it.
 */
export function verifyCheckoutSignature({
  paymentId,
  subscriptionId,
  signature,
}: {
  paymentId: string;
  subscriptionId: string;
  signature: string;
}) {
  const creds = credentials();
  if (!creds) return false;
  return safeEqual(
    hmac(`${paymentId}|${subscriptionId}`, creds.keySecret),
    signature,
  );
}

/**
 * Verify a webhook against the raw request body. Must be the exact bytes
 * Razorpay sent — re-serialising parsed JSON changes the digest.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!secret || !signature) return false;
  return safeEqual(hmac(rawBody, secret), signature);
}
