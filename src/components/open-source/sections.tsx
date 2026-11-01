import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { MarginGrid } from "@/components/home/margin-grid";
import { MetaList } from "@/components/site/meta-list";
import { TextLink } from "@/components/ui/text-link";
import type { Library } from "@/content/open-source";
import { cn } from "@/lib/cn";
import { formatDay, type OpenSourceData } from "@/lib/open-source";
import type { PullRequest, RepoContributions } from "@/lib/open-source/fetch";

const registries = [
  { key: "npm", label: "npm", href: (name: string) => `https://www.npmjs.com/package/${name}` },
  { key: "pypi", label: "PyPI", href: (name: string) => `https://pypi.org/project/${name}/` },
  { key: "crates", label: "crates.io", href: (name: string) => `https://crates.io/crates/${name}` },
] as const;

function LinkList({ links }: { links: { href: string; label: string; track: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1">
      {links.map((link) => (
        <li key={link.href}>
          <TextLink href={link.href} data-track={link.track}>
            {link.label}
          </TextLink>
        </li>
      ))}
    </ul>
  );
}

/** One library: latest release date in the margin, its facts as label/value rows. */
export function LibraryEntry({ library, data }: { library: Library; data: OpenSourceData }) {
  const release = data.releases.find((item) => item.name === library.name);
  return (
    <MarginGrid
      className="border-t border-rule pt-6"
      margin={
        release && (
          <>
            Released{" "}
            <time dateTime={release.released}>{formatDay(release.released, data.today)}</time>
          </>
        )
      }
    >
      <article className="grid max-w-[65ch] gap-4">
        <div className="grid gap-2">
          <div className="flex items-center gap-3">
            {release?.icon && (
              // The library website's own icon; decorative, since the name sits beside it.
              <Image
                src={release.icon}
                alt=""
                width={32}
                height={32}
                unoptimized
                className="size-8 rounded-band border border-rule"
              />
            )}
            <h3 className="text-xl font-semibold stretch-title">{library.name}</h3>
          </div>
          <p>{library.summary}</p>
        </div>
        <MetaList
          items={[
            {
              label: "Version",
              value: release ? `${release.version}, ${library.status}` : library.status,
            },
            {
              label: "Install from",
              value: (
                <LinkList
                  links={registries.map((registry) => ({
                    href: registry.href(library.packages[registry.key]),
                    label: registry.label,
                    track: "package_link",
                  }))}
                />
              ),
            },
            {
              label: "Links",
              value: (
                <LinkList
                  links={[
                    { href: library.docs, label: "Docs", track: "package_docs" },
                    { href: library.repo, label: "Source", track: "package_source" },
                  ]}
                />
              ),
            },
          ]}
        />
      </article>
    </MarginGrid>
  );
}

/** Days between two YYYY-MM-DD dates. */
const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
const days = (n: number) => `${n} ${n === 1 ? "day" : "days"}`;

/** Status and review time in words: "Merged in 2 days", "In review for 3 days". */
function reviewTime(pr: PullRequest, today: string) {
  if (pr.state === "merged") {
    const n = daysBetween(pr.opened, pr.date);
    return n === 0 ? "Merged the same day" : `Merged in ${days(n)}`;
  }
  const label = pr.state === "draft" ? "Draft" : "In review";
  const n = daysBetween(pr.opened, today);
  return n === 0 ? `${label} since today` : `${label} for ${days(n)}`;
}

/** "1 merged, 3 in review". */
function counts(pullRequests: PullRequest[]) {
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

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** The whole ledger in one line: "6 pull requests to 3 projects: 1 merged, 5 in review." */
export function contributionTotals(data: OpenSourceData) {
  const pullRequests = data.contributions.flatMap((repo) => repo.pullRequests);
  return (
    `${plural(pullRequests.length, "pull request")} to ` +
    `${plural(data.contributions.length, "project")}: ${counts(pullRequests)}.`
  );
}

/** "32k stars", "1.9k stars", "12 stars"; nothing for a repository with none. */
function stars(count: number) {
  if (count === 0) return null;
  const short =
    count < 1000
      ? String(count)
      : `${count < 10_000 ? (count / 1000).toFixed(1) : Math.round(count / 1000)}k`;
  return `${short.replace(".0k", "k")} ${count === 1 ? "star" : "stars"}`;
}

/** The status square: filled = merged, ultramarine outline = in review, dashed = draft. */
function StatusMark({ state }: { state: PullRequest["state"] }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-3 shrink-0 rounded-mark",
        state === "merged" && "bg-accent",
        state === "open" && "border border-accent",
        state === "draft" && "border border-dashed border-rule-strong",
      )}
    />
  );
}

// Past these, the rest wait behind a "Show" toggle so the page doesn't grow with every pull
// request and project (ADR 0020). Newest first, so what's hidden is always the oldest.
const shownPullRequests = 5;
const shownProjects = 6;

/**
 * A native disclosure, so the page still needs no JavaScript; its rows stay in the HTML for
 * search and find-in-page.
 */
function More({
  show,
  hide,
  className,
  children,
}: {
  show: string;
  hide: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group/more">
      {/* The summary must be the details' own child, so it carries the margin grid itself. Only
          its words take clicks, not the empty margin beside them. */}
      <summary
        className={cn(
          "pointer-events-none grid list-none gap-x-8 md:grid-cols-[10rem_minmax(0,1fr)] [&::-webkit-details-marker]:hidden",
          className,
        )}
      >
        <span aria-hidden className="hidden md:block" />
        <span className="pointer-events-auto inline-flex w-fit cursor-pointer items-center gap-0.5 text-sm font-semibold text-accent transition-colors duration-120 ease-out hover:text-accent-hover">
          <ChevronRight
            aria-hidden
            size={16}
            strokeWidth={2}
            className="transition-transform duration-120 ease-out group-open/more:rotate-90"
          />
          <span className="group-open/more:hidden">{show}</span>
          <span className="hidden group-open/more:inline">{hide}</span>
        </span>
      </summary>
      {children}
    </details>
  );
}

function PullRequestRow({ pr, today }: { pr: PullRequest; today: string }) {
  return (
    <li>
      <MarginGrid
        className="border-t border-rule py-3"
        margin={<time dateTime={pr.date}>{formatDay(pr.date, today)}</time>}
      >
        <div className="grid max-w-[65ch] grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 gap-y-0.5">
          <StatusMark state={pr.state} />
          <TextLink href={pr.url} data-track="pr_link">
            {pr.title}
          </TextLink>
          <p className="col-start-2 text-sm text-muted">{reviewTime(pr, today)}</p>
        </div>
      </MarginGrid>
    </li>
  );
}

/**
 * One repository: a tally of squares and a count, then one row per pull request with its date
 * in the margin, its status square, and its review time in words. Older rows wait behind a
 * toggle.
 */
function Project({ repo, today }: { repo: RepoContributions; today: string }) {
  const shown = repo.pullRequests.slice(0, shownPullRequests);
  const older = repo.pullRequests.slice(shownPullRequests);
  return (
    <section aria-label={repo.repo} className="grid">
      <MarginGrid className="pb-3">
        <div className="flex max-w-[65ch] flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div className="grid gap-0.5">
            <div className="flex flex-wrap items-center gap-x-3">
              {repo.avatar && (
                // The repository owner's logo; decorative, since the name sits beside it.
                <Image
                  src={repo.avatar}
                  alt=""
                  width={24}
                  height={24}
                  unoptimized
                  className="size-6 rounded-band border border-rule"
                />
              )}
              <h3 className="text-lg font-semibold">
                <TextLink href={repo.url} data-track="repo_link">
                  {repo.repo}
                </TextLink>
              </h3>
              {stars(repo.stars) && (
                <span className="text-xs text-muted tabular-nums">{stars(repo.stars)}</span>
              )}
            </div>
            <p className="text-sm text-muted">{counts(repo.pullRequests)}</p>
          </div>
          {/* Wraps onto more lines as the pull requests add up. */}
          <p aria-hidden className="flex flex-wrap gap-1 pt-2">
            {repo.pullRequests.map((pr) => (
              <StatusMark key={pr.url} state={pr.state} />
            ))}
          </p>
        </div>
      </MarginGrid>
      <ul className="grid">
        {shown.map((pr) => (
          <PullRequestRow key={pr.url} pr={pr} today={today} />
        ))}
      </ul>
      {older.length > 0 && (
        <More
          show={`Show ${plural(older.length, "older pull request")}`}
          hide={`Hide ${plural(older.length, "older pull request")}`}
          className="border-t border-rule py-3"
        >
          <ul className="grid">
            {older.map((pr) => (
              <PullRequestRow key={pr.url} pr={pr} today={today} />
            ))}
          </ul>
        </More>
      )}
    </section>
  );
}

/**
 * Pull requests to other projects as a status ledger, grouped by repository, the repository
 * with the newest pull request first. Projects past the first few wait behind a toggle.
 */
export function Contributions({ data }: { data: OpenSourceData }) {
  const shown = data.contributions.slice(0, shownProjects);
  const more = data.contributions.slice(shownProjects);
  return (
    <div className="grid gap-10">
      {shown.map((repo) => (
        <Project key={repo.repo} repo={repo} today={data.today} />
      ))}
      {more.length > 0 && (
        <More
          show={`Show ${plural(more.length, "more project")}`}
          hide={`Hide ${plural(more.length, "project")}`}
        >
          <div className="grid gap-10 pt-10">
            {more.map((repo) => (
              <Project key={repo.repo} repo={repo} today={data.today} />
            ))}
          </div>
        </More>
      )}
    </div>
  );
}
