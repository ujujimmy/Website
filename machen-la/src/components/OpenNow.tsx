"use client";

import { useEffect, useState } from "react";
import { RESTAURANT } from "@/data/site";

const OPENS = 7 * 60 + 30; // 07:30 IST
const CLOSES = 22 * 60; // 22:00 IST

function minutesNowIST(): number {
  // Asia/Kolkata explicitly, not the visitor's clock. Someone checking from
  // London at 3am needs to know whether the kitchen in Delhi is open, not
  // whether it would be open in London.
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

/**
 * The live open/closed strip.
 *
 * Server-rendered as the plain hours line, then upgraded to live status after
 * mount. Two reasons it works this way: a static export has no server clock to
 * render against, and the fallback is genuinely useful on its own, so a visitor
 * with JS blocked still gets the hours rather than an empty box.
 *
 * The strip has a fixed height in both states, so the upgrade costs no layout
 * shift.
 */
export function OpenNow() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = minutesNowIST();
      setOpen(now >= OPENS && now < CLOSES);
    };
    tick();
    // Once a minute is plenty; this only matters within a minute of 7:30 or 10.
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="flex h-11 items-center gap-3 font-mono text-meta uppercase text-wall-dim">
      {open !== null && (
        <span
          aria-hidden="true"
          className={`block size-1.5 rounded-full ${open ? "bg-butter" : "bg-wall/30"}`}
        />
      )}
      <span>
        {open === null
          ? RESTAURANT.hours.human
          : open
            ? `Open now · until 10 PM`
            : `Closed · opens 7:30 AM`}
      </span>
      <span className="hidden text-wall-faint sm:inline">
        {RESTAURANT.hours.short} IST, every day
      </span>
    </p>
  );
}
