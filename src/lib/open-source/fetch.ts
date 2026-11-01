import { openSource } from "@/content/open-source";

// Fetches the open-source page's live data (docs/design/13-open-source.md). Plain fetches with no
// Next.js APIs, so `bun run oss:snapshot` can run it outside Next.js too.

export type Day = { date: string; active: boolean };
export type PullRequest = {
  title: string;
  url: string;
  state: "merged" | "open" | "draft";
  /** Merged date for merged pull requests, otherwise the date it was opened. */
  date: string;
};
export type RepoContributions = { repo: string; url: string; pullRequests: PullRequest[] };
export type Release = { name: string; version: string; released: string };

export type OpenSourceData = {
  /** When the oldest part of this data was fetched (ISO date-time). */
  fetchedAt: string;
  /** Today's date in Bengaluru when the data was fetched. */
  today: string;
  /** Every day from `openSource.since` to `today`. */
  days: Day[];
  contributions: RepoContributions[];
  releases: Release[];
};

const userAgent = "karthik.nz (https://karthik.nz)";
const timeout = () => AbortSignal.timeout(10_000);

/** YYYY-MM-DD in Bengaluru. */
export const bengaluruDate = (at: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(at);

export const addDays = (date: string, days: number) => {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

async function getJson(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: { "User-Agent": userAgent, Accept: "application/json", ...init?.headers },
    signal: timeout(),
  });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}

// Titles read as plain sentences: no commit-type prefix ("fix(charts): use…" → "Use…"), and no
// trailing issue number ("Fix crop (#179)"), which the link already carries.
const commitType =
  /^(feat|fix|docs|chore|refactor|perf|test|build|ci|style|revert)(\([^)]*\))?!?:\s*/i;
const plainTitle = (title: string) => {
  const plain = title.replace(commitType, "").replace(/\s*\(#\d+\)$/, "");
  return plain.charAt(0).toUpperCase() + plain.slice(1);
};

type GitHubResult = {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
      };
    };
  };
  search: {
    nodes: ({
      title: string;
      url: string;
      state: "OPEN" | "CLOSED" | "MERGED";
      isDraft: boolean;
      createdAt: string;
      mergedAt: string | null;
      repository: { nameWithOwner: string; url: string; owner: { login: string } };
    } | null)[];
  };
};

const query = `query ($login: String!, $from: DateTime!, $to: DateTime!, $search: String!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar { weeks { contributionDays { date contributionCount } } }
    }
  }
  search(query: $search, type: ISSUE, first: 100) {
    nodes {
      ... on PullRequest {
        title url state isDraft createdAt mergedAt
        repository { nameWithOwner url owner { login } }
      }
    }
  }
}`;

async function fetchGitHub(token: string, now: Date, today: string) {
  // GitHub allows at most a year per request; the page never shows more than 13 weeks of it.
  const from = [openSource.since, addDays(today, -364)].sort().at(-1)!;
  const hidden = openSource.hiddenOwners.map((owner) => `-user:${owner}`).join(" ");
  const body = JSON.stringify({
    query,
    variables: {
      login: openSource.github,
      from: `${from}T00:00:00Z`,
      to: now.toISOString(),
      search: `is:pr is:public author:${openSource.github} ${hidden}`,
    },
  });
  const result = await getJson("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body,
  });
  if (result.errors?.length) throw new Error(`GitHub: ${result.errors[0].message}`);
  const data = result.data as GitHubResult;

  const active = new Set(
    data.user.contributionsCollection.contributionCalendar.weeks
      .flatMap((week) => week.contributionDays)
      .filter((day) => day.contributionCount > 0)
      .map((day) => day.date),
  );
  const days: Day[] = [];
  for (let date = openSource.since; date <= today; date = addDays(date, 1)) {
    days.push({ date, active: active.has(date) });
  }

  const byRepo = new Map<string, RepoContributions>();
  for (const pr of data.search.nodes) {
    if (!pr || pr.state === "CLOSED") continue;
    if (openSource.hiddenOwners.includes(pr.repository.owner.login)) continue;
    const repo = pr.repository.nameWithOwner;
    const entry = byRepo.get(repo) ?? { repo, url: pr.repository.url, pullRequests: [] };
    entry.pullRequests.push({
      title: plainTitle(pr.title),
      url: pr.url,
      state: pr.state === "MERGED" ? "merged" : pr.isDraft ? "draft" : "open",
      date: bengaluruDate(new Date(pr.mergedAt ?? pr.createdAt)),
    });
    byRepo.set(repo, entry);
  }
  const latest = (entry: RepoContributions) => entry.pullRequests[0].date;
  const contributions = [...byRepo.values()]
    .map((entry) => ({
      ...entry,
      pullRequests: entry.pullRequests.toSorted((a, b) => b.date.localeCompare(a.date)),
    }))
    .toSorted((a, b) => latest(b).localeCompare(latest(a)));

  return { days, contributions };
}

const release = /^\d+\.\d+\.\d+$/;
const compareVersions = (a: string, b: string) => {
  const [x, y] = [a, b].map((v) => v.split(".").map(Number));
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};

/** The newest version published on all three registries, and the day it reached the last one. */
async function fetchRelease(name: string, packages: { npm: string; pypi: string; crates: string }) {
  const [npm, pypi, crates] = await Promise.all([
    getJson(`https://registry.npmjs.org/${packages.npm}`),
    getJson(`https://pypi.org/pypi/${packages.pypi}/json`),
    getJson(`https://crates.io/api/v1/crates/${packages.crates}`),
  ]);
  const published: Map<string, string>[] = [
    new Map(
      Object.keys(npm.versions ?? {}).map((v) => [v, npm.time[v] as string] as [string, string]),
    ),
    new Map(
      Object.entries(pypi.releases as Record<string, { upload_time_iso_8601: string }[]>)
        .filter(([, files]) => files.length > 0)
        .map(([v, files]) => [v, files[0].upload_time_iso_8601]),
    ),
    new Map(
      (crates.versions as { num: string; created_at: string; yanked: boolean }[])
        .filter((v) => !v.yanked)
        .map((v) => [v.num, v.created_at]),
    ),
  ];
  const everywhere = [...published[0].keys()]
    .filter((v) => release.test(v) && published.every((registry) => registry.has(v)))
    .toSorted(compareVersions);
  const version = everywhere.at(-1);
  if (!version) throw new Error(`${name}: no version is on all three registries`);
  const last = published
    .map((registry) => registry.get(version)!)
    .sort()
    .at(-1)!;
  return { name, version, released: bengaluruDate(new Date(last)) };
}

/**
 * Fetches everything the page shows. Each source falls back to `fallback` (the committed
 * snapshot) on its own, so one failing API never empties the page. Without a fallback, errors
 * are thrown (the snapshot script wants to know).
 */
export async function fetchOpenSource({
  token,
  fallback,
}: {
  token?: string;
  fallback?: OpenSourceData;
}): Promise<OpenSourceData> {
  const now = new Date();
  const today = bengaluruDate(now);
  const stamp = now.toISOString();

  const github = token
    ? fetchGitHub(token, now, today).then((part) => ({ ...part, at: stamp }))
    : Promise.reject(new Error("GITHUB_TOKEN is not set"));
  const registries = Promise.all(
    openSource.libraries.map((library) => fetchRelease(library.name, library.packages)),
  ).then((releases) => ({ releases, at: stamp }));

  const [gh, reg] = await Promise.allSettled([github, registries]);
  const pick = <T>(result: PromiseSettledResult<T>, fromSnapshot: (s: OpenSourceData) => T) => {
    if (result.status === "fulfilled") return result.value;
    if (!fallback) throw result.reason;
    console.warn(`open-source: using the snapshot (${String(result.reason)})`);
    return fromSnapshot(fallback);
  };
  const ghPart = pick(gh, (s) => ({
    days: s.days,
    contributions: s.contributions,
    at: s.fetchedAt,
  }));
  const regPart = pick(reg, (s) => ({ releases: s.releases, at: s.fetchedAt }));

  return {
    fetchedAt: [ghPart.at, regPart.at].sort()[0],
    // The snapshot's days end on the day it was taken, so its `today` goes with them.
    today: gh.status === "fulfilled" ? today : (fallback?.today ?? today),
    days: ghPart.days,
    contributions: ghPart.contributions,
    releases: regPart.releases,
  };
}
