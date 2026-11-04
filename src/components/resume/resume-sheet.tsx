import { EvidenceDetails, EvidenceMargin } from "@/components/resume/evidence-note";
import type { Resume, ResumeBullet, ResumeRow, ResumeSection } from "@/content/resume";
import { cn } from "@/lib/cn";

// The resume as a sheet of paper, laid out like the Harvard PDF it mirrors. The paper stays
// light in both themes, as a printed page would; the evidence notes beside it follow the site.
//
// On wide screens one grid spans the paper and the notes column:
//   [paper margin] [text] [paper margin] [notes, --notes wide]
// Every element between the article and a bullet is a subgrid row, so each note sits level with
// its bullet and two notes can never overlap. The paper is a single layer behind the first three
// columns. On narrow screens there is no notes column: notes open under their bullet instead.
//
// Sheet text sits in cells marked data-theme="light", which re-declares the light tokens for
// that subtree (globals.css). Each cell sets its colour again because `color` is inherited as
// a value already resolved from the page's theme. No `dark:` utilities in here: they still
// match inside a forced-light subtree.

const row = "lg:col-span-full lg:grid lg:grid-cols-subgrid";

type PaperProps = {
  as?: "div" | "header" | "h2" | "p";
  id?: string;
  className?: string;
  children: React.ReactNode;
};

/** A cell of the sheet's text column, in the paper's (light) colours. */
function Paper({ as: Tag = "div", className, children, ...props }: PaperProps) {
  return (
    <Tag data-theme="light" className={cn("text-ink lg:col-start-2", className)} {...props}>
      {children}
    </Tag>
  );
}

const sheetLink =
  "underline decoration-rule-strong underline-offset-[0.2em] transition-[text-decoration-color] duration-120 ease-out hover:decoration-ink";

function SheetLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (href.startsWith("https://")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={sheetLink}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <a href={href} className={sheetLink}>
      {children}
    </a>
  );
}

/** A project's link as the PDF prints it ("blinkql.karthik.nz"), made clickable. */
function projectHref(text: string) {
  return text.startsWith("karthik.nz/") ? text.slice("karthik.nz".length) : `https://${text}`;
}

function Row({
  row: { left, right, note, bold = true },
  as: Tag,
}: {
  row: ResumeRow;
  as: "h3" | "p";
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
      <Tag className={cn(bold && "font-semibold")}>
        {left}
        {note && (
          <span className="font-normal">
            {" | "}
            <SheetLink href={projectHref(note)}>{note}</SheetLink>
          </span>
        )}
      </Tag>
      <p className="tabular-nums">{right}</p>
    </div>
  );
}

function Bullet({ bullet }: { bullet: ResumeBullet }) {
  const { notes } = bullet;
  return (
    <li id={bullet.id} className={cn("group", row)}>
      <Paper className="relative pl-5">
        <span
          aria-hidden
          className="absolute left-1 transition-colors duration-120 ease-out group-focus-within:text-accent group-hover:text-accent"
        >
          •
        </span>
        {bullet.text}
        {notes.length > 0 && <EvidenceDetails notes={notes} />}
      </Paper>
      {notes.length > 0 && <EvidenceMargin notes={notes} />}
    </li>
  );
}

function Section({ section }: { section: ResumeSection }) {
  const id = `resume-${section.title.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  return (
    <section aria-labelledby={id} className={cn("mt-6", row)}>
      <Paper as="h2" id={id} className="mb-2 text-center font-semibold">
        {section.title}
      </Paper>
      {section.kind === "text" && <Paper as="p">{section.text}</Paper>}
      {section.kind === "lines" && (
        <Paper className="grid gap-1">
          {section.lines.map((line) => (
            <p key={line.label}>
              <span className="font-semibold">{line.label}</span> {line.text}
            </p>
          ))}
        </Paper>
      )}
      {section.kind === "entries" &&
        section.entries.map((entry, index) => (
          <div key={entry.head.left} className={cn(index > 0 && "mt-4", row)}>
            <Paper>
              <Row row={entry.head} as="h3" />
              {entry.sub && <Row row={entry.sub} as="p" />}
              {entry.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </Paper>
            {entry.bullets.length > 0 && (
              // role="list": Safari drops list semantics from a list styled without markers.
              <ul role="list" className={cn("mt-1 grid gap-1", row)}>
                {entry.bullets.map((bullet) => (
                  <Bullet key={bullet.id} bullet={bullet} />
                ))}
              </ul>
            )}
          </div>
        ))}
    </section>
  );
}

export function ResumeSheet({ resume }: { resume: Resume }) {
  return (
    <article
      aria-labelledby="resume-name"
      className="relative isolate grid px-5 py-8 text-sm sm:px-8 lg:grid-cols-[2rem_minmax(0,1fr)_2rem_var(--notes)] lg:px-0 lg:py-10 print:p-0"
    >
      <div
        aria-hidden
        data-theme="light"
        className="absolute inset-0 -z-10 rounded-band border border-rule bg-surface lg:right-(--notes) print:hidden"
      />
      <Paper as="header" className="text-center">
        <h1 id="resume-name" className="text-xl font-semibold">
          {resume.name}
        </h1>
        <div className="mt-1 grid gap-0.5 border-t border-ink pt-2 text-xs">
          {resume.contact.map((line, index) => (
            <p key={index} className="flex flex-wrap justify-center gap-x-2">
              {line.map((item, i) => (
                <span key={item.text} className="flex gap-x-2">
                  {i > 0 && <span aria-hidden>•</span>}
                  {item.href ? <SheetLink href={item.href}>{item.text}</SheetLink> : item.text}
                </span>
              ))}
            </p>
          ))}
        </div>
      </Paper>
      {resume.sections.map((section) => (
        <Section key={section.title} section={section} />
      ))}
    </article>
  );
}
