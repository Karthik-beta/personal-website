/** For Karthik's own words only. */
export function Quote({
  children,
  source,
}: {
  children: React.ReactNode;
  source?: React.ReactNode;
}) {
  return (
    <figure className="border-l-2 border-accent pl-4">
      <blockquote className="max-w-[60ch] text-lg">{children}</blockquote>
      {source && <figcaption className="mt-2 text-xs text-muted">{source}</figcaption>}
    </figure>
  );
}
