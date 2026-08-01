import { NextResponse } from "next/server";
import { z } from "zod";
import { tiers } from "@/content/pricing";
import { createSubscription, RazorpayError } from "@/lib/razorpay";

/** node:crypto and the Buffer-based HMACs rule out the edge runtime. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  plan: z.enum(["starter", "growth", "authority"]),
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.email("Please enter a valid email address").max(160),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  business: z.string().trim().min(2, "Please enter your business name").max(120),
  notes: z.string().max(500).optional(),
  // Honeypot. Deliberately unconstrained here — a `max(0)` rule would name
  // the field in the validation errors and tell a bot exactly what to avoid.
  // It's checked (and rejected generically) after parsing instead.
  company_website: z.string().optional(),
});

/**
 * Best-effort in-process rate limit. Every call creates a real object in the
 * Razorpay account, so an unthrottled endpoint is an invitation to fill the
 * dashboard with junk subscriptions.
 *
 * TODO(ratelimit): per-instance and lost on restart. Move to Upstash/Redis if
 * this ever runs on more than one serverless instance.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup so the map can't grow without bound.
  if (hits.size > 500) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const { company_website, plan, ...customer } = parsed.data;

  // Honeypot: a real user never fills a visually hidden field. Answer with a
  // plausible-looking failure rather than revealing the trap.
  if (company_website) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const tier = tiers.find((t) => t.id === plan);
  if (!tier) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }

  try {
    const result = await createSubscription({ tier, ...customer });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof RazorpayError) {
      // Misconfiguration is our problem, not the customer's — log the detail
      // and show them something they can act on.
      if (err.isConfigError) {
        console.error("[razorpay] configuration error:", err.message);
        return NextResponse.json(
          {
            error:
              "Card payments aren't available right now. Please get in touch and we'll send an invoice.",
          },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: "We couldn't start the payment. Please try again." },
        { status: err.status >= 500 ? 502 : 400 },
      );
    }

    console.error("[razorpay] unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
