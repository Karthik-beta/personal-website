# 12: Pre-launch polish checklist

- Status: Draft for approval
- Run in full before launch, and the relevant parts before any major change.

## Content and facts

- [ ] Every fact matches the approved private story and messaging docs. No invented numbers.
- [ ] No `TODO(karthik)` left anywhere in `src/` (`grep -r "TODO(karthik)" src` returns nothing).
- [ ] Name, company names and dates match the facts style sheet exactly, on the site **and** on the
      resume PDF **and** on LinkedIn.
- [ ] "Available now" is still true.
- [ ] Resume PDF is the latest version, opens, has selectable text, and is named
      `resume.pdf`.
- [ ] Spelling and grammar checked (en-GB or en-US chosen and consistent: `TODO(karthik)` decide).
- [ ] All external links work (GitHub, LinkedIn, X, project links, docs).

## Skim test (the 10-second rule)

- [ ] On a 375 × 667 phone and a 1280 × 800 laptop, the first screen shows: name, headline, role,
      experience, availability and the Resume button.
- [ ] Someone unfamiliar with the site can say, after 10 seconds, what Karthik does and how to
      get in touch. (Ask a friend.)

## Visual

- [ ] Only tokens from [03](03-color.md); no stray hex values in components.
- [ ] Type sizes only from the scale in [02](02-typography.md).
- [ ] Both themes checked on every page; the theme toggle works and remembers the choice.
- [ ] No flash of the wrong theme on load.
- [ ] Widths 320, 375, 414, 768, 1024, 1280, 1440: no sideways scrolling, nothing overlaps.
- [ ] Hairlines and spacing consistent; facts and dates line up.
- [ ] Favicon visible in browser tabs (light and dark browser UI); apple-touch icon set.
- [ ] OG image appears correctly when the link is pasted into LinkedIn, Slack and WhatsApp.

## Accessibility

- [ ] Lighthouse Accessibility = 100 on every page, both themes.
- [ ] axe DevTools: zero violations.
- [ ] Keyboard-only pass: skip link, nav, menu, all links and buttons, visible focus everywhere.
- [ ] Screen reader pass (NVDA): headings, landmarks, link names, copy-email announcement.
- [ ] 200% zoom and reduced motion checked.

## Performance and SEO

- [ ] `bun run check` and `bun run build` pass with no warnings.
- [ ] Lighthouse (mobile): Performance ≥ 95, Best Practices 100, SEO 100.
- [ ] LCP ≤ 1.5 s, CLS ≤ 0.02 in the Lighthouse run.
- [ ] Titles, descriptions, canonical URLs and OG tags on every page.
- [ ] JSON-LD validates in Google's Rich Results Test.
- [ ] `/sitemap.xml` and `/robots.txt` correct; `/styleguide` is `noindex` and disallowed.
- [ ] Custom 404 page exists and links home.

## Deployment

- [ ] karthik.nz and www.karthik.nz both serve the site over HTTPS (one redirects to the other).
- [ ] The old LinkedIn redirect rule in Cloudflare is removed.
- [ ] **workclock.karthik.nz still works** (checked after DNS changes).
- [ ] Cloudflare Web Analytics receives the first page view.
- [ ] GitHub profile, LinkedIn and resume "website" fields point to karthik.nz.
