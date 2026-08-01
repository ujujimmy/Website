import { Button, Arrow } from "@/components/ui/Button";
import { Blossom } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] flex-col items-center justify-center px-6 py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-4xl sm:text-5xl">This page grew out.</h1>
      <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted">
        We couldn&rsquo;t find what you were looking for. The price menu and the
        services are both a tap away.
      </p>
      <Blossom className="mt-10" />
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button href="/" size="lg">
          Back to the salon
          <Arrow />
        </Button>
        <Button href="/menu" size="lg" variant="secondary">
          See the price menu
        </Button>
      </div>
    </section>
  );
}
