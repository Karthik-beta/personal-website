import { cn } from "@/lib/cn";
import { monogramLetters, monogramRadius, monogramSide, monogramViewBox } from "./monogram-paths";

const tones = {
  /** White letters on the accent square: the brand version (favicon, link previews). */
  accent: { square: "fill-accent", letters: "fill-on-accent" },
  /** Text colour, so the nav's only accent is the Resume button (docs/design/08). */
  ink: { square: "fill-ink", letters: "fill-paper" },
} as const;

/** "KP" monogram, outlined from Instrument Sans (see scripts/build-brand.py). Decorative. */
export function Monogram({
  tone = "accent",
  className,
}: {
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <svg aria-hidden viewBox={monogramViewBox} className={cn("size-6 shrink-0", className)}>
      <rect
        width={monogramSide}
        height={monogramSide}
        rx={monogramRadius}
        className={tones[tone].square}
      />
      <path d={monogramLetters} className={tones[tone].letters} />
    </svg>
  );
}
