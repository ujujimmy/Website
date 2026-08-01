import Link from "next/link";
import { footerNav } from "@/content/nav";
import { brand } from "@/content/brand";
import { Blossom } from "@/components/ui/Section";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-plum px-6 pb-10 pt-20 text-petal">
      <div className="mx-auto w-full max-w-6xl">
        <Blossom className="mb-14 opacity-60" />

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl tracking-[0.14em]">
              DECHEN
              <span className="ml-1.5 text-[0.6em] tracking-[0.3em] text-rose">
                SALON
              </span>
            </p>
            <p className="mt-3 font-display text-base italic text-rose">
              {brand.tagline}
            </p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-petal/70">
              A women-led, Tibetan-owned salon in Majnu-ka-Tilla. Vegan and
              cruelty-free, always.
            </p>
          </div>

          {footerNav.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-rose">
                {column.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-petal/75 transition-colors hover:text-petal"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 grid gap-8 border-t border-petal/15 pt-8 sm:grid-cols-2">
          <address className="not-italic text-sm leading-relaxed text-petal/70">
            {brand.address.street}
            <br />
            {brand.address.locality}, {brand.address.region}{" "}
            {brand.address.postalCode}
            <br />
            <a
              href={brand.contact.phoneHref}
              className="mt-2 inline-block transition-colors hover:text-petal"
            >
              {brand.contact.phone}
            </a>
            {brand.contact.email ? (
              <>
                {" · "}
                <a
                  href={`mailto:${brand.contact.email}`}
                  className="transition-colors hover:text-petal"
                >
                  {brand.contact.email}
                </a>
              </>
            ) : null}
          </address>

          <div className="sm:text-right">
            <p className="text-sm text-petal/70">{brand.hours.display}</p>
            <a
              href={brand.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-rose transition-colors hover:text-petal"
            >
              {brand.socials.instagramHandle}
            </a>
          </div>
        </div>

        <p className="mt-10 text-xs text-petal/65">
          © {year} {brand.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
