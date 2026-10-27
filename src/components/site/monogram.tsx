import { cn } from "@/lib/cn";

/** Interim "KP" monogram set in the site typeface. Replaced by the Phase 4 asset. */
export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-6 items-center justify-center rounded-[0.3rem] bg-accent text-[0.6875rem] leading-none font-bold tracking-[-0.02em] text-on-accent stretch-display",
        className,
      )}
    >
      KP
    </span>
  );
}
