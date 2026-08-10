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
          <address className="text-sm leading-relaxed text-dim not-italic">
            {brand.address.street}
            <br />
            {brand.address.locality}, {brand.address.region}{" "}
            {brand.address.postalCode}
          </address>
          <p className="mt-4 text-sm leading-relaxed text-dim">
            {brand.hours.display}
          </p>
          <a
            href={brand.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="link-rule mt-4 inline-block text-sm text-cream"
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
