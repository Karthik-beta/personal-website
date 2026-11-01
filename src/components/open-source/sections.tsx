import { Check } from "lucide-react";
import { MarginGrid } from "@/components/home/margin-grid";
import { MetaList } from "@/components/site/meta-list";
import { TextLink } from "@/components/ui/text-link";
import type { Library } from "@/content/open-source";
import { formatDay, type OpenSourceData } from "@/lib/open-source";

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
          <h3 className="text-xl font-semibold stretch-title">{library.name}</h3>
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

const status = {
  merged: "Merged",
  open: "In review",
  draft: "Draft",
};

/** Pull requests to other projects, grouped by repository; each row's date sits in the margin. */
export function Contributions({ data }: { data: OpenSourceData }) {
  return (
    <div className="grid gap-8">
      {data.contributions.map((repo) => (
        <section key={repo.repo} aria-label={repo.repo} className="grid">
          <MarginGrid className="pb-3">
            <h3 className="text-lg font-semibold">
              <TextLink href={repo.url} data-track="repo_link">
                {repo.repo}
              </TextLink>
            </h3>
          </MarginGrid>
          <ul className="grid">
            {repo.pullRequests.map((pr) => (
              <li key={pr.url}>
                <MarginGrid
                  className="border-t border-rule py-3"
                  margin={<time dateTime={pr.date}>{formatDay(pr.date, data.today)}</time>}
                >
                  <div className="flex max-w-[65ch] flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <TextLink href={pr.url} data-track="pr_link">
                      {pr.title}
                    </TextLink>
                    <p className="inline-flex items-center gap-1 text-sm font-medium whitespace-nowrap">
                      {pr.state === "merged" && <Check aria-hidden size={16} strokeWidth={2} />}
                      {status[pr.state]}
                    </p>
                  </div>
                </MarginGrid>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
