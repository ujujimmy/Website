"use client";

import { useState } from "react";
import { brand } from "@/content/brand";
import { Button } from "@/components/ui/Button";

/**
 * Booking calendar.
 *
 * Loads Cal.com's embed only after the visitor asks for it. A booking widget
 * is a third-party iframe pulling its own scripts, fonts and styles — mounting
 * it eagerly would put all of that on the critical path of a page most people
 * reach to read a phone number. Click-to-load keeps Contact as fast as the
 * rest of the site and means no third-party cookies are set for visitors who
 * never open it.
 *
 * TODO(booking): set NEXT_PUBLIC_CAL_LINK to your Cal.com handle, e.g.
 * "northbound/intro-call". Until then this shows the email fallback instead of
 * an embed that would 404.
 */
export function BookingEmbed() {
  const calLink = process.env.NEXT_PUBLIC_CAL_LINK;
  const [open, setOpen] = useState(false);

  if (!calLink) {
    return (
      <div className="glass rounded-[var(--radius-card)] p-7 sm:p-9">
        <h2 className="text-lg font-semibold">Book a call</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Pick a time that suits you and it lands in both our calendars — no
          back-and-forth across timezones. Calls run {brand.hours}.
        </p>
        <p className="mt-5 rounded-xl border border-line bg-ink-2/70 p-4 text-xs leading-relaxed text-faint">
          Booking isn&apos;t connected yet. Set{" "}
          <code className="text-brand-2">NEXT_PUBLIC_CAL_LINK</code> to your
          Cal.com handle to switch this on. Until then, email works fine.
        </p>
        <Button
          href={`mailto:${brand.contact.email}`}
          variant="secondary"
          className="mt-6"
        >
          Email us instead
        </Button>
      </div>
    );
  }

  return (
    <div className="glass rounded-[var(--radius-card)] p-7 sm:p-9">
      <h2 className="text-lg font-semibold">Book a call</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Pick a time that suits you and it lands in both our calendars — no
        back-and-forth across timezones. Times show in your own timezone, and
        calls run {brand.hours}.
      </p>

      {open ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-line">
          <iframe
            src={`https://cal.com/${calLink}?theme=dark`}
            title="Book a call"
            loading="lazy"
            className="h-[42rem] w-full"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-linear-to-r from-brand to-brand-2 px-6 text-[0.95rem] font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
        >
          Show available times
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current stroke-[2]" aria-hidden="true">
            <path d="M4 10h11M11 5.5L15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
