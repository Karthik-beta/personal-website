# 0009: Visual direction "Working hours"

- Status: Accepted
- Date: 2026-10-27

## Context

Phase 3 needed one visual direction for type, colour and layout. It had to serve a 10-second
recruiter skim and a longer story, in a calm, precise, minimal, text-first style, while avoiding
generic portfolio and template looks.

## Options

Three directions were rendered as live mocks with the approved copy:

1. **Working hours:** dates in a left time margin like a schedule; one typeface (Instrument Sans)
   narrowed for the headline; a labelled facts row; a live local-time line.
2. **Long read:** an essay-like serif (Newsreader) for headlines and chapters, with a sans for UI.
   Very personal, but a weaker skim layer.
3. **Ledger:** a bold record layout with the career as a table. The fastest skim, but
   resume-like, with little room for the story.

Accent colours compared for option 1: ultramarine, deep green, plum (all ≥ 5.9:1 contrast).

## Decision

- Direction **1, Working hours**.
- Typeface: **Instrument Sans** only (variable weight + width), self-hosted via `next/font`.
- Accent: **ultramarine** (`#2c3fb8` light / `#9aa8ff` dark) on cool paper (`#f5f6f8`).
- Themes: **light by default, dark when the device prefers it**, plus a manual toggle.
- Keep the **live local-time line** in the hero ("It's 14:20 on Tuesday in Bengaluru").

## Why

It balances both reading paths: the facts row answers recruiters immediately, and the dated
chapters carry the story. Time as structure reflects Karthik's real work (scheduling, working
hours, deployments), so the identity is specific rather than templated. Ultramarine reads as
clickable and trustworthy. Details: [docs/design/](../design/).
