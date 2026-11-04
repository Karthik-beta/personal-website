import { home } from "@/content/home";
import { openSource } from "@/content/open-source";
import type { OpenSourceData } from "./index";
import type { PullRequest } from "./fetch";

// The open-source data in words, shared by the pages and their Markdown versions.

export const registries = [
  { key: "npm", label: "npm", href: (name: string) => `https://www.npmjs.com/package/${name}` },
  { key: "pypi", label: "PyPI", href: (name: string) => `https://pypi.org/project/${name}/` },
  { key: "crates", label: "crates.io", href: (name: string) => `https://crates.io/crates/${name}` },
] as const;

const list = (items: string[]) =>
  new Intl.ListFormat("en-GB", { style: "long", type: "conjunction" }).format(items);

/** The home page's sentence: the libraries, and the first few projects sent fixes. */
export function homeTeaser(data: OpenSourceData) {
  const libraries = list(openSource.libraries.map((library) => library.name));
  const projects = data.contributions
    .slice(0, 3)
    .map((repo) => openSource.projectNames[repo.repo] ?? repo.repo.split("/")[1]);
  return home.openSource.sentence(libraries, projects.length > 0 ? list(projects) : null);
}

/** Days between two YYYY-MM-DD dates. */
const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
const days = (n: number) => `${n} ${n === 1 ? "day" : "days"}`;

/** Status and review time in words: "Merged in 2 days", "In review for 3 days". */
export function reviewTime(pr: PullRequest, today: string) {
  if (pr.state === "merged") {
    const n = daysBetween(pr.opened, pr.date);
    return n === 0 ? "Merged the same day" : `Merged in ${days(n)}`;
  }
  const label = pr.state === "draft" ? "Draft" : "In review";
  const n = daysBetween(pr.opened, today);
  return n === 0 ? `${label} since today` : `${label} for ${days(n)}`;
}

/** "1 merged, 3 in review". */
export function counts(pullRequests: PullRequest[]) {
  const n = (state: PullRequest["state"]) => pullRequests.filter((pr) => pr.state === state).length;
  return [
    [n("merged"), "merged"],
    [n("open"), "in review"],
    [n("draft"), n("draft") === 1 ? "draft" : "drafts"],
  ]
    .filter(([count]) => count)
    .map(([count, word]) => `${count} ${word}`)
    .join(", ");
}

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** The whole ledger in one line: "6 pull requests to 3 projects: 1 merged, 5 in review." */
export function contributionTotals(data: OpenSourceData) {
  const pullRequests = data.contributions.flatMap((repo) => repo.pullRequests);
  return (
    `${plural(pullRequests.length, "pull request")} to ` +
    `${plural(data.contributions.length, "project")}: ${counts(pullRequests)}.`
  );
}

/** "32k stars", "1.9k stars", "12 stars"; nothing for a repository with none. */
export function stars(count: number) {
  if (count === 0) return null;
  const short =
    count < 1000
      ? String(count)
      : `${count < 10_000 ? (count / 1000).toFixed(1) : Math.round(count / 1000)}k`;
  return `${short.replace(".0k", "k")} ${count === 1 ? "star" : "stars"}`;
}

/** When the data was fetched, in Bengaluru: { hour, minute, day, month }. */
export const fetchedAt = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  })
    .formatToParts(new Date(iso))
    .reduce<Record<string, string>>((parts, part) => ({ ...parts, [part.type]: part.value }), {});
