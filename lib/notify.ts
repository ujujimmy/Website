import "server-only";

/**
 * Outbound notification email via Resend.
 *
 * Shared by lead intake (lib/leads.ts) and subscription events
 * (lib/subscriptions.ts). Without RESEND_API_KEY / LEAD_NOTIFY_EMAIL this
 * no-ops and logs, so local development works unconfigured — and no caller
 * should ever fail its own job because the email didn't send.
 */
export async function sendNotification({
  subject,
  lines,
  replyTo,
}: {
  subject: string;
  /** `null` entries are dropped, so callers can inline conditionals. */
  lines: (string | null | undefined | false)[];
  replyTo?: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!key || !to) {
    console.info(
      "[notify] email skipped (RESEND_API_KEY/LEAD_NOTIFY_EMAIL unset):",
      subject,
    );
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL ?? "leads@resend.dev",
        to: [to],
        ...(replyTo ? { reply_to: replyTo } : {}),
        subject,
        text: lines.filter(Boolean).join("\n"),
      }),
    });
    if (!res.ok) {
      console.error("[notify] resend error:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[notify] send failed:", err);
  }
}
