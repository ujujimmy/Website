import Link from "next/link";
import { RESTAURANT } from "@/data/site";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[76rem] px-5 py-24 sm:px-8 sm:py-32">
      <p className="font-mono text-meta uppercase text-butter">404</p>
      <h1 className="font-display mt-6 max-w-[16ch] text-display-l font-semibold text-wall">
        That page is not on the menu.
      </h1>
      <p className="mt-8 max-w-[46ch] text-lede text-wall-dim">
        Nothing here. The menu, the address and the hours are all a tap away.
      </p>
      <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
        <Link
          href="/menu"
          className="flex min-h-12 items-center font-mono text-meta uppercase text-butter underline decoration-butter/40 underline-offset-8"
        >
          The menu
        </Link>
        <Link
          href="/visit"
          className="flex min-h-12 items-center font-mono text-meta uppercase text-butter underline decoration-butter/40 underline-offset-8"
        >
          Find us
        </Link>
        <a
          href={`tel:${RESTAURANT.phone.tel}`}
          className="flex min-h-12 items-center font-mono text-meta uppercase text-butter underline decoration-butter/40 underline-offset-8"
        >
          {RESTAURANT.phone.display}
        </a>
      </div>
    </section>
  );
}
