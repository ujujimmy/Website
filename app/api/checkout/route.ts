import { NextResponse } from "next/server";
import { z } from "zod";
import { createSubscription } from "@/lib/payments/razorpay";

/**
 * Starts a subscription.
 *
 * The body carries a tier id and the buyer's contact details — never a plan
 * id, a price or a currency amount. The server resolves the tier to a
 * Razorpay plan, so the amount is decided entirely on this side.
 */

const schema = z.object({
  tierId: z.enum(["reviews", "website", "seo", "complete"]),
  currency: z.enum(["USD", "INR"]),
  name: z.string().min(2).max(80),
  email: z.email().max(160),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your name and email." },
      { status: 400 },
    );
  }

  const result = await createSubscription({
    ...parsed.data,
    idempotencyKey: crypto.randomUUID(),
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  // Only the public key id goes back — never the secret.
  return NextResponse.json({
    subscriptionId: result.subscriptionId,
    keyId: result.keyId,
  });
}
