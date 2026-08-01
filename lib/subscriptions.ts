import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { sendNotification } from "@/lib/notify";
import { tiers, type Tier } from "@/content/pricing";
import { formatPrice } from "@/lib/format";

/**
 * Subscription event log.
 *
 * Razorpay is the system of record for money — this is our copy, so you can
 * see who signed up without logging into the dashboard. Storage is isolated
 * behind `recordSubscriptionEvent` for the same reason lib/leads.ts isolates
 * `saveLead`: swapping the JSON file for a real database is a one-function
 * change.
 */

export type SubscriptionEvent = {
  id: string;
  createdAt: string;
  /** Razorpay event name, or "checkout.completed" from the browser callback. */
  type: string;
  subscriptionId: string;
  paymentId?: string;
  tier?: Tier["id"];
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    business?: string;
  };
  /** Amount in paise, as Razorpay reports it. */
  amount?: number;
  /** Where this came from — "checkout" (browser) or "webhook" (Razorpay). */
  source: "checkout" | "webhook";
};

const STORE = path.join(process.cwd(), ".data", "subscriptions.json");

/**
 * TODO(storage): same caveat as lib/leads.ts — Vercel's filesystem is
 * ephemeral and read-only at runtime, so this write is a no-op in production.
 * Point it at Postgres/Supabase before launch. Until then the notification
 * email below is what actually reaches you, and Razorpay's dashboard remains
 * the authoritative record either way.
 */
async function persist(event: SubscriptionEvent) {
  try {
    await fs.mkdir(path.dirname(STORE), { recursive: true });
    let existing: SubscriptionEvent[] = [];
    try {
      existing = JSON.parse(
        await fs.readFile(STORE, "utf8"),
      ) as SubscriptionEvent[];
    } catch {
      existing = [];
    }
    existing.push(event);
    await fs.writeFile(STORE, JSON.stringify(existing, null, 2), "utf8");
  } catch (err) {
    // Never fail a payment callback because the dev store is unavailable.
    console.error("[subscriptions] persist failed:", err);
  }
}

/** Only the events worth an inbox interruption. */
const NOTIFY_ON = new Set([
  "checkout.completed",
  "subscription.activated",
  "subscription.charged",
  "subscription.halted",
  "subscription.cancelled",
  "payment.failed",
]);

async function notify(event: SubscriptionEvent) {
  if (!NOTIFY_ON.has(event.type)) return;

  const tier = tiers.find((t) => t.id === event.tier);
  const who = event.customer?.business ?? event.customer?.email ?? "unknown";

  await sendNotification({
    subject: `Razorpay: ${event.type} — ${who}`,
    replyTo: event.customer?.email,
    lines: [
      `Event: ${event.type}`,
      `Subscription: ${event.subscriptionId}`,
      event.paymentId ? `Payment: ${event.paymentId}` : null,
      tier ? `Plan: ${tier.name} (₹${tier.price.INR}/month)` : null,
      event.amount !== undefined
        ? `Amount: ${formatPrice(event.amount / 100, "INR")}`
        : null,
      event.customer?.business ? `Business: ${event.customer.business}` : null,
      event.customer?.name ? `Name: ${event.customer.name}` : null,
      event.customer?.email ? `Email: ${event.customer.email}` : null,
      event.customer?.phone ? `Phone: ${event.customer.phone}` : null,
      `\nDashboard: https://dashboard.razorpay.com/app/subscriptions/${event.subscriptionId}`,
    ],
  });
}

export async function recordSubscriptionEvent(
  input: Omit<SubscriptionEvent, "id" | "createdAt">,
) {
  const event: SubscriptionEvent = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  await Promise.all([persist(event), notify(event)]);
  return event;
}
