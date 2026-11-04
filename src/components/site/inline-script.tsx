/**
 * Runs during HTML parsing (before first paint) on full page loads; inert on the client,
 * where the owning Client Component renders the value itself. Pattern from the Next.js
 * guide "Preventing flash before hydration".
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
