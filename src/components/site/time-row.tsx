/**
 * A row in the time margin: the date range on the left (pinned while its row is on
 * screen, md and up), the content on the right. Only for content that is a real sequence.
 */
export function TimeRow({ when, children }: { when: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid gap-x-8 gap-y-2 border-t border-rule pt-6 md:grid-cols-[10rem_minmax(0,1fr)]">
      <p className="text-xs text-muted tabular-nums md:sticky md:top-18 md:self-start md:pt-1">
        {when}
      </p>
      <div className="max-w-[65ch] min-w-0">{children}</div>
    </div>
  );
}
