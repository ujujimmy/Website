/**
 * Structured data. Rendered server-side so crawlers see it in the HTML rather
 * than having to execute anything.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // The payload is our own content, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
