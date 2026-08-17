import Link from "next/link";
import { NAV, RESTAURANT } from "@/data/site";

/**
 * NAP — name, address, phone — as visible text on every page, spelled exactly
 * as it is spelled on the Google Business Profile. This is the single strongest
 * local-SEO signal a small restaurant site has, and it only works if the string
 * matches character for character everywhere it appears. It is stored once in
 * src/data/site.ts for that reason. Do not reformat it here.
 */
export function SiteFooter() {
  return (
    <footer className="hairline mt-24 border-t">
      <div className="mx-auto grid max-w-[76rem] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
        <div>
          <p className="font-display text-display-m font-medium text-wall">
            {RESTAURANT.name}
          </p>
          <address className="mt-4 not-italic">
            <a
              href={RESTAURANT.links.map}
              target="_blank"
              rel="noopener noreferrer"
              className="block max-w-[34ch] text-body text-wall-dim underline decoration-rule underline-offset-4 hover:text-wall"
            >
              {RESTAURANT.address.full}
            </a>
            <a
              href={`tel:${RESTAURANT.phone.tel}`}
              className="mt-4 flex min-h-12 items-center font-mono text-price text-butter"
            >
              {RESTAURANT.phone.display}
            </a>
          </address>
        </div>

        <div>
          <h2 className="font-mono text-meta uppercase text-wall-faint">Hours</h2>
          <p className="mt-4 font-mono text-body text-wall">
            {RESTAURANT.hours.short}
          </p>
          <p className="mt-1 text-body text-wall-dim">Every day, including Sunday.</p>
          <p className="mt-4 max-w-[28ch] text-body text-wall-dim">
            The first kitchen open in Majnu ka Tilla.
          </p>
        </div>

        <div>
          <h2 className="font-mono text-meta uppercase text-wall-faint">Pages</h2>
          <ul className="mt-4 space-y-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center text-body text-wall-dim hover:text-wall"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={RESTAURANT.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center text-body text-wall-dim hover:text-wall"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="hairline border-t">
        <p className="mx-auto max-w-[76rem] px-5 py-6 font-mono text-meta uppercase text-wall-faint sm:px-8">
          Majnu-ka-Tilla, Delhi
        </p>
      </div>
    </footer>
  );
}
