# 13: Open source page

- Status: Approved (2026-11-01)
- Decision record: [ADR 0017](../decisions/0017-open-source-page.md)

## The job of this page

Show, with evidence anyone can check, that Karthik maintains published libraries, sends fixes to
other people's projects, and ships every day. A recruiter should get that in one glance; an
engineer should be able to click through to every package and pull request.

The idea is borrowed from developer sites that list upstream pull requests live from GitHub: fresh, verifiable proof instead of claims.
The form is our own, built from the "Working hours" direction ([04](04-theme.md)).

## Decided with Karthik (2026-11-01)

1. **Its own page, `/open-source`,** with a short teaser on the home page.
2. **The streak is a timesheet calendar, with no day counter.** If a day is ever missed, nothing
   on the site reads "0 days".
3. **Every upstream pull request that is merged or still open is listed**, each with its real
   status. Closed, unmerged ones are left out.

## Facts this page may state

From the research doc (local), confirmed by Karthik on 2026-11-01:

- **workclock**: published on npm, PyPI and crates.io; released but not yet stable.
- **fiscalclock**: published 0.1.0 on npm, PyPI and crates.io; still in development.
- **Daily activity** since 10 October 2026. The timesheet starts on 1 October 2026 (Karthik's
  choice), so 1–9 October show as days with no activity.

Everything else on the page (versions, release dates, pull requests, their status, active days)
comes live from GitHub and the package registries, never typed by hand.

## Page layout

The page uses the site's grid: the time margin on the left, the reading column on the right
([05](05-layout-grid-spacing.md)). Three parts, in this order, because a recruiter cares most
about the libraries and least about daily activity:

```text
Desktop (≥ 768 px)
┌────────────────────────────────────────────────────────────────┐
│ [nav]                                                          │
│                                                                │
│                Open source                                     │
│                Two libraries I maintain, fixes I've sent to    │
│                other people's projects, and the days I've      │
│                shipped.                                        │
│                                                                │
│  Libraries     workclock                                       │
│                Business-time arithmetic: working hours, SLAs,  │
│                shifts, holidays and time zones.                │
│                Version   0.1.4, not yet stable                 │
│                Released  30 Oct 2026                           │
│                Install   [npm] [PyPI] [crates.io]              │
│                Links     Docs · Source                         │
│                                                                │
│                fiscalclock                                     │
│                Fiscal calendars (4-4-5, 52/53-week, fixed      │
│                date) from one JSON definition.                 │
│                Version   0.1.0, in development                 │
│                ...                                             │
│                                                                │
│  Contributions [logo] shaongitbd/doory  1.9k stars      □ □ □ ■│
│                1 merged, 3 in review                           │
│  31 Oct        □ Crop: a resize past the image edge…           │
│                  In review for 1 day                           │
│  29 Oct        ■ Free crop keeps the side you aren't dragging  │
│                  Merged in 2 days                              │
│                …                                               │
│                                                                │
│  Activity      Mon Tue Wed Thu Fri Sat Sun                     │
│  28 Sept                    □   □   □   □                      │
│   5 Oct         □   □   □   □   □   ■   ■                      │
│  12 Oct         ■   ■   ■   ■   ■   ■   ■                      │
│  …                                                             │
│                Active on 23 of 32 days.                        │
│                                                                │
│                Updated from GitHub and the package registries  │
│                at 10:20 on 1 Nov (Bengaluru time).             │
└────────────────────────────────────────────────────────────────┘
```

On phones the margin labels move above their content, as on every other page. The timesheet is
seven columns of 28 px cells on phones (it fits a 320 px screen with the week dates beside it)
and 36 px cells from 640 px up. The week dates stay in their own column at every width, like a
timesheet.

### Libraries

- One entry per library, stacked in the reading column, with "Released 30 Oct" (the latest
  release) in the time margin. **Not cards:** the theme rules out a grid
  of project cards with tech badges.
- Name (`text-xl`, 600), a one-line description in plain words, then label/value rows (the
  case-study meta list): Version, Install from, Links.
- **Status words come from Karthik, not from the version number:** "not yet stable" for
  workclock, "in development" for fiscalclock. Kept in `src/content/open-source.ts` beside each
  library, and changed only when Karthik says so.
- **Version and release date are live** from the registries. If the three registries ever
  disagree, show the version that is on all three, so the page never claims a release that isn't
  on every one.
- Registry links are plain text links named after the registry (npm, PyPI, crates.io). Icons
  would add little beside three short names.
- **No download counts.** At this stage they're small and mostly from bots and mirrors. A small
  number makes a library look unused; a big one invites doubt. Revisit once the libraries reach 1.0.
- **Later, optional:** a small live example on the workclock entry that runs the real package in
  the browser ("8 working hours from now ends at…"). It shows the library working, but needs a
  CSP change for WebAssembly, so it's out of the first version.

### Contributions: a status ledger (ADR 0018)

The pull requests read as a ledger that uses the timesheet's squares at a smaller size, so the
page has one visual language: **filled ultramarine = merged**, **ultramarine outline = in review**,
**dashed outline = draft**. No new colours; one new radius token, `radius-mark` (3 px), for the
12 px squares.

- **Per repository,** a heading row: the owner's logo (24 px), the repository name linking to it,
  its star count in muted text ("32k stars"; none shown for a repository with no stars), and a
  count line ("1 merged, 3 in review"). On the right, a tally: one square per pull request,
  newest first. The tally is hidden from screen readers; the count line says the same in words.
- **Per pull request,** a row with its date in the time margin (merged date, or the date it was
  opened), its status square, its title linking to the pull request, and its status and review
  time in words under it: "Merged in 2 days", "Merged the same day", "In review for 14 days".
  Shape and words carry the status, so colour is never the only signal.
- **Logos** are the repository owners' GitHub avatars, downloaded on the server with the rest of
  the data (64 px) and embedded as `data:` images. Visitors' browsers never contact GitHub, and
  the CSP needs no new host.
- **Star counts** are shown, small and muted. They tell a recruiter at a glance that SigNoz and
  Haystack are widely used projects, which is the real signal. This reverses the first version's
  "no star counts" (ADR 0018).
- Pull request titles are shown as written on GitHub, minus two kinds of noise: a commit-type
  prefix ("fix(charts): use…" becomes "Use…") and a trailing issue number ("(#179)"), which the
  link already carries.
- **Not shown:** pull request numbers, lines and files changed. An engineer sees them one click
  away; for a recruiter they're noise.
- **Left out:** pull requests to Karthik's own repositories and to the organisations Karthik has
  worked for (`hiddenOwners`), and repositories Karthik chose not to list (`hiddenRepos`), both in
  `src/content/open-source.ts`.
- **Maintainer quotes** appear only once a real one exists, and only after Karthik approves it.
  The page has no slot for them until then, so it never looks like something is missing.

### The timesheet (the one bold element)

The GitHub contribution graph is the default way to show activity, and it shows up on most
developer sites. This page uses a **weekly timesheet** instead, which fits "Working hours":

- **One row per week**, Monday to Sunday, starting with the week of 1 October 2026 and growing
  from there, with no rolling window. Each row's start date sits in the time margin, the same
  place the home page's chapters put their dates. The heading is just "Activity".
- **Each day is either shipped or not.** An active day is a filled `accent` square
  (`radius-band`). A day with no activity is an empty square with a `rule-strong`
  outline (3:1 contrast). Days before 1 October have no square at all.
- **No shades for volume.** GitHub's graph darkens busier days. That would push attention to raw
  counts (some days have over 200 contributions), which can read as automation. One shade says
  the only thing that matters here: Karthik showed up.
- **Today** is drawn with a dashed outline until the first contribution of the day, then filled
  like any other day. Today never counts as missed.
- **The sentence under it is generated from the data:** "Shipped something every day." when
  every day is active; otherwise "Active on 23 of 32 days." Honest either way, never a countdown,
  and without a date: the first row already shows where the record starts.
- GitHub returns a year of activity per request, so the data is fetched one year at a time from
  1 October 2026 and the record keeps growing past a year.

### Freshness line

"Updated from GitHub and the package registries at 10:20 on 1 Nov (Bengaluru time)." This is the
time the data was fetched, so a reader knows it's live. It's set in `muted` `text-xs`.

## Home page teaser

A new section between **Work** and **About**, in the same grid:

```text
  Open source    Maintains workclock and fiscalclock, published on npm,
                 PyPI and crates.io, and sends fixes to projects such as
                 Haystack.
                 [the last 4 weeks of the timesheet, small]
                 See open-source work
```

- The sentence is built from the data: the library names and the repositories with merged or
  open pull requests.
- The small timesheet shows only the last four weeks, so the section stays short.
- The link goes to `/open-source`.

## Navigation

Add **Open source** to the nav after Work (`Work · Open source · About · Contact`). It
goes to the page, not to a home section. It shows on desktop and in the phone menu. On
`/open-source` it is marked `aria-current="page"`. Between 768 and 1023 px the header shows the
monogram without the name, so four links, the theme toggle and Resume fit on one line.

## Where the data comes from

| What                                  | Source                                                     |
| ------------------------------------- | ---------------------------------------------------------- |
| Active days                           | GitHub GraphQL: the contribution calendar for Karthik-beta |
| Upstream pull requests                | GitHub: pull requests authored by Karthik-beta             |
| Versions and release dates            | crates.io, PyPI and npm public APIs                        |
| Descriptions, status words, hide list | `src/content/open-source.ts` (written with Karthik)        |

- **Fetched on the server**, cached with `"use cache"` and `cacheLife("hours")` (Next 16 Cache
  Components). The page is prerendered at build, served as a static page, and refreshed in the
  background at most once an hour when someone visits. Visitors never wait for GitHub.
- **A saved snapshot** (`src/content/open-source.snapshot.json`, committed) is used if a fetch
  fails or no token is set (local development, previews). The page is never empty and never
  shows an error. `bun run oss:snapshot` refreshes it.
- **GitHub token:** the contribution calendar is only available through GitHub's GraphQL API,
  which needs a token. A fine-grained token with no permissions beyond public read, stored in
  Vercel as `GITHUB_TOKEN` (server only, never `NEXT_PUBLIC_`).
- **No CSP change:** all fetching happens on the server. The browser loads nothing new.
- **Cost:** free. Background refreshes count toward Vercel Hobby's included ISR usage; one
  refresh an hour is far below the limits.

## Search and analytics

- Added to the sitemap. Its date is the latest activity date from the data.
- JSON-LD: each library as `SoftwareSourceCode` (name, `codeRepository`, `programmingLanguage`,
  author linked to the `Person` node), connected to the existing graph
  ([11](11-performance-and-seo.md)).
- Click events (ADR 0015) on registry links and pull request links, to see which ones get
  clicked.

## Accessibility

- The timesheet is a real `<table>` with a caption ("Days with activity, by week") and weekday
  column headers. Each cell's accessible name is its date and "active" or "no activity".
- Filled and outlined squares differ in shape as well as colour. Status words are text.
- The page uses no client-side JavaScript, so there is no loading state to announce.

## Design check against the theme

Checked against [04](04-theme.md) and the frontend-design guidance before writing this:

- **Generic version rejected:** a GitHub dot grid, a row of stat tiles (stars, downloads, PR
  count), and repository cards with language badges. That page would fit any developer's site.
- **What makes it ours:** the week dates sit in the time margin like a timesheet; one shade of
  ultramarine for "shipped"; libraries laid out like the hero's facts row; plain status words.
- **Colour, type, spacing:** existing tokens only (`paper`, `ink`, `muted`, `rule`, `accent`,
  `radius-band`), Instrument Sans, the existing type and spacing scales. No new tokens.
- **Motion:** none.
- **The bold element:** the timesheet on this page. On the home page the headline stays the one
  bold thing; the teaser's small timesheet is deliberately small.
