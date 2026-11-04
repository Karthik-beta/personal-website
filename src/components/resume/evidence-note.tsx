import { ChevronRight } from "lucide-react";
import { Fragment } from "react";
import { TextLink } from "@/components/ui/text-link";
import type { EvidenceNote } from "@/content/resume";

// Evidence notes: the proof behind a resume line (a case study, the code, the live project or
// the package). The text and links come from the facts bank, where each note is approved.

// Links run on after the note's text rather than on their own line: a note taller than its bullet
// pushes the next bullet down, opening a gap in the sheet.
function Notes({ notes }: { notes: EvidenceNote[] }) {
  return notes.map((note) => (
    <p key={note.fact}>
      {note.text}
      {note.links.map((link) => (
        <Fragment key={link.href}>
          {/* An en space: wider than a word space, and it never starts a wrapped line. */}
          {" "}
          <TextLink href={link.href} className="whitespace-nowrap">
            {link.label}
          </TextLink>
        </Fragment>
      ))}
    </p>
  ));
}

/**
 * Wide screens: the note in the margin beside its bullet, muted until the line is hovered or
 * focused. A hairline runs from the paper to the note, tying the claim to its proof.
 */
export function EvidenceMargin({ notes }: { notes: EvidenceNote[] }) {
  return (
    <div className="relative hidden gap-3 pt-0.5 pl-6 text-xs text-muted transition-colors duration-120 ease-out group-focus-within:text-ink group-hover:text-ink lg:col-start-4 lg:grid print:hidden">
      <span
        aria-hidden
        className="absolute top-3 -left-4 h-px w-9 bg-rule-strong transition-colors duration-120 ease-out group-focus-within:bg-accent group-hover:bg-accent"
      />
      <span className="sr-only">Evidence:</span>
      <Notes notes={notes} />
    </div>
  );
}

/** Narrow screens: the note opens under its bullet, on the paper. */
export function EvidenceDetails({ notes }: { notes: EvidenceNote[] }) {
  return (
    <details className="group/evidence mt-0.5 lg:hidden print:hidden">
      <summary className="inline-flex cursor-pointer list-none items-center gap-0.5 py-0.5 text-xs font-semibold text-accent [&::-webkit-details-marker]:hidden">
        <ChevronRight
          aria-hidden
          size={14}
          strokeWidth={2}
          className="transition-transform duration-120 ease-out group-open/evidence:rotate-90"
        />
        Evidence<span className="sr-only"> for this line</span>
      </summary>
      <div className="mt-1 mb-2 grid gap-2 border-l-2 border-band pl-3 text-xs text-muted">
        <Notes notes={notes} />
      </div>
    </details>
  );
}
