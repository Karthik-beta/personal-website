import { cn } from "@/lib/cn";
import { monogramLetters, monogramRadius, monogramSide, monogramViewBox } from "./monogram-paths";

/** "KP" monogram, outlined from Instrument Sans (see scripts/build-brand.py). Decorative. */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox={monogramViewBox} className={cn("size-6 shrink-0", className)}>
      <rect
        width={monogramSide}
        height={monogramSide}
        rx={monogramRadius}
        className="fill-accent"
      />
      <path d={monogramLetters} className="fill-on-accent" />
    </svg>
  );
}
