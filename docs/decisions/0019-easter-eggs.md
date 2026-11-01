# 0019: Four easter eggs, each where only a curious visitor looks

- Status: Accepted
- Date: 2026-11-01

## Context

Karthik wanted a few easter eggs: clever rather than added for the sake of it, and not overdone.
The design rules out most of the usual ones. Motion only answers the visitor
([09](../design/09-motion-and-interactions.md)), the "hacker" look is avoided
([01](../design/01-principles.md)), and the hero belongs to the ten-second skim.

## Options

Approved, from a shortlist of four:

1. **404 heading:** a line that echoes the hero headline. Found by anyone who follows a dead link.
2. **Console note:** a short note in the browser's developer tools. Found by engineers who inspect
   the site.
3. **curl card:** `curl https://karthik.nz` prints a plain-text card. The most familiar idea of
   the four; developer sites do it fairly often.
4. **Clock time difference:** tapping the hero's Bengaluru time shows the visitor's own time. The
   only one in the hero.

Left out:

- Konami codes, confetti, hidden games, cursor trails and tab-title tricks. They would fit any
  site, and most of them move on their own.
- ASCII-art banners and a fake terminal mode: the "hacker" look.
- A print-only date stamp: almost nobody would see it.
- Later, not now: the career facts as a CSV to query in Blinkql
  (`SELECT * FROM 'https://karthik.nz/career.csv'`). It becomes worth doing once Blinkql has
  shareable query links.

## Decision

All four:

1. The 404 heading reads "This page never made it to production". The tab title ("Page not
   found") and the line about old or mistyped links stay.
2. `src/instrumentation-client.ts` logs one note per page load: the Bengaluru time, the public
   source, the commit the page was built from (`NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA`, left out when
   unset), a hint to try curl, and availability with the email address.
3. A `beforeFiles` rewrite in `next.config.ts` sends `/` to `/card.txt` when the user agent starts
   with `curl/`. The route renders per request, for the live time, and is never cached. Other
   paths still return HTML.
4. The hero's time line is a button. A tap switches it to the visitor's time and the gap to
   Bengaluru ("It's 09:50 on Sunday where you are, 4 h 30 min behind Bengaluru"), and another tap
   switches it back. Clicks send a `clock_toggle` event to Google Analytics.

The time sentence is written once, in `src/lib/bengaluru-time.ts`, and the hero, the console note
and the card all use it.

## Why

- Each egg grows out of something already on the site: the headline, the public source, the live
  clock. None of them would make sense on another person's site.
- None of them changes what a recruiter sees in the first ten seconds. The clock looks the same
  until someone taps it, and the answer is useful to a hiring manager in another time zone.
- The console note is evidence as well as a joke: the commit link shows the page is current,
  maintained work. Engineering managers are the people most likely to open the console.
- The console note hints at the curl card, because nobody would find it otherwise. The hint says
  `https://`, because plain `curl karthik.nz` stops at Vercel's HTTP-to-HTTPS redirect and prints
  only "Redirecting...".
- The clock event shows whether anyone finds the egg. The others can't be measured without
  adding tracking that isn't worth it.
