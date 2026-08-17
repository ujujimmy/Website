import { RESTAURANT, WHATSAPP_RESERVE } from "@/data/site";

/**
 * The most important element on the site.
 *
 * Someone is standing in the lane at 8pm with one hand on their phone, deciding
 * between us and seven other places within a hundred metres. Every action they
 * could want is pinned to the bottom of the screen, in the thumb zone, on every
 * page, and none of it needs JavaScript to work.
 *
 * Mobile only — on a desktop the same actions live in the header and footer.
 * `env(safe-area-inset-bottom)` keeps it clear of the iPhone home indicator.
 */
export function StickyBar() {
  const cell =
    "flex min-h-14 items-center justify-center px-2 text-center font-mono text-meta uppercase";

  return (
    <nav
      aria-label="Quick actions"
      className="hairline fixed inset-x-0 bottom-0 z-50 border-t bg-ink md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="grid grid-cols-3">
        <li>
          {/* Call is the filled one. At 8pm the question is "are you open and
              can you seat four", and that is a 20-second phone call. */}
          <a href={`tel:${RESTAURANT.phone.tel}`} className={`${cell} bg-butter text-ink`}>
            Call
          </a>
        </li>
        <li className="hairline border-l">
          <a
            href={RESTAURANT.links.directions}
            target="_blank"
            rel="noopener noreferrer"
            className={`${cell} text-wall`}
          >
            Directions
          </a>
        </li>
        <li className="hairline border-l">
          <a
            href={WHATSAPP_RESERVE}
            target="_blank"
            rel="noopener noreferrer"
            className={`${cell} text-wall`}
          >
            Reserve
          </a>
        </li>
      </ul>
    </nav>
  );
}
