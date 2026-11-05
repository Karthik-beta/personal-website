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
  /** A picture or recording between the stack and the links. */
  media?: React.ReactNode;
  /** Added to the case-study link's label: "Read the case study, 2 min". */
  readingMinutes?: number;
  /** Where on the site this row sits, for GA's `case_study_open` event. */
  placement?: string;
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
  media,
  readingMinutes,
  placement,
  framed = true,
}: ProjectEntryProps) {
  const track = placement && {
    "data-track": "case_study_open",
    "data-track-placement": placement,
  };
  return (
    <article className={cn("grid gap-2", framed && "border-t border-rule py-6")}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-xl font-semibold stretch-title">
          {href ? (
            <Link
              href={href}
              className="decoration-2 underline-offset-[0.2em] hover:underline"
              {...track}
            >
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
      {media && <div className="mt-3 mb-1 max-w-3xl">{media}</div>}
      {links.length > 0 && (
        <ul className="mt-1 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {links.map((link) => {
            const isCaseStudy = link.href === href;
            return (
              <li key={link.href}>
                <TextLink href={link.href} kind="action" {...(isCaseStudy && track)}>
                  {isCaseStudy && readingMinutes
                    ? `${link.label}, ${readingMinutes} min`
                    : link.label}
                </TextLink>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}
