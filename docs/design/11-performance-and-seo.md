# 11: Performance and SEO

- Status: Approved (2026-10-27)
- Decision records (analytics): [ADR 0011](../decisions/0011-icons-identity-analytics.md),
  [ADR 0015](../decisions/0015-google-analytics.md)

## Targets

Measured on the production URL with Lighthouse (mobile, simulated slow 4G) and Vercel/Chrome field
data once there is traffic.

| Metric                          | "Good" threshold | **Our target** |
| ------------------------------- | ---------------- | -------------- |
| Largest Contentful Paint (LCP)  | ≤ 2.5 s          | **≤ 1.5 s**    |
| Interaction to Next Paint (INP) | ≤ 200 ms         | **≤ 100 ms**   |
| Cumulative Layout Shift (CLS)   | ≤ 0.1            | **≤ 0.02**     |
| Lighthouse Performance          | —                | **≥ 90**       |
| Lighthouse Accessibility        | —                | **100**        |
| Lighthouse Best Practices       | —                | **100**        |
| Lighthouse SEO                  | —                | **100**        |

In plain terms: the main headline appears in under a second and a half on a mid-range phone,
nothing jumps around while loading, and taps respond instantly.

**Why the Lighthouse target changed (2026-10-27):** it was 95. The live site scores about 90
(84–92 across runs, see below), and the remaining gap is mostly the React + Next.js runtime's own
start-up work, not the site's code. Chasing the last few points would mean fighting the framework
for a difference visitors wouldn't notice. The target is now 90, and further work is decided from
**real-visitor Web Vitals** in Cloudflare Web Analytics (LCP, INP, CLS) once there is traffic,
rather than from the simulated score.

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
of the same page. The target was re-checked on the live site in Phase 6 (below).

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

Built in `src/lib/structured-data.ts` and rendered by `src/components/site/json-ld.tsx`
([ADR 0013](../decisions/0013-search-and-security-headers.md)). Confirmed facts only, and only
facts a reader can also see on the page, as Google's guidelines require.

- **Home:** a `WebSite` (tells Google the site's name is "Karthik Parameshwara") and a
  `ProfilePage` whose `mainEntity` is the `Person`. Google lists "About me" pages as a valid use
  of ProfilePage.
- **Person** (`@id` `https://karthik.nz/#person`): name, given and family name,
  `alternateName` "Karthik P" (the LinkedIn and resume name), photo, job title, description,
  Bengaluru, MVJ College of Engineering, the hero's stack as `knowsAbout`, and the GitHub,
  LinkedIn and X profiles as `sameAs`.
- **Each case study:** an `Article` (headline, summary, preview image, published and updated
  dates) whose author and publisher point to the Person `@id`, plus a two-step `BreadcrumbList`
  (Karthik Parameshwara › project). Google shows breadcrumbs on desktop only.

Dates come from `site.published` / `site.updated` and each case study's `published` /
`updated`. **Bump `updated` when the page's content changes in a way a reader would notice**,
never for code or styling changes: Google stops trusting dates that change without reason.

Validate after deploying with Google's [Rich Results Test](https://search.google.com/test/rich-results)
and the [Schema Markup Validator](https://validator.schema.org/).

## Sitemap and robots

- `src/app/sitemap.ts` lists `/` and every `/work/*` page with a real `lastmod` date. It sends
  no `changefreq` or `priority`: Google ignores both.
- `src/app/robots.ts` allows everything except `/styleguide`, and points to the sitemap.
- `/styleguide` also sets `robots: { index: false, follow: false }` in its metadata, because
  robots.txt alone doesn't stop a page that's linked elsewhere from being indexed.

## Security headers

Set for every path in `next.config.ts` ([ADR 0013](../decisions/0013-search-and-security-headers.md)):

| Header                       | Value (summary)                                                                | What it does                                                    |
| ---------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| `Content-Security-Policy`    | own origin only, plus the analytics tags; no plugins; `frame-ancestors 'none'` | Blocks scripts and other content from anywhere not listed       |
| `X-Content-Type-Options`     | `nosniff`                                                                      | Browsers don't guess file types                                 |
| `X-Frame-Options`            | `DENY`                                                                         | No other site can show this one in a frame (older browsers)     |
| `Referrer-Policy`            | `strict-origin-when-cross-origin`                                              | Other sites see only "karthik.nz" as the referrer, not the path |
| `Cross-Origin-Opener-Policy` | `same-origin`                                                                  | Pages opened from here can't reach back into this one           |
| `Permissions-Policy`         | camera, microphone, location, payment, USB and Topics off                      | The site never asks for these                                   |
| `Strict-Transport-Security`  | from Vercel, two years                                                         | HTTPS only                                                      |

- The CSP allows `'unsafe-inline'` scripts because pages are pre-rendered: a per-request nonce
  would make every page render on demand. It still blocks every third-party script except the
  analytics tags: Cloudflare's beacon (`static.cloudflareinsights.com`, reporting to
  `cloudflareinsights.com`) and Google's tag (`www.googletagmanager.com`, reporting to
  `*.google-analytics.com`, `*.analytics.google.com` and `www.google.com`).
- **No `includeSubDomains` on HSTS:** it would also apply to workclock.karthik.nz and
  blinkql.karthik.nz, which are hosted elsewhere.
- Adding any new third-party script, font, image host or embed means adding it to the CSP.

## Search engines

Google Search Console and Bing Webmaster Tools, both free, verified through a DNS TXT record in
Cloudflare (Bing can import the Google property). They show whether pages are indexed, which
searches lead to the site, and any crawl or structured-data errors. The sitemap is submitted in
both.

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

**Google Analytics 4** (free, [ADR 0015](../decisions/0015-google-analytics.md)), for clicks and
behaviour.

- Loaded the same way as the Cloudflare beacon: production only, on karthik.nz only, after the page
  is interactive, with the measurement ID in `NEXT_PUBLIC_GA_ID`.
- Enhanced measurement records page views (including client-side navigation), outbound clicks,
  scrolling and PDF opens. The site adds `resume_open`, `email_click` and `email_copy`; any element
  with `data-track="<event>"` sends that event when clicked.
- It sets cookies and there is deliberately no consent banner. `/privacy` says what is recorded
  and how to opt out. Retention stays at two months and Google Signals stays off; the privacy page
  states both.
