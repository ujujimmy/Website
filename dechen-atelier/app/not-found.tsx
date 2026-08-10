import { Button, Arrow } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="gutter flex min-h-[70svh] flex-col justify-center py-28">
      <p className="micro text-lacquer">404</p>
      <h1 className="t-page mt-6 max-w-3xl">Nothing here.</h1>
      <p className="prose-measure mt-8">
        The page you asked for doesn&rsquo;t exist, or it moved. The price index
        and the service chapters are both one tap away.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/">
          Back to the salon
          <Arrow />
        </Button>
        <Button href="/menu" variant="line">
          Price index
        </Button>
      </div>
    </section>
  );
}
