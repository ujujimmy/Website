import { acts } from "@/content/story";

/**
 * One act of the scroll story: a full-viewport panel whose copy sits on the
 * side the strand isn't using.
 *
 * Colour comes from `--act-fg` / `--act-muted`, which StoryStage moves in step
 * with the floor, so the same markup reads correctly on blush and on plum.
 */
export function Act({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) {
  const act = acts[id];

  const placement =
    act.side === "left"
      ? "mr-auto lg:max-w-[46%]"
      : act.side === "right"
        ? "ml-auto lg:max-w-[46%]"
        : "mx-auto max-w-2xl text-center";

  return (
    <section
      id={`act-${act.key}`}
      aria-label={act.label}
      className="relative flex min-h-[100svh] items-center px-6 py-24 sm:px-10"
      style={{ color: "var(--act-fg)" }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className={`relative ${placement}`}>
          {/*
            The two centred acts have the strand directly behind their copy.
            The strand already dims there; this soft wash of the floor colour
            finishes the job, so the headline never has to compete with a
            highlight running through it.
          */}
          {act.side === "center" ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-16 -inset-y-12 -z-10 rounded-[50%]"
              style={{
                background:
                  "radial-gradient(closest-side, rgb(253 242 248 / 0.92), rgb(253 242 248 / 0.6) 62%, transparent)",
              }}
            />
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}

/** Standard act heading block, so all seven acts share one rhythm. */
export function ActHeading({
  eyebrow,
  headline,
  sub,
}: {
  eyebrow: string;
  headline: string;
  sub: string;
}) {
  return (
    <>
      <p
        className="text-xs font-semibold uppercase tracking-[0.18em]"
        style={{ color: "var(--act-accent)" }}
      >
        {eyebrow}
      </p>
      <h2 className="mt-5 text-[2.1rem] leading-[1.08] sm:text-5xl">{headline}</h2>
      <p
        className="mt-6 text-base leading-relaxed sm:text-lg"
        style={{ color: "var(--act-muted)" }}
      >
        {sub}
      </p>
    </>
  );
}
