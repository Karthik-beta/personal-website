# 01: Design principles

- Status: Approved (2026-10-27)
- Applies to: every page, component and asset on karthik.nz

These principles come from two things: who visits the site and what Karthik's story is.
**Who:** recruiters and hiring managers first, engineers second. **What:** a backend-leaning
full-stack engineer who sees software through to production. When two options both look fine,
the principles decide.

## 1. Ten seconds first, then the story

A recruiter must get role, experience, location, availability, stack, resume and contact
**without scrolling**, on a phone or a laptop. Everything else (chapters, case studies) is the
second reading path, for people who want more.

- _In practice:_ the hero is a fact sheet with one strong headline, not a splash screen. The resume
  button is visible on the first screen and one tap away from anywhere (see
  [06](06-navigation-and-sections.md)).
- _Why:_ recruiters scan dozens of profiles a day. If the basics take effort, they move on before
  the story gets a chance.

## 2. Time is the structure

Karthik's work keeps coming back to time: shifts that cross midnight, SLAs, working hours, go-live
dates. The site borrows that: **dates sit in a left margin like a schedule**, and the hero shows
the current time in Bengaluru.

- _In practice:_ dates are only used where the content really is a sequence (career chapters, a
  case study's timeline). No decorative numbering (01, 02, 03) anywhere.
- _Why:_ structure should carry information. A dated margin lets a reader scan a career in
  seconds, and it's a detail only this site would have.

## 3. Evidence over adjectives

Show what was shipped and to whom: deployments, dates, links to real code. Never "passionate",
never skill bars.

- _In practice:_ every claim on the page is either a fact Karthik confirmed or a link someone can
  check. Numbers are set with aligned (tabular) figures so they read as data.
- _Why:_ hiring managers trust specifics. Adjectives are free; evidence isn't.

## 4. Calm and precise

One typeface, one accent colour, ink on paper. Hierarchy comes from size, weight and spacing, not
from boxes, shadows or colour.

- _In practice:_ no cards around every block, no gradients, no decorative illustrations. Rules
  (thin lines) separate things only where a separation exists in the content.
- _Why:_ the tone of voice is "calm and precise". The design should sound the same as the words.

## 5. Spend boldness in one place

The **hero headline** is the one loud thing: large, narrowed type. Everything around it stays
quiet and disciplined.

- _Why:_ one memorable element beats many competing ones. It also keeps the page fast and easy to
  maintain.

## 6. Accessible and fast by default

WCAG 2.2 AA is the floor, not a stretch goal. Pages are static, light and readable without
JavaScript. See [10](10-accessibility.md) and [11](11-performance-and-seo.md).

- _Why:_ a slow or inaccessible portfolio from an engineer is evidence too, just the wrong kind.

## 7. Built for both readers

Recruiters read words; engineers also read the source. The public repo, these docs and the code
should be as tidy as the page.

- _Why:_ the site is itself a work sample.

## Deliberately avoided

| Avoid                                                                  | Because                                                  |
| ---------------------------------------------------------------------- | -------------------------------------------------------- |
| Generic template layout (big hero, three feature cards, gradient blob) | Reads as a template, or as AI-generated                  |
| Heavy animation, 3D, scroll-jacking                                    | Slow, distracting, bad for accessibility                 |
| Dark "hacker" look (terminal green, monospace everywhere)              | Cliché, and narrows the audience to engineers            |
| Skill bars and percentage meters                                       | Meaningless numbers that experienced reviewers distrust  |
| All-caps eyebrow labels, "01 / 02 / 03" markers, "→" on every link     | Template habits that add noise, not information          |
| Pulsing "available" dots                                               | Overused; availability is stated plainly in text instead |
| Cream background with serif display and a terracotta accent            | Currently the most common generated-site look            |
