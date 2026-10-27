# 06: Navigation and sections

- Status: Approved (2026-10-27)
- Decision record: [ADR 0010](../decisions/0010-site-structure-and-navigation.md)

## Site map

| Route               | Page                                          | Indexed by search engines |
| ------------------- | --------------------------------------------- | ------------------------- |
| `/`                 | Home: skim layer, story, work, about, contact | Yes                       |
| `/work/aria`        | Case study: Aria (Pivotr)                     | Yes                       |
| `/work/job-matcher` | Case study: AI Job Resume Matcher             | Yes                       |
| `/work/workclock`   | Case study: workclock                         | Yes                       |
| `/work/blinkql`     | Case study: Blinkql (added 2026-10-27)        | Yes                       |
| `/resume.pdf`       | Resume download (static file)                 | Yes                       |
| `/styleguide`       | Design tokens and components                  | **No** (`noindex`)        |
| `/404`              | Not found page                                | No                        |

Each case study has its own URL, so Karthik can paste a direct link into an application or
email. Shorter projects (Pivotr's internal tools) appear on the home page only.

## Navigation bar

```text
Desktop:  KP  Karthik Parameshwara               Work  About  Contact  [◐]  [Resume]
Phone:    KP  Karthik Parameshwara                          [◐]  [Resume]  [Menu]
```

- **Slim:** 56 px tall, on the `paper` background with a `rule` line below it once the page has
  scrolled.
- **Hide on scroll down, show on scroll up.** The bar gets out of the way while reading and comes
  back the moment you scroll up, so the **Resume** button is always one gesture away. It's always
  shown at the very top of the page and whenever something in it has keyboard focus.
- **Name** links home. **Work / About / Contact** jump to sections on the home page (from a case
  study, they go to `/#work` etc.).
- **Theme toggle** (◐) cycles light → dark, and is labelled for screen readers.
- **Resume** is the only filled button in the nav: the most important action on the site.
- **Phone menu:** "Menu" opens a panel built on Base UI's `Dialog`, with the three section links
  as large targets. It closes on Escape, on outside tap, and when a link is chosen.
- **Current location:** on case-study pages, "Work" is marked `aria-current="page"` and underlined.

## Home page sections, mapped to the story

| #   | Section  | Story role (see private story doc) | Content                                                                                                           |
| --- | -------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 0   | Hero     | Skim layer                         | Name, headline, facts row (role, experience, availability, where), local time, Resume / Email / GitHub / LinkedIn |
| 1   | Proof    | Skim layer                         | Three verifiable facts: deployments, co-founder, open-source library                                              |
| 2   | Chapters | Story path                         | Four dated chapters in the time margin: customers first → learning to ship → building a company → now             |
| 3   | Work     | Story path                         | Three case-study summaries (linked) + two short entries                                                           |
| 4   | About    | Human layer                        | Small photo, short personal paragraph, languages                                                                  |
| 5   | Contact  | Action                             | One sentence, email (with copy button), links, resume                                                             |
| —   | Footer   | Housekeeping                       | Name, © year, links, "Source on GitHub"                                                                           |

The **first screen** (no scrolling, 375 × 667 phone and 1280 × 800 laptop) must show: name,
headline, role, experience, availability and the Resume button. This gets checked at every build
review.

## Hero section

- No image, no illustration: the headline is the visual.
- Order: name (small, 600 weight) → headline (display) → facts row → local-time band → actions.
- **Facts row:** four labelled pairs as a definition list (Role, Experience, Availability,
  Where). Labels are `muted` `text-xs`, sentence case.
- **Local time:** "It's 14:20 on Tuesday in Bengaluru". The page is static, so the server can't
  know the time: the HTML carries "Based in Bengaluru, India", an inline script swaps in the live
  time before first paint (never empty, never wrong), and it updates every 30 s.
- **Actions:** Download resume (primary button), then Email me, GitHub, LinkedIn as links with
  icons.

## Case-study page structure

1. Back link to Work.
2. Title (`text-3xl`) and one-sentence summary (`text-lg`).
3. Meta (definition list): role, dates, stack, links (live / code / docs).
4. **The problem** → **What I did** → **Outcome** (fixed headings, in this order, for every case
   study).
5. Optional figures (screenshots with captions).
6. Closing line naming what it proves (e.g. "ships to production").
7. Next case study link and a contact prompt.

Case-study dates use the same time margin as the home page.
