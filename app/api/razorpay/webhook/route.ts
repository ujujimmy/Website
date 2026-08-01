import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { recordSubscriptionEvent } from "@/lib/subscriptions";
import { tiers } from "@/content/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Razorpay webhook receiver — the authoritative signal that money moved.
 *
 * Point Razorpay at https://<domain>/api/razorpay/webhook (Dashboard →
 * Settings → Webhooks), set the same secret in RAZORPAY_WEBHOOK_SECRET, and
 * subscribe to the events in HANDLED below.
 *
 * Two rules this file exists to honour:
 *  1. The signature is computed over the *raw* body. `request.text()` gives
 *     us those exact bytes; parsing and re-serialising would change them.
 *  2. Always answer 2xx once the signature checks out. A non-2xx makes
 *     Razorpay retry, and a bug in our own handling shouldn't cause a retry
 *     storm — we log and move on instead.
 */

const HANDLED = new Set([
  "subscription.activated",
  "subscription.charged",
  "subscription.pending",
  "subscription.halted",
  "subscription.cancelled",
  "subscription.completed",
  "payment.failed",
]);

/**
 * Razorpay retries on timeout, so the same event can arrive twice.
 *
 * TODO(idempotency): in-process and lost on restart, which makes it a
 * best-effort duplicate filter rather than a guarantee. Persist the event ID
 * alongside the subscription record when this moves to a real database.
 */
const seen = new Set<string>();
const SEEN_LIMIT = 1000;

type WebhookBody = {
  event?: string;
  payload?: {
    subscription?: { entity?: Record<string, unknown> };
    payment?: { entity?: Record<string, unknown> };
  };
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    // Also the path taken when RAZORPAY_WEBHOOK_SECRET is unset — refusing
    // unverifiable events beats recording forged ones.
    console.warn("[razorpay] webhook rejected: bad or missing signature");
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  let body: WebhookBody;
  try {
    body = JSON.parse(rawBody) as WebhookBody;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = body.event ?? "unknown";

  // Razorpay's delivery ID is the stable per-delivery key.
  const deliveryId = request.headers.get("x-razorpay-event-id");
  if (deliveryId) {
    if (seen.has(deliveryId)) return NextResponse.json({ ok: true });
    if (seen.size >= SEEN_LIMIT) seen.clear();
    seen.add(deliveryId);
  }

  if (!HANDLED.has(event)) {
    // Subscribing to extra events in the dashboard shouldn't produce errors.
    return NextResponse.json({ ok: true, ignored: event });
  }

  try {
    const subscription = body.payload?.subscription?.entity ?? {};
    const payment = body.payload?.payment?.entity ?? {};

    const subscriptionId =
      (subscription.id as string | undefined) ??
      (payment.subscription_id as string | undefined);

    if (!subscriptionId) {
      // payment.failed fires for non-subscription payments too; nothing to do.
      return NextResponse.json({ ok: true, ignored: "no subscription id" });
    }

    const notes = (subscription.notes ?? payment.notes ?? {}) as Record<
      string,
      string
    >;

    await recordSubscriptionEvent({
      type: event,
      source: "webhook",
      subscriptionId,
      paymentId: payment.id as string | undefined,
      tier: tiers.find((t) => t.id === notes.tier)?.id,
      customer: {
        name: notes.name,
        email: notes.email ?? (payment.email as string | undefined),
        phone: notes.phone ?? (payment.contact as string | undefined),
        business: notes.business,
      },
      amount: payment.amount as number | undefined,
    });
  } catch (err) {
    // Swallow deliberately: see rule 2 above.
    console.error("[razorpay] webhook handling failed:", event, err);
  }

  return NextResponse.json({ ok: true });
}
