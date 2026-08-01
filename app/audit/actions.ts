"use server";

import { saveLead, type SaveResult } from "@/lib/leads";

/**
 * Server action for the audit form. All validation happens server-side in
 * `saveLead` — the client-side Zod check is only there for fast feedback and
 * can't be trusted.
 */
export async function submitAudit(data: unknown): Promise<SaveResult> {
  return saveLead(data, "audit");
}
