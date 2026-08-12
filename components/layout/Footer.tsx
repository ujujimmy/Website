import Link from "next/link";
import { brand } from "@/content/brand";
import { footerNav } from "@/content/site";
import { Button } from "@/components/ui/Button";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-ink-2/80">
      <div className="container-page py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <p className="text-xl font-semibold tracking-tight">{brand.name}</p>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-muted">
              {brand.description}
            </p>

            <div className="mt-4 flex flex-col text-base">
              <a
                href={`mailto:${brand.contact.email}`}
                className="inline-flex min-h-11 items-center text-muted transition-colors hover:text-fg"
              >
                {brand.contact.email}
              </a>
              <a
                href={brand.contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center text-muted transition-colors hover:text-fg"
              >
                WhatsApp {brand.contact.whatsapp}
              </a>
              {/* Omitted until a real line exists — see content/brand.ts. */}
              {brand.contact.phoneHref && brand.contact.phone && (
                <a
                  href={brand.contact.phoneHref}
                  className="inline-flex min-h-11 items-center text-muted transition-colors hover:text-fg"
                >
                  {brand.contact.phone}
                </a>
              )}
              {/* Stating the hours plainly beats letting a US buyer wonder. */}
              <p className="text-faint">{brand.hours}</p>
            </div>

            <Button href={brand.primaryCta.href} size="sm" className="mt-7">
              {brand.primaryCta.label}
            </Button>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-faint">
                  {group.title}
                </h2>
                <ul className="mt-2 flex flex-col">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-11 min-w-11 items-center text-base text-muted transition-colors hover:text-fg"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.legalName}. {brand.locations.join(" · ")}.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            {Object.entries(brand.socials).map(([key, href]) => (
              <a
                key={key}
                href={href}
                rel="noopener noreferrer"
                target="_blank"
                className="inline-flex min-h-11 min-w-11 items-center justify-center capitalize transition-colors hover:text-fg"
              >
                {key}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
