# 0014: The resume opens in a new tab

- Status: Accepted
- Date: 2026-10-28

## Context

The Resume buttons (header, hero, contact) opened `/resume.pdf` in the same tab. That replaced
the site with the PDF, so a recruiter who wanted to come back had to use the back button. The
buttons were labelled "Download resume" but didn't download anything.

## Options

1. **Same tab (as before):** simplest, but the site disappears behind the PDF.
2. **Force a download** (`download` attribute): the file saves without opening. The recruiter
   then has to find it in Downloads to read it, which is clunky on phones, and it leaves a file
   behind for someone who only wanted a glance.
3. **New tab:** the browser's PDF viewer opens in a new tab and the site stays open behind it.
   The viewer has its own download and print buttons.

## Decision

New tab (`target="_blank" rel="noopener"`) for every link to the PDF: the three buttons and any
`TextLink` to a `.pdf`. The label says what happens: "View resume" in the hero and contact,
"Resume" in the nav. The icon is Lucide's `FileText` instead of `Download`. Screen readers hear
"(PDF, opens in a new tab)", matching the external-link pattern in
[10-accessibility](../design/10-accessibility.md).

## Why

Most recruiters want to read the resume right away, not file it. A new tab lets them read it
at once, save it from the viewer if they want to, and come back to the site without losing
their place. A button that says "Download" should download, so the wording changed with the
behaviour.
