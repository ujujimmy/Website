"use client";

import { useEffect, useState } from "react";
import type { Currency } from "@/content/pricing";

const STORAGE_KEY = "nb:currency";

/**
 * Default to INR for visitors whose browser timezone is Indian, USD for
 * everyone else. Timezone is read locally via Intl — no IP lookup, no extra
 * network request, and nothing to slow down first paint.
 */
function detectCurrency(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    return tz === "Asia/Calcutta" || tz === "Asia/Kolkata" ? "INR" : "USD";
  } catch {
    return "USD";
  }
}

export function useCurrency() {
  // Always start USD so server and client markup match; correct after mount.
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Currency | null;
    setCurrencyState(stored === "INR" || stored === "USD" ? stored : detectCurrency());
    setReady(true);
  }, []);

  const setCurrency = (next: Currency) => {
    setCurrencyState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode — the choice just won't persist */
    }
  };

  return { currency, setCurrency, ready };
}

/**
 * Re-exported so client components keep a single import for currency
 * concerns. The implementation lives in lib/format.ts because server code
 * needs it too and cannot import from a `"use client"` module.
 */
export { formatPrice } from "@/lib/format";
