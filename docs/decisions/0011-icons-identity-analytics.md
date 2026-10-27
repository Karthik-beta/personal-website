# 0011: Icons, monogram and analytics

- Status: Accepted
- Date: 2026-10-27

## Context

Three smaller choices were needed for the design docs: how much to use icons, what the
monogram/favicon is based on, and which free analytics to use.

## Options

Icons:

1. **A few functional icons** (download, email, external link, theme, menu, brand marks) from
   Lucide plus Simple Icons, inlined.
2. **Text only.**

Monogram:

1. **"KP" in the site typeface.**
2. **A clock-hand mark.**
3. **Name wordmark only.**

Analytics:

1. **Cloudflare Web Analytics:** free, cookie-free, privacy-friendly; the domain is already on
   Cloudflare.
2. **Vercel Web Analytics:** built in, but the free plan caps events and keeps data for less time.
3. **None.**

## Decision

- **A few functional icons**, from Lucide (ISC) and Simple Icons (CC0), inlined as SVG with no
  external requests. Always paired with a text label or an `aria-label`.
- **"KP" monogram** in Instrument Sans (weight 700, width 78), white on ultramarine, used for the
  favicon, nav and OG image. Produced in Canva in Phase 4.
- **Cloudflare Web Analytics**, production only, token in an environment variable, set up in
  Phase 6.

## Why

Icons speed up scanning for actions without adding visual noise. The monogram stays legible at
16 px and consistent with the site's type. Cloudflare analytics shows whether recruiters visit
and what they open, with no cookies, no banner and no cost.
