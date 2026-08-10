import Link from "next/link";
import { brand, whatsappLink, bookingMessage } from "@/content/brand";
import { footerNav } from "@/content/nav";
import { Wordmark } from "./Wordmark";
import { Button, Arrow } from "@/components/ui/Button";

/**
 * The footer is the last spread of the book: the mark set very large, the
 * contact details a visitor actually came for, and the index of everything
 * else in small type underneath.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-ink">
      <div className="gutter py-16 md:py-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="micro mb-5 text-brass">Book by message or phone</p>
            <p className="t-sub display max-w-md text-cream">
              We answer on WhatsApp, usually within the hour.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href={whatsappLink(bookingMessage)} external>
              WhatsApp
              <Arrow />
            </Button>
            <Button href={brand.contact.phoneHref} variant="line">
              {brand.contact.phone}
            </Button>
          </div>
        </div>
      </div>

      <div className="gutter">
        <div className="rule" />
      </div>

      <div className="gutter grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="micro mb-4 text-brass">Find us</p>

          {/* Both branches get their own directions link. They share a street
              and a phone line, so only the name and the link differ. */}
          <ul className="flex flex-col gap-4">
            {brand.locations.map((location) => (
              <li key={location.id}>
                <p className="text-sm text-cream">{location.name}</p>
                <address className="mt-1 text-sm leading-relaxed text-dim not-italic">
                  {location.street}, {location.region} {location.postalCode}
                </address>
                <a
                  href={location.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-rule mt-1.5 inline-block text-sm text-brass"
                >
                  Get directions
                  <span className="sr-only"> to {location.name}</span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-sm leading-relaxed text-dim">
            {brand.hours.display}
          </p>
          <a
            href={brand.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="link-rule mt-3 inline-block text-sm text-cream"
          >
            {brand.socials.instagramHandle}
          </a>
        </div>

        {footerNav.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="micro mb-4 text-brass">{column.title}</p>
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-rule text-sm text-dim transition-colors duration-500 hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="gutter">
        <div className="rule" />
      </div>

      <div className="gutter flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <Wordmark size="lg" className="text-cream" />
        <p className="text-xs text-dim">
          &copy; {year} {brand.legalName}. {brand.tagline}.
        </p>
      </div>
    </footer>
  );
}
