import Link from "next/link";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "quiet";
export type ButtonSize = "default" | "icon";

/**
 * `data-state="hover|active|focus"` forces a state, so the styleguide can show
 * every state side by side. Real pages never set it.
 */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  className?: string,
  size: ButtonSize = "default",
) {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-1 rounded-control text-sm font-semibold whitespace-nowrap select-none",
    // An icon has no text to hold its width, so a crowded flex row would squeeze it.
    size === "default" ? "px-4.5" : "size-11 shrink-0",
    "transition-[color,background-color,border-color] duration-120 ease-out active:translate-y-px data-[state=active]:translate-y-px",
    "data-[state=focus]:outline-2 data-[state=focus]:outline-offset-3 data-[state=focus]:outline-accent",
    variant === "primary" &&
      "bg-accent text-on-accent hover:bg-accent-hover data-[state=active]:bg-accent-hover data-[state=hover]:bg-accent-hover",
    variant === "quiet" &&
      "border border-rule-strong text-ink hover:bg-band data-[state=active]:bg-band data-[state=hover]:bg-band",
    className,
  );
}

type ButtonProps = React.ComponentProps<"button"> & { variant?: ButtonVariant };

export function Button({ variant, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className)} {...props} />;
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & { variant?: ButtonVariant };

export function ButtonLink({ variant, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}
