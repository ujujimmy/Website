import "server-only";
import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";
import { sendNotification } from "@/lib/notify";

/**
 * Lead intake. Storage is deliberately isolated behind `saveLead` so swapping
 * the JSON dev store for Postgres/Airtable/a CRM is a one-function change.
 */

export const leadSchema = z.object({
  // Step 1 — what they need
  service: z.enum(["reviews", "website", "seo", "everything"]),
  // Step 2 — the business
  business: z.string().min(2, "Please enter your business name").max(120),
  website: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  industry: z.string().max(80).optional(),
  // Step 3 — contact
  name: z.string().min(2, "Please enter your name").max(80),
  email: z.email("Please enter a valid email address").max(160),
  phone: z.string().max(40).optional(),
  country: z.string().min(2).max(60),
  notes: z.string().max(2000).optional(),
  // Anti-spam
  company_website: z.string().max(0).optional(), // honeypot: must stay empty
  startedAt: z.coerce.number().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type Lead = Omit<LeadInput, "company_website" | "startedAt"> & {
  id: string;
  createdAt: string;
  source: string;
};

const STORE = path.join(process.cwd(), ".data", "leads.json");

/**
 * Dev/default store: append-only JSON on disk.
 *
 * TODO(storage): on Vercel the filesystem is ephemeral and read-only at
 * runtime — swap this for Vercel Postgres, Supabase or an Airtable webhook
 * before launch. The email notification below is what actually reaches you in
 * the meantime, so lead capture still works even if this write fails.
 */
async function persist(lead: Lead) {
  try {
    await fs.mkdir(path.dirname(STORE), { recursive: true });
    let existing: Lead[] = [];
    try {
      existing = JSON.parse(await fs.readFile(STORE, "utf8")) as Lead[];
    } catch {
      existing = [];
    }
    existing.push(lead);
    await fs.writeFile(STORE, JSON.stringify(existing, null, 2), "utf8");
  } catch (err) {
    // Never fail the submission because the dev store is unavailable.
    console.error("[leads] persist failed:", err);
  }
}

/**
 * Email notification via Resend — see lib/notify.ts.
 *
 * TODO(email): set RESEND_API_KEY and LEAD_NOTIFY_EMAIL in the environment.
 * Without a key this no-ops and logs, so local development works unconfigured.
 */
async function notify(lead: Lead) {
  await sendNotification({
    subject: `New audit request — ${lead.business} (${lead.country})`,
    replyTo: lead.email,
    lines: [
      `Service: ${lead.service}`,
      `Business: ${lead.business}`,
      lead.website ? `Website: ${lead.website}` : null,
      lead.industry ? `Industry: ${lead.industry}` : null,
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      lead.phone ? `Phone: ${lead.phone}` : null,
      `Country: ${lead.country}`,
      lead.notes ? `\nNotes:\n${lead.notes}` : null,
    ],
  });
}

export type SaveResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function saveLead(
  raw: unknown,
  source = "audit",
): Promise<SaveResult> {
  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    };
  }

  const { company_website, startedAt, ...data } = parsed.data;

  // Honeypot: a real user never fills a visually hidden field.
  if (company_website) return { ok: true }; // silently discard

  // Timing check: humans take more than ~3s to complete a 3-step form.
  if (startedAt && Date.now() - startedAt < 3000) {
    return { ok: true }; // silently discard
  }

  const lead: Lead = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    source,
  };

  await Promise.all([persist(lead), notify(lead)]);
  return { ok: true };
}
