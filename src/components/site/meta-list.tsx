export type MetaItem = { label: string; value: React.ReactNode };

/** Case-study meta: Role, When, Stack, Links as label/value rows. */
export function MetaList({ items }: { items: MetaItem[] }) {
  return (
    <dl className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-x-6 text-sm">
      {items.map((item) => (
        <div
          key={item.label}
          className="col-span-2 grid grid-cols-subgrid border-t border-rule py-2.5"
        >
          <dt className="text-xs leading-6 text-muted">{item.label}</dt>
          <dd className="min-w-0">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
