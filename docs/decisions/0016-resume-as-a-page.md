# 0016: The resume is a page, with evidence beside each line

- Status: Accepted (supersedes [0014](0014-resume-opens-in-new-tab.md))
- Date: 2026-11-01

## Context

The Resume buttons opened `/resume.pdf` in a new tab (ADR 0014). That works, but the browser's
PDF viewer is a dead end: it looks different in every browser, it's hard to read on a phone, and
nothing in it leads back to the work the resume describes. A recruiter reading "Optimized
first-query time from about 45 to 10 ms" has no way to check it.

## Options

1. **Keep the PDF in a new tab** (ADR 0014).
2. **Embed the PDF** in a page, as an `<iframe>` or drawn onto a canvas with PDF.js. The text
   can't be selected, searched or read by screen readers and search engines, only one page shows
   on some setups, and PDF.js adds over 1 MB of script.
3. **Render the resume as HTML** from the same source as the PDF, and use what a web page can do
   that a PDF can't: link each line to the evidence for it.

## Decision

Option 3, at `/resume`:

- **One source.** The Job Hunt app renders the PDF and the page data from the same general
  resume: `uv run jobhunt master --web <pdf> --json <json>`, then
  `python -I scripts/prepare-resume.py <pdf> --json <json>` installs `public/resume.pdf` and
  `src/content/resume.json`. The page always says what the PDF says, word for word.
- **Evidence notes.** A short note beside each line links to its case study, code, live
  project or package. Notes live in the Job Hunt app's facts bank, each approved by Karthik, and
  any number in a note must appear in the fact it backs. Lines with no public evidence (client
  work at Getin Solutions) say so plainly.
- **Layout.** The sheet keeps the PDF's Harvard structure, set in Instrument Sans (the site's
  one typeface). It stays light in both themes, like a printed page; the notes follow the site's
  theme. On wide screens the notes sit in a margin column, always visible but muted, each joined
  to its line by a hairline; hovering or focusing the line brings both forward. On phones each
  line has an "Evidence" toggle (`<details>`) instead. That is a disclosure for supporting
  detail, not an accordion for main content, so it fits [07-components](../design/07-components.md).
- **Links.** The three buttons ("Resume" in the nav, "View resume" in the hero and contact) open
  `/resume` in the same tab, like any other page on the site. The page has a "Download PDF"
  button that saves `Karthik_Parameshwara_Resume.pdf`. Printing the page prints the sheet alone.
- **Motion.** None: the page opens like any other. A view transition that let the sheet rise
  into place when a resume button opened it was built and tested on 2026-11-01, but React never
  started it for this navigation (Next.js 16.4.3, React 19.3.0, with or without
  `partialPrefetching`), so it was taken out rather than shipped as dead code. Worth another look
  on a later Next.js release.
- **Wording.** The page shows the resume's own words, including the Getin line that names
  manufacturing customers. It is the resume, not site copy, and the PDF has always said it.

## Why

A recruiter can check a claim in one click instead of taking it on trust, which is the point of
a portfolio site. Real text also means the resume can be searched with Ctrl+F, read by screen
readers, indexed, and read comfortably on a phone. Generating both from one source keeps the
page and the PDF from ever disagreeing.
