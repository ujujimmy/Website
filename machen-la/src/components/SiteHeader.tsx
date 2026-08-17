import Link from "next/link";
import { NAV } from "@/data/site";
import { WordmarkLink } from "./Wordmark";

/**
 * No hamburger. Four links fit on a 360px screen at label size, so hiding them
 * behind a button would cost a tap and a JavaScript bundle to solve a problem
 * this site does not have.
 *
 * Two rows on a phone, one row from md up.
 */
export function SiteHeader() {
  return (
    <header className="hairline border-b">
      <div className="mx-auto flex max-w-[76rem] flex-col gap-1 px-5 py-4 sm:px-8 md:flex-row md:items-center md:justify-between md:py-6">
        <WordmarkLink />
        <nav aria-label="Main">
          {/* -mx-2 keeps the optical alignment while px-2 pushes every link
              past 48px on its short side — "Menu" is only 38px of glyph. */}
          <ul className="-mx-2 flex items-center gap-2 sm:gap-4">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-12 items-center px-2 font-mono text-meta uppercase text-wall-dim transition-colors hover:text-wall focus-visible:text-wall"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
