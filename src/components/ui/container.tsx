import { cn } from "@/lib/cn";

/** Centred page container: max 64rem, side gutters 16 → 24 → 32 px. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[64rem] px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
