# 0006: Docs mirrored to the GitHub wiki

- Status: Accepted
- Date: 2026-10-27

## Context

Karthik asked for the project documents to be saved in the GitHub repo's wiki as well. The repo is
public, so the wiki is public. Some docs are private working notes: the research doc lists gaps in
Karthik's work history, and the story docs draft how to frame leaving the startup.

## Options

Scope:

1. **Design + decisions only**: shows the process publicly and keeps private notes private.
2. **Everything in `docs/`**: fully transparent, but drafts and the gap analysis become public.
3. **Everything, after approval**: everything goes up, but only final versions.

Timing:

1. **At each phase end, after approval**: nothing half-finished goes public.
2. **On every docs change**: always current, but drafts are public immediately.

## Decision

- `docs/` in the main repo is the single source of truth. The wiki is a generated mirror and is
  never edited by hand.
- Only `docs/design/` and `docs/decisions/` are mirrored. `docs/research/` and `docs/content/` are
  never published to the wiki.
- `scripts/sync-wiki.ts` (`bun run wiki:sync`) builds the mirror and shows a dry-run diff. It is
  pushed with `bun run wiki:sync -- --push` only after Karthik approves a phase's docs.

## Why

A public design wiki is a strong signal to engineering managers: it shows structured thinking and
care. Keeping private drafts out of it avoids a recruiter reading an unpolished gap analysis.
Generating the wiki from `docs/` means the two can never drift apart.
