# 0029: The X (Twitter) pixel runs on karthik.nz; the LinkedIn tag is dropped

- Status: Accepted
- Date: 2026-11-05
- Builds on: [0028](0028-google-tag-manager.md)

## Context

Karthik runs ads on X that send visitors to karthik.nz (about 115 sessions from "x / ad" in the
first week of November, per Google Analytics). The X pixel (ID `ri4iu`) was added to the Google
Tag Manager container, but the site's CSP blocked its script, so X recorded nothing from the site
and couldn't tell which ad visitors went on to read, open the resume or get in touch.

## Options

1. **Allow the X pixel** in the CSP and disclose it on `/privacy`.
2. **Pause the X tags** in GTM and judge X traffic from Google Analytics alone, by source.

## Decision

- **Option 1.** The CSP in `next.config.ts` allows `static.ads-twitter.com` (the `uwt.js`
  script) and the hosts it reports to: `analytics.x.com`, `analytics.twitter.com` and `t.co`.
  These were read from `uwt.js` itself.
- **In GTM**, one X tag loads the pixel on All Pages. The duplicate copy is removed.
- **Two X conversion events** (both type Custom, created in X Events Manager) are sent from GTM
  on the site's existing data-layer events: "Resume viewed" (`tw-ri4iu-rik1z`) on
  `resume_open` or `resume_download`, and "Contact" (`tw-ri4iu-rik21`) on `email_click` or
  `email_copy`. X can then report which ad clicks led to a resume view or contact.
- **`/privacy`** gains an "X (Twitter) pixel" section with a link to X's ad preferences. The
  intro no longer says the data is never used for ads, because the X pixel exists to measure
  ads.
- **The LinkedIn Insight Tag is dropped** (planned in ADR 0028, never installed). Karthik decided
  against it: its hosts leave the CSP and its section leaves `/privacy`.
- **Apollo** stays blocked by the CSP: it would add visitors to a sales database.

## Why

Karthik pays for X traffic and wants to know whether it leads to resume opens and contact. The
pixel is disclosed on `/privacy` with a way to opt out. Without a consent banner (ADR 0015), the
same trade-off applies: it's accepted knowingly for a personal site.
