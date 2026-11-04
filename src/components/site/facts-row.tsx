import { cn } from "@/lib/cn";

export type Fact = { label: string; value: React.ReactNode; wide?: boolean };

/**
 * Labelled facts for the 10-second skim. Columns follow the row's own width
 * (container query), so it works full-width in the hero and in narrow panels.
 * `wide` facts span the whole row; `className` can set a custom column template.
 */
export function FactsRow({ items, className }: { items: Fact[]; className?: string }) {
  return (
    <div className="@container">
      <dl className={cn("grid gap-x-6 gap-y-3 @sm:grid-cols-2 @4xl:grid-cols-4", className)}>
        {items.map((item) => (
          <div
            key={item.label}
            className={cn("border-t border-rule pt-2", item.wide && "col-span-full")}
          >
            <dt className="text-xs text-muted">{item.label}</dt>
            <dd className="text-sm font-medium">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
