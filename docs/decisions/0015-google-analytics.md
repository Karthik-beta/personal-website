# 0015: Google Analytics for clicks and behaviour

- Status: Accepted
- Date: 2026-10-31

## Context

Cloudflare Web Analytics (ADR 0011) counts visits, pages, referrers and speed, but can't record
actions: who opened the resume, clicked the email address, went to GitHub or LinkedIn, or read a
case study to the end. Karthik wanted that detail.

## Options

1. **Umami Cloud (free plan):** cookie-free, about 2 KB, custom events, no banner. A new account
   and less detail than Google Analytics.
2. **PostHog:** funnels and session recordings. A much larger script, and recording recruiters'
   sessions is intrusive for a personal site.
3. **Google Analytics 4:** free and the most detailed, but it sets cookies, so EU and UK law
   expects consent. Within that, three ways to handle EU and UK visitors:
   - No cookies for them via Consent Mode (no banner, but they mostly vanish from reports).
   - Track everyone with no banner.
   - A consent banner.

## Decision

- **Google Analytics 4, tracking everyone, with no consent banner.** Cloudflare Web Analytics
  stays for cookie-free counts and real-visitor speed data.
- Loaded like the Cloudflare beacon:
  - production only, on karthik.nz only, after the page is interactive;
  - the measurement ID comes from `NEXT_PUBLIC_GA_ID`, set in Vercel.
- **Events:**
  - Enhanced measurement (set in the GA property) records page views on client-side
    navigation, outbound clicks, scrolling and PDF opens.
  - `src/components/site/analytics.tsx` adds three: `resume_open`, `email_click`, and
    `email_copy` (elements with a `data-track` attribute send their own event).
- **The CSP** allows Google's tag hosts: `www.googletagmanager.com`, `*.google-analytics.com` and
  `*.analytics.google.com`, plus `www.google.com`, which the tag also
  reports to.
- **A short `/privacy` page**, linked from the footer and kept out of search results, says what
  is recorded and how to opt out. Google's terms require that disclosure.
- **In the GA property:**
  - data retention stays at two months, which the privacy page states;
  - Google Signals stays off;
  - the property isn't linked to Google Ads.

## Why

Karthik chose the most detailed free tool and accepted the trade-off knowingly. Without a
banner, tracking EU and UK visitors breaks their cookie rules. The realistic risk is low for a
personal site. A banner, though, would be the first thing a recruiter sees. Keeping Cloudflare
means the visitors Google misses (people with blockers, which many developers use) still show up
in the counts.
