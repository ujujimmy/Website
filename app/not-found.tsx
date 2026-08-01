import { Button } from "@/components/ui/Button";
import { nav } from "@/content/site";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center py-32">
      <div className="container-page text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-2">
          404
        </p>
        <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
          That page isn&apos;t here.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted">
          Either the link is wrong or we moved something. Here&apos;s the way
          back.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/">Back to home</Button>
          <Button href="/audit" variant="secondary">
            Get a free audit
          </Button>
        </div>

        <ul className="mt-14 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-t border-line pt-8 text-sm">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-muted transition-colors hover:text-fg"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
