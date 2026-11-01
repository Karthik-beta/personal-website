import { cacheLife } from "next/cache";
import snapshot from "@/content/open-source.snapshot.json";
import { addDays, fetchOpenSource, type OpenSourceData } from "./fetch";

export type { OpenSourceData } from "./fetch";

/**
 * The open-source page's data, fetched on the server and cached for an hour (ADR 0017). The
 * page is prerendered with it and refreshed in the background, so visitors never wait for
 * GitHub. Without GITHUB_TOKEN (local dev, previews) the GitHub part comes from the snapshot.
 */
export async function getOpenSource(): Promise<OpenSourceData> {
  "use cache";
  cacheLife("hours");
  return fetchOpenSource({
    token: process.env.GITHUB_TOKEN,
    fallback: snapshot as OpenSourceData,
  });
}

export type Cell = { date: string; kind: "active" | "missed" | "today" | "none" };
export type Week = { start: string; cells: Cell[] };

const mondayOf = (date: string) => {
  const weekday = (new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7; // Monday = 0
  return addDays(date, -weekday);
};

/** The timesheet: Monday-to-Sunday rows ending with this week, at most `limit` of them. */
export function timesheetWeeks(data: OpenSourceData, limit: number): Week[] {
  const active = new Map(data.days.map((day) => [day.date, day.active]));
  const since = data.days[0]?.date ?? data.today;
  const weeks: Week[] = [];
  for (let start = mondayOf(since); start <= data.today; start = addDays(start, 7)) {
    const cells = Array.from({ length: 7 }, (_, i): Cell => {
      const date = addDays(start, i);
      if (date < since || date > data.today) return { date, kind: "none" };
      if (active.get(date)) return { date, kind: "active" };
      // Today isn't over, so no activity yet isn't a missed day.
      return { date, kind: date === data.today ? "today" : "missed" };
    });
    weeks.push({ start, cells });
  }
  return weeks.slice(-limit);
}

/** The sentence under the timesheet: honest whether or not a day was missed. */
export function activitySummary(data: OpenSourceData) {
  const since = formatDay(data.days[0]?.date ?? data.today, data.today, "long");
  const counted = data.days.filter((day) => day.date < data.today || day.active);
  const active = counted.filter((day) => day.active).length;
  if (counted.length > 0 && active === counted.length) {
    return `Shipped something every day since ${since}.`;
  }
  return `Active on ${active} of ${counted.length} days since ${since}.`;
}

/** "10 October" or "10 Oct", with the year only when it isn't the current one. */
export function formatDay(date: string, today: string, month: "long" | "short" = "short") {
  const sameYear = date.slice(0, 4) === today.slice(0, 4);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month,
    year: sameYear ? undefined : "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

/** The latest date anything on the page changed: for the sitemap and structured data. */
export function lastActivity(data: OpenSourceData) {
  const dates = [
    ...data.days.filter((day) => day.active).map((day) => day.date),
    ...data.contributions.flatMap((repo) => repo.pullRequests.map((pr) => pr.date)),
    ...data.releases.map((release) => release.released),
  ];
  return dates.sort().at(-1) ?? data.today;
}
