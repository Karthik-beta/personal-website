# 11: Performance and SEO

- Status: Approved (2026-10-27)
- Decision record (analytics): [ADR 0011](../decisions/0011-icons-identity-analytics.md)

## Targets

Measured on the production URL with Lighthouse (mobile, simulated slow 4G) and Vercel/Chrome field
data once there is traffic.

| Metric                          | "Good" threshold | **Our target** |
| ------------------------------- | ---------------- | -------------- |
| Largest Contentful Paint (LCP)  | ≤ 2.5 s          | **≤ 1.5 s**    |
| Interaction to Next Paint (INP) | ≤ 200 ms         | **≤ 100 ms**   |
| Cumulative Layout Shift (CLS)   | ≤ 0.1            | **≤ 0.02**     |
| Lighthouse Performance          | —                | **≥ 95**       |
| Lighthouse Accessibility        | —                | **100**        |
| Lighthouse Best Practices       | —                | **100**        |
| Lighthouse SEO                  | —                | **100**        |

In plain terms: the main headline appears in under a second and a half on a mid-range phone,
nothing jumps around while loading, and taps respond instantly.

## Budgets

| Resource                          | Budget (compressed)                                        |
| --------------------------------- | ---------------------------------------------------------- |
| HTML per page                     | ≤ 30 KB                                                    |
| CSS (total)                       | ≤ 20 KB                                                    |
| JavaScript (first load, per page) | ≤ 165 KB, of which ~140 KB is the React + Next.js baseline |
| Font                              | 1 file, ≤ 60 KB                                            |
| Images above the fold (home)      | 0 (the hero is text)                                       |
| Each case-study image             | ≤ 120 KB                                                   |

**Why the JavaScript budget changed (2026-10-27):** the original 90 KB assumed a lighter
framework runtime. Measured on the production build, React 19 and the Next.js 16 client runtime
alone are about 140 KB compressed on every page, before any of the site's own code. That baseline
can't be cut without changing framework, so the budget now covers it plus a small margin. What
the budget really guards is **the site's own code**: keep it to roughly 25 KB, and load anything
heavy on demand (as the phone menu's dialog is).

### Measured so far

Local Lighthouse 13.5, simulated mid-range phone on slow 4G, production build (2026-10-27):

| Page                | Perf | Accessibility | Best practices | SEO | CLS | JS     |
| ------------------- | ---- | ------------- | -------------- | --- | --- | ------ |
| `/`                 | 73   | 100           | 100            | 100 | 0   | 151 KB |
| `/work/aria`        | 85   | 100           | 100            | 100 | 0   | 157 KB |
| `/work/job-matcher` | 72   | 100           | 100            | 100 | 0   | 157 KB |
| `/work/workclock`   | 76   | 100           | 100            | 100 | 0   | 157 KB |

Local performance scores are noisy: Lighthouse simulates a slow phone by scaling the host
machine's CPU, which was busy with other work. Blocking time varied by up to 0.8 s between runs
of the same page. **The performance target is re-checked with PageSpeed Insights on the live site
in Phase 6**, and any further work is decided then.

Live site, https://karthik.nz on Vercel, same Lighthouse settings (2026-10-27). PageSpeed Insights
itself could not be run that day (the anonymous API quota was used up), so these are local
Lighthouse runs against the production URL. Home was run three times:

| Page                | Perf  | Accessibility | Best practices | SEO | LCP       | TBT        | CLS | JS     |
| ------------------- | ----- | ------------- | -------------- | --- | --------- | ---------- | --- | ------ |
| `/`                 | 84–91 | 100           | 96\*           | 100 | 2.3–2.9 s | 220–400 ms | 0   | 153 KB |
| `/work/aria`        | 90    | 100           | 96\*           | 100 | 2.7 s     | 260 ms     | 0   | 159 KB |
| `/work/job-matcher` | 92    | 100           | 96\*           | 100 | 2.7 s     | 210 ms     | 0   | 159 KB |
| `/work/workclock`   | 88    | 100           | 96\*           | 100 | 2.7 s     | 270 ms     | 0   | 159 KB |

\* The test machine's DNS blocks `static.cloudflareinsights.com`, so the analytics script failed
to load and logged a console error. That is a property of the test machine, not of the site.

The LCP element is the headline paragraph (text, as planned). On the real network it painted
about 0.5 s after the request started (0.16 s to first byte plus 0.31 s render delay); the 2.3–2.9 s
figures come from Lighthouse's simulated slow phone.

## How we get there

- **Static pages.** Every page is pre-rendered at build time and served from Vercel's CDN. No
  server work per visit.
- **Little client JavaScript.** Only four small interactive pieces run in the browser: the nav
  (scroll behaviour + phone menu), the theme toggle, the local time, and copy email. Everything else
  is a server component, with zero JavaScript.
- **The hero is text**, so the LCP element is the headline: fast by nature.
- **Fonts:** one self-hosted variable file, preloaded, with matched fallback metrics (no layout
  shift). See [02](02-typography.md).
- **Images:** `next/image` with explicit sizes, AVIF/WebP, lazy-loaded below the fold. Source
  images are pre-sized, so we stay comfortably inside Vercel Hobby's free image-optimisation
  limits.
- **No third-party embeds** (no YouTube, fonts CDN, chat widgets). The only third-party script is
  analytics, loaded `defer`.

## Metadata

Set with Next.js's Metadata API in `layout.tsx` and each page.

- **Title template:** `%s | Karthik Parameshwara`. Home: "Karthik Parameshwara | Software
  engineer".
- **Description:** the approved one-line pitch, under 160 characters for home, plus a per-case-study
  summary.
- **Canonical URL:** `https://karthik.nz` plus the path (`metadataBase`).
- **Open Graph:** `og:title`, `og:description`, `og:url`, `og:type` (`website` for home,
  `article` for case studies), `og:image` 1200 × 630 ([08](08-imagery-and-identity.md)).
- **X / Twitter card:** `summary_large_image`, `twitter:creator` `@K4rthik__`.
- **Theme colour:** `paper` for light and dark (`<meta name="theme-color">` with media queries).

## Structured data (JSON-LD)

A `Person` object on the home page, using only confirmed facts:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Karthik Parameshwara",
  "url": "https://karthik.nz",
  "jobTitle": "Software Engineer",
  "address": { "@type": "PostalAddress", "addressLocality": "Bengaluru", "addressCountry": "IN" },
  "alumniOf": { "@type": "CollegeOrUniversity", "name": "MVJ College of Engineering" },
  "knowsAbout": ["TypeScript", "Node.js", "NestJS", "Next.js", "React", "PostgreSQL", "Docker"],
  "sameAs": [
    "https://github.com/Karthik-beta",
    "https://www.linkedin.com/in/karthik-paramesh",
    "https://x.com/K4rthik__"
  ]
}
```

Case-study pages may add `CreativeWork` later. Validated with Google's Rich Results Test before
launch.

## Sitemap and robots

- `src/app/sitemap.ts` lists `/` and every `/work/*` page.
- `src/app/robots.ts` allows everything except `/styleguide`, and points to the sitemap.
- `/styleguide` also sets `robots: { index: false, follow: false }` in its metadata, because
  robots.txt alone doesn't stop a page that's linked elsewhere from being indexed.

## Analytics

**Cloudflare Web Analytics** (free).

- **Why:** cookie-free, so no consent banner is needed; privacy-friendly; no cost; and the domain
  is already on Cloudflare.
- **What it shows:** page views, top pages (e.g. which case studies get opened), referrers (e.g.
  LinkedIn), countries, devices, and Core Web Vitals from real visitors.
- **Setup:** Cloudflare's small beacon script, added in `layout.tsx` with `strategy="afterInteractive"`,
  with the site token stored in an environment variable (`NEXT_PUBLIC_CF_BEACON_TOKEN`).
  It only loads in production. Configured during Phase 6.
- **Resume downloads** show up as page views of `/resume.pdf`.
- No other tracking, no cookies, no fingerprinting.
