# 0030: Karthik's own visits opt out with `?notrack`

- Status: Accepted
- Date: 2026-11-05

## Context

Karthik checks the site often, from several browsers and a phone. Those visits were counted by
Google Analytics, the X pixel and Cloudflare Web Analytics like anyone else's, which inflated the
numbers that matter (in early November, Mysuru and Bengaluru were the top cities).

## Options

1. **Blocker rules** (uBlock Origin) for the three tools on karthik.nz. Desktop only.
2. **GA's internal-traffic filter by IP address.** Home and mobile IP addresses change often, and
   it covers GA only.
3. **Label the visits as internal (`?admin`)** with GA's `traffic_type`, and keep them. Default
   reports still include them unless the filter is set to Active, the X pixel and Cloudflare can't
   take the label, and it needs a GTM change and a GA filter.
4. **A per-browser opt-out (`?notrack`)** in the site's own code.

## Decision

- **Option 4.** Visiting any page with `?notrack` stores `karthik.nz:notrack` in that browser's
  `localStorage`. From then on `src/components/site/analytics.tsx` loads neither Google Tag
  Manager (so no GA4 and no X pixel) nor the Cloudflare beacon. `?track` removes the mark. Both
  parameters are removed from the address bar after they're read.
- If storage is unavailable (blocked, or some private windows), tracking stays on.
- It isn't advertised on the site or on `/privacy`. It works for anyone who finds it, which is
  harmless.
- Checked by the verify skill's `analytics-opt-out` journey.

## Why

Karthik's own visits carry no information for a job hunt. Dropping them in the browser keeps
every default report clean, covers all three tools and every device, and needs no GTM or GA
setting that could later be changed by mistake. The cost is no record of Karthik's own visits,
and re-visiting `?notrack` after clearing browser data or in a new private window.
