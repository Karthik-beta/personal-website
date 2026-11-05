# 0028: Google Tag Manager loads Google Analytics and the LinkedIn Insight Tag

- Status: Accepted; the LinkedIn Insight Tag was dropped and the X pixel added by
  [0029](0029-x-pixel.md)
- Date: 2026-11-05
- Updates: [0015](0015-google-analytics.md) (how Google Analytics is loaded)

## Context

Google Analytics 4 was loaded with Google's gtag.js snippet (ADR 0015). Karthik wanted Google Tag
Manager, so tags can be added from its dashboard without code changes, starting with the LinkedIn
Insight Tag. That tag shows the companies, industries and job titles of visitors in aggregate,
which is useful during a job hunt.

## Options

1. **Replace gtag.js with a GTM container.** GA4 and every later tag are set up inside GTM. The
   page still loads one Google script.
2. **Add GTM next to gtag.js.** The least code change, but two Google scripts load, and setting
   GA4 up in both would count every visit twice.
3. **Keep gtag.js only.** It's enough for GA4 alone, but every new tag needs a code change.

## Decision

- **Option 1.** `src/components/site/analytics.tsx` loads the container from
  `NEXT_PUBLIC_GTM_ID`, set in Vercel, under the same rules as before: production only, on
  karthik.nz only, after the page is interactive. `NEXT_PUBLIC_GA_ID` is no longer read.
- **Events** keep their names and parameters. `src/lib/track.ts` pushes them to the data layer as
  `{ event, ...params }`, resetting the parameters it doesn't set so that values from one event
  don't carry over to the next. In GTM, one GA4 Event tag forwards them (see below).
- **The CSP** stays static and strict. It allows GTM and GA4, GTM's preview mode
  (`tagmanager.google.com`, the gstatic hosts and Google Fonts) and the LinkedIn Insight Tag
  (`snap.licdn.com`, `px.ads.linkedin.com`, `www.linkedin.com`). A tag from any other host is
  blocked until it is added to `next.config.ts`. `'unsafe-eval'` stays off, so GTM "Custom
  JavaScript" variables don't run.
- **`/privacy`** gains a LinkedIn section that says what the tag records and how to opt out.

### The GTM container

- **Google tag**: the GA4 measurement ID, fired on "Initialization - All Pages".
- **GA4 Event**: Event Name `{{Event}}`, fired on a Custom Event trigger that matches the regex
  `^(email_click|email_copy|resume_open|resume_download|case_study_open|case_study_read|video_play|ask_ai|mcp_install|clock_toggle|pr_link|repo_link|package_link|package_docs|package_source)$`.
  A new `data-track` name must be added to this regex. Event parameters
  `link_text`, `link_url`, `placement`, `video`, `case_study` and `reading_minutes`, each from a
  Data Layer Variable of the same name.
- **LinkedIn Insight**: GTM's built-in "LinkedIn Insight" template with the Partner ID, fired on
  All Pages.
- ADR 0015's GA property settings are unchanged: two months' retention, Google Signals off, no
  Google Ads link.

## Why

One container keeps the page as fast as before while letting Karthik add tags without a deploy.
Keeping the CSP strict means a tag added in GTM can't load code from an unknown host without a
reviewed code change.
