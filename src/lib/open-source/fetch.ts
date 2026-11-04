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
  /** The date it was opened, for its review time. */
  opened: string;
};
export type RepoContributions = {
  repo: string;
  url: string;
  stars: number;
  /** The owner's GitHub avatar as a data: URL, so visitors' browsers never contact GitHub. */
  avatar?: string;
  pullRequests: PullRequest[];
};
export type Release = {
  name: string;
  version: string;
  released: string;
  /** The library website's icon as a data: URL, when the site is up. */
  icon?: string;
};

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

/**
 * A website's icon, read from its own <link> tags. The touch icon comes first: it has its own
 * background, so it reads on both themes. An SVG icon is skipped, because it follows the
 * visitor's system theme rather than this site's toggle and can vanish on a dark page.
 */
async function siteIcon(site: string) {
  const res = await fetch(site, { headers: { "User-Agent": userAgent }, signal: timeout() });
  if (!res.ok) throw new Error(`${site}: HTTP ${res.status}`);
  const links = (await res.text()).match(/<link\b[^>]*>/gi) ?? [];
  const attr = (tag: string, name: string) =>
    tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))?.[1] ?? "";
  const find = (test: (rel: string, type: string) => boolean) =>
    links.find((tag) => test(attr(tag, "rel").toLowerCase(), attr(tag, "type")));
  const tag =
    find((rel) => rel === "apple-touch-icon") ??
    find((rel, type) => rel.split(" ").includes("icon") && type === "image/png") ??
    find((rel, type) => rel.split(" ").includes("icon") && type !== "image/svg+xml");
  return dataUrl(new URL(tag ? attr(tag, "href") : "/favicon.ico", site).href);
}

async function dataUrl(url: string) {
  const res = await fetch(url, { headers: { "User-Agent": userAgent }, signal: timeout() });
  const type = res.headers.get("content-type") ?? "";
  if (!res.ok || !type.startsWith("image/")) throw new Error(`${url}: HTTP ${res.status} ${type}`);
  return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
}

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

type Calendar = {
  /** One contributions collection per year, aliased y0, y1, … (see `calendarQuery`). */
  user: Record<
    string,
    {
      contributionCalendar: {
        weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
      };
    }
  >;
};

type SearchPage = {
  search: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: ({
      title: string;
      url: string;
      state: "OPEN" | "CLOSED" | "MERGED";
      isDraft: boolean;
      createdAt: string;
      mergedAt: string | null;
      repository: {
        nameWithOwner: string;
        url: string;
        stargazerCount: number;
        owner: { login: string; avatarUrl: string };
      };
    } | null)[];
  };
};

// GitHub returns at most a year of contributions per collection, so the record since
// `openSource.since` is asked for one year at a time, as aliased collections in one request.
const calendarQuery = (years: { from: string; to: string }[]) => `query ($login: String!) {
  user(login: $login) {
    ${years
      .map(
        (year, i) => `y${i}: contributionsCollection(from: "${year.from}", to: "${year.to}") {
      contributionCalendar { weeks { contributionDays { date contributionCount } } }
    }`,
      )
      .join("\n    ")}
  }
}`;

const searchQuery = `query ($search: String!, $after: String) {
  search(query: $search, type: ISSUE, first: 100, after: $after) {
    pageInfo { hasNextPage endCursor }
    nodes {
      ... on PullRequest {
        title url state isDraft createdAt mergedAt
        repository { nameWithOwner url stargazerCount owner { login avatarUrl(size: 64) } }
      }
    }
  }
}`;

async function graphql<T>(token: string, query: string, variables: Record<string, unknown>) {
  const result = await getJson("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (result.errors?.length) throw new Error(`GitHub: ${result.errors[0].message}`);
  return result.data as T;
}

/** Every result of a search, 100 at a time (GitHub stops a search at 1,000). */
async function searchAll(token: string, search: string) {
  const nodes: SearchPage["search"]["nodes"] = [];
  let after: string | null = null;
  do {
    const page: SearchPage = await graphql<SearchPage>(token, searchQuery, { search, after });
    nodes.push(...page.search.nodes);
    after = page.search.pageInfo.hasNextPage ? page.search.pageInfo.endCursor : null;
  } while (after);
  return nodes;
}

async function fetchGitHub(token: string, now: Date, today: string) {
  const years: { from: string; to: string }[] = [];
  for (let from = openSource.since; from <= today; from = addDays(from, 365)) {
    const end = addDays(from, 364);
    years.push({
      from: `${from}T00:00:00Z`,
      to: end < today ? `${end}T23:59:59Z` : now.toISOString(),
    });
  }
  const hidden = openSource.hiddenOwners.map((owner) => `-user:${owner}`).join(" ");
  const prs = `is:pr is:public author:${openSource.github} ${hidden}`;
  // Merged and open (drafts included) as two searches, so pull requests closed without merging
  // are never fetched; search can't ask for "merged or open" in one go.
  const [calendar, merged, open] = await Promise.all([
    graphql<Calendar>(token, calendarQuery(years), { login: openSource.github }),
    searchAll(token, `${prs} is:merged`),
    searchAll(token, `${prs} is:open`),
  ]);

  const active = new Set(
    Object.values(calendar.user)
      .flatMap((year) => year.contributionCalendar.weeks)
      .flatMap((week) => week.contributionDays)
      .filter((day) => day.contributionCount > 0)
      .map((day) => day.date),
  );
  const days: Day[] = [];
  for (let date = openSource.since; date <= today; date = addDays(date, 1)) {
    days.push({ date, active: active.has(date) });
  }

  // Newest first by the full time, so the projects (in the order their first pull request is
  // seen) and the pull requests within each come out newest first, even on the same day.
  const when = (pr: NonNullable<SearchPage["search"]["nodes"][number]>) =>
    pr.mergedAt ?? pr.createdAt;
  const byRepo = new Map<string, RepoContributions>();
  const all = [...merged, ...open].filter((pr) => pr !== null);
  for (const pr of all.toSorted((a, b) => when(b).localeCompare(when(a)))) {
    if (pr.state === "CLOSED") continue;
    if (openSource.hiddenOwners.includes(pr.repository.owner.login)) continue;
    if (openSource.hiddenRepos.includes(pr.repository.nameWithOwner)) continue;
    const repo = pr.repository.nameWithOwner;
    const entry = byRepo.get(repo) ?? {
      repo,
      url: pr.repository.url,
      stars: pr.repository.stargazerCount,
      avatar: pr.repository.owner.avatarUrl,
      pullRequests: [],
    };
    entry.pullRequests.push({
      title: plainTitle(pr.title),
      url: pr.url,
      state: pr.state === "MERGED" ? "merged" : pr.isDraft ? "draft" : "open",
      date: bengaluruDate(new Date(pr.mergedAt ?? pr.createdAt)),
      opened: bengaluruDate(new Date(pr.createdAt)),
    });
    byRepo.set(repo, entry);
  }
  const contributions = [...byRepo.values()];

  // Swap each avatar URL for the image itself; a repository whose image fails just has none.
  await Promise.all(
    contributions.map(async (entry) => {
      entry.avatar = entry.avatar ? await dataUrl(entry.avatar).catch(() => undefined) : undefined;
    }),
  );

  return { days, contributions };
}

const release = /^\d+\.\d+\.\d+$/;
const compareVersions = (a: string, b: string) => {
  const [x, y] = [a, b].map((v) => v.split(".").map(Number));
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};

/** The newest version published on all three registries, and the day it reached the last one. */
async function fetchRelease({ name, packages, site }: (typeof openSource.libraries)[number]) {
  // A site that isn't live yet just has no icon.
  const icon = siteIcon(site).catch(() => undefined);
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
  return { name, version, released: bengaluruDate(new Date(last)), icon: await icon };
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
  const registries = Promise.all(openSource.libraries.map((library) => fetchRelease(library))).then(
    (releases) => ({ releases, at: stamp }),
  );

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
    // An icon that failed this time keeps the snapshot's copy.
    releases: regPart.releases.map((release) => ({
      ...release,
      icon: release.icon ?? fallback?.releases.find((item) => item.name === release.name)?.icon,
    })),
  };
}
