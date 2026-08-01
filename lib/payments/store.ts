import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Subscription event log.
 *
 * Deliberately isolated behind one function so the storage can be swapped
 * without touching the webhook route — same pattern as lib/leads.ts.
 *
 * TODO(payments): on Vercel the filesystem is ephemeral and read-only at
 * runtime, so this write will fail there and the event will only survive in
 * the logs. Before taking real money, point `recordSubscriptionEvent` at a
 * real database (Vercel Postgres, Supabase) — you need a durable record of
 * who paid, when, and how much.
 */

export type SubscriptionEvent = {
  event: string;
  subscriptionId: string | null;
  paymentId: string | null;
  status: string | null;
  /** Razorpay sends the smallest currency unit: paise for INR, cents for USD. */
  amount: number | null;
  currency: string | null;
  email: string | null;
  raw: unknown;
};

const STORE = path.join(process.cwd(), ".data", "subscriptions.json");

export async function recordSubscriptionEvent(event: SubscriptionEvent) {
  const entry = { ...event, receivedAt: new Date().toISOString() };

  // Always log: this is the durable record until a database is wired up.
  console.info(
    "[razorpay]",
    entry.event,
    entry.subscriptionId ?? "-",
    entry.status ?? "-",
    entry.amount !== null ? `${entry.amount / 100} ${entry.currency}` : "",
    entry.email ?? "",
  );

  try {
    await fs.mkdir(path.dirname(STORE), { recursive: true });
    let existing: unknown[] = [];
    try {
      existing = JSON.parse(await fs.readFile(STORE, "utf8"));
    } catch {
      existing = [];
    }
    existing.push(entry);
    await fs.writeFile(STORE, JSON.stringify(existing, null, 2), "utf8");
  } catch (err) {
    // Swallow: the console line above is the fallback record, and throwing
    // here would make Razorpay retry an event we have already logged.
    console.error("[razorpay] could not persist event to disk:", err);
  }
}
