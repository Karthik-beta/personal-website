import { cn } from "@/lib/cn";

/**
 * The home page's two-column grid: a 10rem time margin and the content column.
 * On phones the margin label sits above its content.
 */
export function MarginGrid({
  margin,
  className,
  children,
}: {
  margin?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid gap-x-8 gap-y-2 md:grid-cols-[10rem_minmax(0,1fr)]", className)}>
      <div className="text-xs text-muted tabular-nums md:pt-1">{margin}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
