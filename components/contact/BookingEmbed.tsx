"use client";

import { useState } from "react";
import { brand } from "@/content/brand";
import { Button } from "@/components/ui/Button";

/**
 * Booking calendar.
 *
 * Loads the scheduler's embed only after the visitor asks for it. A booking
 * widget is a third-party iframe pulling its own scripts, fonts and styles —
 * mounting it eagerly would put all of that on the critical path of a page
 * most people reach to read a contact detail. Click-to-load keeps Contact as
 * fast as the rest of the site and means no third-party cookies are set for
 * visitors who never open it.
 *
 * Both Calendly and Cal.com are supported, because which one is in use is a
 * business decision that should not need a code change:
 *
 *   NEXT_PUBLIC_BOOKING_URL   full scheduler URL, any provider
 *                             e.g. https://calendly.com/jigme/intro-call
 *   NEXT_PUBLIC_CAL_LINK      Cal.com handle only, e.g. "jigme/intro-call"
 *
 * Next.js inlines NEXT_PUBLIC_* at build time only where it can see the whole
 * identifier, so both are read literally here rather than through a variable.
 */
function useBookingUrl(): string | null {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;
  const calLink = process.env.NEXT_PUBLIC_CAL_LINK;

  if (bookingUrl) return bookingUrl;
  if (calLink) return `https://cal.com/${calLink}`;
  return null;
}

export function BookingEmbed() {
  const bookingUrl = useBookingUrl();
  const [open, setOpen] = useState(false);

  /**
   * No scheduler configured.
   *
   * This used to print "Booking isn't connected yet. Set
   * NEXT_PUBLIC_CAL_LINK…" — a note to whoever was building the site, shown
   * to every real visitor who reached Contact. It shipped, and anyone landing
   * here read a variable name instead of a way to reach anyone.
   *
   * A visitor who wants a call still needs somewhere to go, so this now
   * routes to the channels that actually work rather than explaining an
   * unfinished integration. WhatsApp leads because it is the one route
   * confirmed to reach someone, and it costs an overseas visitor nothing.
   */
  if (!bookingUrl) {
    return (
      <div className="glass rounded-[var(--radius-card)] p-7 sm:p-9">
        <h2 className="text-lg font-semibold">Book a call</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Message us and we&apos;ll find a time that suits you — no
          back-and-forth across timezones. Calls run {brand.hours}.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={brand.contact.whatsappHref}>Message on WhatsApp</Button>
          <Button href={`mailto:${brand.contact.email}`} variant="secondary">
            Email us
          </Button>
        </div>
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
            src={bookingUrl}
            title="Book a call"
            loading="lazy"
            className="h-[42rem] w-full"
          />
        </div>
      ) : (
        <>
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
          {/* The embed is a click away, so someone who would rather not sit in
              a scheduler at all still has a route out of this card. */}
          <p className="mt-4 text-xs text-faint">
            Prefer not to book?{" "}
            <a
              href={brand.contact.whatsappHref}
              className="text-brand-2 underline underline-offset-4"
            >
              Message us on WhatsApp
            </a>{" "}
            instead.
          </p>
        </>
      )}
    </div>
  );
}
