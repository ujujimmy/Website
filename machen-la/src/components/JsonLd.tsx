/**
 * Structured data. Rendered as a plain script tag rather than through next/script
 * so it is present in the static HTML the crawler receives, with no hydration
 * involved.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // The payload is our own typed data, never user input.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
