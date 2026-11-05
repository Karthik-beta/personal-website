# 0027: Leading readers into the case studies

- Status: Accepted (2026-11-05)
- Date: 2026-11-05

## Context

Karthik asked how to keep visitors on the site longer. On a job-hunt site, a short visit that
ends with the resume or an email is a success. The useful goal is one more meaningful step:
from the home page into a case study, through it, and on to the next or to Contact. Google
Analytics (ADR 0015) recorded clicks on the resume and email, but not whether anyone opened a
case study or read one to the end.

## Options

1. **Home Work list.** A screenshot beside every case study; Aria leading with a wide recording
   (chosen); the problem sentence as a hook with no pictures; or reading times only. Karthik
   compared all three on a local production build.
2. **The Aria recording.** Autoplaying and looping, or played by the visitor (chosen). Recorded
   live in real time, or frame by frame under Chromium's virtual time (chosen).
3. **Reading time.** In the header facts list, or in the time margin under the dates (chosen).
4. **End of a case study.** One "Next case study" link (before), or the other three studies with
   their reading times, then the resume and Contact (chosen).
5. **Measuring reads.** GA's built-in 90% scroll event, or an event when the end of the case
   study comes into view (chosen).

## Decision

- **Home Work list:** Aria's row carries the recording between its stack and its links. The
  other rows stay text. Every row with a case study shows "N min read" under its years, and its
  link reads "Read the case study, N min".
- **Aria recording** (`public/work/aria-flow-{light,dark}.{webm,mp4,webp}`): 12 seconds at
  1920×1080 and 60 fps, from Aria's production build with demo data. It goes from the Asset
  Dashboard to the Asset Depreciations and Balances report, whose start date moves to 1 April
  and whose totals recalculate. A light and a dark take follow the site's theme. AV1 WebM first,
  H.264 MP4 as the fallback, a poster frame, and `preload="none"`, so nothing downloads until
  play.
  - It plays only when the visitor presses play (native controls, muted, looping). Design 09
    says nothing moves on its own.
  - It replaces the Asset Dashboard screenshot in the Aria case study, as a `video` figure in
    `src/content/case-studies.ts`, rendered by `src/components/site/clip.tsx`.
  - Kept out of frame: real company names, factory equipment (the asset list and its
    categories), the sign-in toast, scrollbars, and an id-only breadcrumb.
- **Reading time:** `readingMinutes()` in `src/lib/reading-time.ts` counts the summary, every
  paragraph, point and caption, at 230 words a minute plus 12 seconds a figure, rounded up. It
  shows as "N min read" under the dates in the margin, on each "Keep reading" row and in the
  Markdown version.
- **Keep reading:** the end of each case study lists the other three, next first, with their
  summaries and reading times, then "Read the resume" and "Get in touch".
- **GA events:**
  - `case_study_open` on links into a case study, with `placement` (`home_work`,
    `case_study_onward`) and `link_url`.
  - `case_study_read` once per visit when "Keep reading" comes into view, with `case_study` and
    `reading_minutes`. `src/components/site/track-view.tsx` is the only new client code.
  - `video_play` with `video` for any `<video data-track-video>`.
  - Every tracked click now also sends `link_url`, and `placement` when the link has one.
  - In GA (Admin, Custom definitions), Karthik registers `placement`, `case_study`, `video` and
    `link_url` as event-scoped dimensions so reports can split by them.

## Why

- One picture on the list, on the strongest story, draws the eye without turning the list into
  cards. Small screenshots beside every row were too small to read, and the problem sentences
  made long rows longer.
- A recruiter who knows a case study takes 2 minutes is more likely to start it.
- The margin is the site's time column (ADR 0009), so the reading time belongs there.
- "Keep reading" gives every finished reader a next step that isn't the back button, and the
  resume and Contact are the steps that matter most.
- The end-of-page event measures what we care about, finishing a case study, on every page
  length. GA's scroll event fires at 90% of the page, which here includes the footer.
- Recording frame by frame gives an even 60 fps at 2× resolution. Live capture of the same flow
  dropped to 12–15 fps at that size.
