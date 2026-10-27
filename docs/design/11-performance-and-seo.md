# 11: Performance and SEO

- Status: Draft for approval
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

| Resource                          | Budget (compressed)                   |
| --------------------------------- | ------------------------------------- |
| HTML per page                     | ≤ 30 KB                               |
| CSS (total)                       | ≤ 20 KB                               |
| JavaScript (first load, per page) | ≤ 90 KB, mostly the framework runtime |
| Font                              | 1 file, ≤ 60 KB                       |
| Images above the fold (home)      | 0 (the hero is text)                  |
| Each case-study image             | ≤ 120 KB                              |

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
