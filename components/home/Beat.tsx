import { cn } from "@/lib/utils";

/**
 * One beat of the scroll narrative — a full viewport section whose copy sits
 * on one side, leaving the other side clear for the 3D shape.
 *
 * `min-h-screen` (not fixed height) so long copy never gets clipped on a short
 * laptop viewport or at large text sizes.
 */
export function Beat({
  children,
  side = "left",
  className,
  id,
  beat,
  compact = false,
}: {
  children: React.ReactNode;
  side?: "left" | "right" | "center";
  className?: string;
  id?: string;
  /** Index in the narrative. Narrative measures these to drive the 3D scene. */
  beat: number;
  /**
   * Drop the full-viewport height below `md`, for beats whose mobile form is
   * a collapsed accordion or a single line. The section still carries its
   * `data-beat`, so the 3D scene stays in sync — Narrative measures real
   * element centres rather than assuming a screen per beat, so a short beat
   * simply means its shape arrives sooner.
   */
  compact?: boolean;
}) {
  return (
    <section
      id={id}
      data-beat={beat}
      className={cn(
        // Extra top padding clears the fixed header when copy fills the beat.
        "relative flex items-center",
        compact
          ? "py-8 md:min-h-screen md:pb-24 md:pt-36"
          : "min-h-screen pb-24 pt-36",
        className,
      )}
    >
      <div className="container-page">
        <div
          className={cn(
            "flex",
            side === "left" && "justify-start",
            side === "right" && "justify-end",
            side === "center" && "justify-center",
          )}
        >
          <div
            className={cn(
              "w-full",
              side === "center" ? "max-w-3xl text-center" : "max-w-xl lg:max-w-lg",
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
