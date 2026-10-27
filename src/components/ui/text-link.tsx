import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type TextLinkProps = Omit<React.ComponentProps<"a">, "href"> & {
  href: string;
  /** `inline` sits in running text; `action` is a standalone link with optional icon. */
  kind?: "inline" | "action";
  icon?: React.ReactNode;
  external?: boolean;
};

export function textLinkClasses(kind: "inline" | "action" = "inline", className?: string) {
  return cn(
    "text-accent underline decoration-1 underline-offset-[0.2em] transition-[color,text-decoration-color] duration-120 ease-out",
    "hover:text-accent-hover hover:decoration-2 data-[state=hover]:text-accent-hover data-[state=hover]:decoration-2",
    "data-[state=focus]:outline-2 data-[state=focus]:outline-offset-3 data-[state=focus]:outline-accent",
    kind === "action" && "inline-flex items-center gap-1 font-semibold",
    className,
  );
}

export function TextLink({
  href,
  kind = "inline",
  icon,
  external,
  className,
  children,
  ...props
}: TextLinkProps) {
  const isExternal = external ?? /^https?:\/\//.test(href);
  const classes = textLinkClasses(kind, className);

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {icon}
        {children}
        <ExternalLink
          aria-hidden
          size={14}
          strokeWidth={1.75}
          className={cn("shrink-0", kind === "inline" && "ml-0.5 inline-block align-[-0.1em]")}
        />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  if (href.startsWith("mailto:") || href.endsWith(".pdf")) {
    return (
      <a href={href} className={classes} {...props}>
        {icon}
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {icon}
      {children}
    </Link>
  );
}
