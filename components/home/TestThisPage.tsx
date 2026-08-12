"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { brand } from "@/content/brand";

const pagespeed = (url: string) =>
  `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}`;

/**
 * "Test this page" — the one button on the site that has to work.
 *
 * It used to build the PageSpeed link from `brand.url`, a placeholder domain
 * that doesn't resolve. So the single button sitting under the words "you
 * don't have to take our word for it" sent every visitor to an error page.
 *
 * Reading the address from the browser instead makes it correct wherever the
 * site is actually served — the Vercel preview today, a real domain later —
 * with no config to remember to update. The server-rendered href falls back
 * to `brand.url` so the button is never empty for a crawler or a visitor
 * without JavaScript; the effect corrects it on mount.
 */
export function TestThisPage() {
  const [href, setHref] = useState(() => pagespeed(brand.url));

  useEffect(() => {
    // origin + pathname: query strings and hashes would only confuse the
    // report, and PageSpeed treats them as distinct URLs.
    setHref(pagespeed(window.location.origin + window.location.pathname));
  }, []);

  return (
    <Button
      href={href}
      variant="secondary"
      target="_blank"
      rel="noopener noreferrer"
    >
      Test this page
    </Button>
  );
}
