/**
 * Renders a JSON-LD block. Escaping `<` prevents a stray `</script>` inside
 * any content string from breaking out of the tag.
 */
export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
