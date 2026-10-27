export type Fact = { label: string; value: React.ReactNode };

/**
 * Labelled facts for the 10-second skim. Columns follow the row's own width
 * (container query), so it works full-width in the hero and in narrow panels.
 */
export function FactsRow({ items }: { items: Fact[] }) {
  return (
    <div className="@container">
      <dl className="grid gap-x-6 gap-y-3 @sm:grid-cols-2 @4xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="border-t border-rule pt-2">
            <dt className="text-xs text-muted">{item.label}</dt>
            <dd className="text-sm font-medium">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
