# 0013: Search visibility and security headers

- Status: Accepted
- Date: 2026-10-28

## Context

After launch, Karthik asked for the site to be more discoverable, trustworthy and credible. An
audit of the live site against Google's Search documentation found it had the basics (a Person
JSON-LD block, canonical URLs, link previews, sitemap, HTTPS, SPF and DMARC), but:

- the structured data was a single Person block on the home page, unconnected to the case
  studies, and named a college the page never mentioned;
- the sitemap sent `changefreq` and `priority`, which Google ignores, and no `lastmod`;
- the only security header was Vercel's HSTS;
- the site wasn't verified in Google Search Console or Bing Webmaster Tools.

## Options

Structured data:

1. **Leave the Person block as it is.**
2. **A connected graph:** WebSite (site name), ProfilePage around the Person, and an Article
   plus breadcrumbs on each case study, all pointing to one Person `@id`.

Content Security Policy (pages are pre-rendered, so there is no per-request nonce):

1. **Nonce-based CSP:** strictest, but every page would render per request, losing static
   speed and CDN caching.
2. **Static CSP with `'unsafe-inline'` scripts:** keeps pages static; still blocks third-party
   scripts, plugins, framing and off-site form posts.
3. **Experimental SRI hashes:** strict and static, but experimental in Next.js 16.

Extras: `llms.txt`, `security.txt`, a web app manifest, `humans.txt`.

## Decision

- **Connected structured data** (`src/lib/structured-data.ts`), with `alternateName: "Karthik P"`
  so search engines can tie the LinkedIn and resume name to this site. The college is now named
  in the "Customers first" chapter, so the markup matches what readers see.
- **Real `lastmod` dates** in the sitemap, from `site.updated` and each case study's `updated`.
- **Static CSP** plus `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Cross-Origin-Opener-Policy` and `Permissions-Policy`, set in `next.config.ts`. HSTS stays as
  Vercel sends it, **without `includeSubDomains`**, which would also bind workclock.karthik.nz
  and blinkql.karthik.nz.
- **Google Search Console and Bing Webmaster Tools** (both free), verified through a DNS TXT
  record in Cloudflare that Karthik adds.
- **No extras for now.** Google Search doesn't use `llms.txt`; `security.txt` needs a yearly
  expiry update; a manifest and `humans.txt` do nothing useful for a portfolio.

## Why

Structured data helps search engines show the right name and connect Karthik's profiles into one
person, which matters most for searches of Karthik's own name. Security headers are a cheap
credibility signal to engineers who inspect the site, and they block whole classes of attack.
Search Console is the only way to see whether Google has indexed the site and what people
searched to find it.
