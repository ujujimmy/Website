import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyCheckoutSignature, fetchSubscription } from "@/lib/razorpay";
import { recordSubscriptionEvent } from "@/lib/subscriptions";
import { tiers } from "@/content/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Confirms the handshake Razorpay Checkout returns to the browser.
 *
 * This exists so we can show the customer a truthful success page — it is
 * *not* the authoritative record. The browser can close, the network can drop,
 * and a determined caller can POST here with anything. The webhook
 * (app/api/razorpay/webhook) is what actually tells us money moved; this
 * endpoint only proves the signature the modal handed back is genuine.
 */
const bodySchema = z.object({
  razorpay_payment_id: z.string().min(4).max(120),
  razorpay_subscription_id: z.string().min(4).max(120),
  razorpay_signature: z.string().min(16).max(256),
});

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const {
    razorpay_payment_id: paymentId,
    razorpay_subscription_id: subscriptionId,
    razorpay_signature: signature,
  } = parsed.data;

  if (!verifyCheckoutSignature({ paymentId, subscriptionId, signature })) {
    console.warn("[razorpay] checkout signature mismatch:", subscriptionId);
    return NextResponse.json(
      { ok: false, error: "Could not verify this payment." },
      { status: 400 },
    );
  }

  // Read the tier back off the subscription's notes rather than trusting the
  // browser to tell us which plan was bought.
  let tier: (typeof tiers)[number]["id"] | undefined;
  let customer: Record<string, string> | undefined;
  try {
    const subscription = await fetchSubscription(subscriptionId);
    const notes = (subscription.notes ?? {}) as Record<string, string>;
    tier = tiers.find((t) => t.id === notes.tier)?.id;
    customer = notes;
  } catch (err) {
    // A lookup failure must not turn a successful payment into an error page.
    console.error("[razorpay] subscription lookup failed:", err);
  }

  await recordSubscriptionEvent({
    type: "checkout.completed",
    source: "checkout",
    subscriptionId,
    paymentId,
    tier,
    customer: customer && {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      business: customer.business,
    },
  });

  return NextResponse.json({ ok: true, tier });
}
