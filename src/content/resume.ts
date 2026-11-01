import data from "./resume.json";

// The /resume page's content. resume.json is generated, never edited by hand: the Job Hunt app
// renders it from the same source as public/resume.pdf (`uv run jobhunt master --web <pdf>
// --json <json>`), and scripts/prepare-resume.py installs both. The PDF and this page always
// say the same thing; the page adds the evidence notes, which are approved in the facts bank.

export type EvidenceLink = {
  label: string;
  href: string;
  kind: "case-study" | "live" | "code" | "package" | "ci";
};

export type EvidenceNote = { fact: string; text: string; links: EvidenceLink[] };

export type ResumeBullet = { id: string; text: string; sources: string[]; notes: EvidenceNote[] };

/** A header line: bold left text (plus a project's link), and dates or a place on the right. */
export type ResumeRow = { left: string; right: string; note?: string | null; bold?: boolean };

export type ResumeEntry = {
  head: ResumeRow;
  sub: ResumeRow | null;
  lines: string[];
  bullets: ResumeBullet[];
};

export type ResumeSection =
  | { kind: "text"; title: string; text: string }
  | { kind: "entries"; title: string; entries: ResumeEntry[] }
  | { kind: "lines"; title: string; lines: { label: string; text: string }[] };

export type Resume = {
  version: 1;
  /** ISO date the data was generated. */
  updated: string;
  name: string;
  /** Centred header lines. Never includes the phone number. */
  contact: { text: string; href?: string }[][];
  sections: ResumeSection[];
};

export const resume = data as Resume;
