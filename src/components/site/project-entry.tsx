import Link from "next/link";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/cn";

type ProjectEntryProps = {
  title: string;
  /** Case-study page, if the project has one. */
  href?: string;
  /** Shown beside the title. Omit when the dates sit in a time margin instead. */
  when?: React.ReactNode;
  summary: React.ReactNode;
  stack: string[];
  links?: { href: string; label: string }[];
  /** Draw the separating rule and vertical padding (off when a parent row provides them). */
  framed?: boolean;
};

/** A row in the Work list. Deliberately not a card. */
export function ProjectEntry({
  title,
  href,
  when,
  summary,
  stack,
  links = [],
  framed = true,
}: ProjectEntryProps) {
  return (
    <article className={cn("grid gap-2", framed && "border-t border-rule py-6")}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-xl font-semibold stretch-title">
          {href ? (
            <Link href={href} className="decoration-2 underline-offset-[0.2em] hover:underline">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        {when && <p className="text-xs text-muted tabular-nums">{when}</p>}
      </div>
      <p className="max-w-[65ch]">{summary}</p>
      <p className="text-xs text-muted">{stack.join(", ")}</p>
      {links.length > 0 && (
        <ul className="mt-1 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <TextLink href={link.href} kind="action">
                {link.label}
              </TextLink>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
