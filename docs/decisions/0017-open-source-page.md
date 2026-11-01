# 0017: An open-source page with live data

- Status: Accepted (2026-11-01)
- Date: 2026-11-01
- Design: [13-open-source](../design/13-open-source.md)

## Context

Karthik maintains two published libraries (workclock and fiscalclock, on npm, PyPI and
crates.io), has started sending pull requests to other projects, and has been active on GitHub
every day since 10 October 2026. None of this is on the site except workclock's case study.

Typing these facts into the site would go stale within days. The value is in the evidence being
current and checkable, so the data should come from GitHub and the registries directly.

## Options

**Placement:** a home section only; its own page with a home teaser; or folded into Work.

**Streak:** a live "N days in a row" counter; a calendar without a counter; or leaving it out.

**Pull requests:** all merged and open; merged only; or hand-picked.

**Data:** fetched on the server and cached for an hour; rebuilt daily by a GitHub Action calling
a Vercel deploy hook; or fetched by the visitor's browser.

## Decision

1. **Its own page, `/open-source`, plus a teaser on the home page** between Work and About.

2. **Activity is a weekly timesheet with no counter**, one shade for "active". The sentence under
   it is generated from the data and stays honest if a day is missed.
3. **Every merged or open upstream pull request is listed** with its status in words. Closed,
   unmerged pull requests, Karthik's own repositories and former employers' organisations are left
   out.
4. **Server fetch with `"use cache"` and `cacheLife("hours")`**, a committed snapshot as the
   fallback, and a read-only `GITHUB_TOKEN` in Vercel.
5. **No download counts or star counts** while the libraries are pre-1.0.
6. **"Open source" in the nav**, after Work.

## Why

- A page of its own gives a direct link Karthik can paste into an application, like the case
  studies. The teaser keeps the skim path short.
- A counter turns one missed day into a visible failure. A timesheet shows the same consistency
  without that risk, and it matches the "Working hours" direction.
- Showing open pull requests as "In review" is honest and shows current activity. Hiding them
  would leave one entry.
- Server-side caching keeps the page as fast as a static one, refreshes it without redeploys,
  needs no CSP change, and costs nothing on Vercel Hobby. The snapshot means a GitHub outage
  never shows as an empty or broken section.
- Small download numbers make a young library look unused, and large raw activity numbers can
  read as automation. The page shows evidence that holds up when an engineer clicks through.
