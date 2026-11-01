# 0018: Contributions as a status ledger; activity from 1 October

- Status: Accepted (2026-11-01). Revises [0017](0017-open-source-page.md): star counts
  (its decision 5) and the timesheet window.
- Date: 2026-11-01
- Design: [13-open-source](../design/13-open-source.md)

## Context

The first version of `/open-source` listed contributions as plain text rows. Karthik wanted them
visualised, in the spirit of developer sites that show pull requests with status markers and
counts, without leaving the site's design system. Karthik also wanted the activity record to
start on 1 October and keep growing, and one repository left off the list.

## Options

1. **Status ledger:** a tally of squares and a count per repository; a status square and the
   review time in words per pull request.
2. **Review track:** a bar per pull request on one shared day scale, filled from opened to
   merged, dashed while in review.
3. **Ledger plus a small track** in each row.

Details per pull request: number, review time, lines changed, files changed. Star counts: shown
muted, or not at all.

## Decision

- **Option 1**, reusing the timesheet's squares: filled ultramarine = merged, ultramarine outline
  = in review, dashed = draft. One new token, `radius-mark`.
- **Review time only** under each title ("Merged in 2 days", "In review for 14 days").
- **Star counts shown**, small and muted, beside each repository name.
- **Owner logos** beside each repository, downloaded on the server and embedded as `data:`
  images.
- **Activity** starts on 1 October 2026 and grows week by week with no rolling window. The
  heading is "Activity" and the sentences carry no date.
- **The activity grid runs sideways:** one column per week, squares adapting to the width (36 px
  down to 14 px), then scrolling inside its own box from the newest week. The home page shows
  the whole grid instead of the last four weeks.
- **Library icons** come from each library's website (its touch icon), fetched on the server and
  embedded, like the owner logos. A site that isn't live yet shows no icon.
- **`g8r-b8/frontierLab` is hidden** through a `hiddenRepos` list in `src/content/open-source.ts`.

## Why

- The ledger shows status at a glance and stays calm; the review track would compete with the
  timesheet, the page's one bold element.
- Review time shows maintainers accepting work quickly, which matters to a hiring manager. Line
  and file counts don't help a recruiter, and an engineer sees them one click away.
- Most recruiters don't know SigNoz or Haystack; "32k stars" tells them these are widely used
  projects. Small repositories show small numbers, honestly.
- Embedding the logos keeps visitors' browsers from contacting GitHub, so privacy and the CSP
  stay as they were.
- Starting the record on 1 October shows the whole month honestly, including the days before the
  daily run began.
- A sideways grid stays seven rows tall however long the record grows, so neither the page nor
  the home teaser gets longer every week.
