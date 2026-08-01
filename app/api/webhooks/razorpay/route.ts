import { NextResponse } from "next/server";
import { getRazorpayConfig, verifyWebhookSignature } from "@/lib/payments/razorpay";
import { recordSubscriptionEvent } from "@/lib/payments/store";

/**
 * Razorpay webhook receiver — the ONLY thing that should ever mark a
 * subscription as paid.
 *
 * A browser landing on a success page proves nothing; anyone can open that
 * URL. This endpoint reads the raw body (not the parsed JSON, because the
 * signature is over the exact bytes Razorpay sent), verifies the HMAC, and
 * only then records anything.
 *
 * Configure in Razorpay dashboard → Settings → Webhooks:
 *   URL:    https://yourdomain.com/api/webhooks/razorpay
 *   Events: subscription.activated, subscription.charged,
 *           subscription.halted, subscription.cancelled, payment.failed
 */

// Webhooks must never be served from cache.
export const dynamic = "force-dynamic";

const HANDLED = new Set([
  "subscription.activated",
  "subscription.charged",
  "subscription.halted",
  "subscription.cancelled",
  "subscription.completed",
  "payment.failed",
]);

export async function POST(request: Request) {
  const config = getRazorpayConfig();
  if (!config) {
    console.error("[razorpay] webhook hit but payments are not configured");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  // Raw text, not request.json(): the signature covers the exact bytes, so
  // re-serialising parsed JSON would produce a different string and fail.
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(rawBody, signature, config.webhookSecret)) {
    // Do not echo anything useful to an attacker probing the endpoint.
    console.warn("[razorpay] rejected webhook with bad signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: {
    event?: string;
    payload?: {
      subscription?: { entity?: Record<string, unknown> };
      payment?: { entity?: Record<string, unknown> };
    };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const name = event.event ?? "unknown";
  if (!HANDLED.has(name)) {
    // Acknowledge anything we don't act on, or Razorpay keeps retrying it.
    return NextResponse.json({ received: true });
  }

  const subscription = event.payload?.subscription?.entity;
  const payment = event.payload?.payment?.entity;

  try {
    await recordSubscriptionEvent({
      event: name,
      subscriptionId: (subscription?.id as string) ?? null,
      paymentId: (payment?.id as string) ?? null,
      status: (subscription?.status as string) ?? null,
      amount: (payment?.amount as number) ?? null,
      currency: (payment?.currency as string) ?? null,
      email:
        ((subscription?.notes as Record<string, string> | undefined)?.email) ??
        (payment?.email as string) ??
        null,
      raw: event,
    });
  } catch (err) {
    // Returning 500 makes Razorpay retry, which is what we want if our own
    // storage failed — the event is not lost.
    console.error("[razorpay] failed to record event:", err);
    return NextResponse.json({ error: "Storage failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
