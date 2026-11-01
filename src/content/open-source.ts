// The open-source page's fixed facts (docs/design/13-open-source.md). Versions, release dates,
// pull requests and active days come live from GitHub and the registries (src/lib/open-source).

export type Library = {
  name: string;
  summary: string;
  /** Karthik's words for how ready it is. Change only when Karthik says so. */
  status: string;
  languages: string[];
  /** Package names on each registry. */
  packages: { npm: string; pypi: string; crates: string };
  /** The library's own website; its icon is shown beside the name once the site is live. */
  site: string;
  docs: string;
  repo: string;
};

export const openSource = {
  /** The page's meta description, and its summary in llms.txt. */
  description:
    "Libraries Karthik Parameshwara maintains, pull requests to other projects, and daily activity, live from GitHub and the package registries.",
  github: "Karthik-beta",
  /** Where the activity timesheet starts; it grows from here, week by week (Karthik, 2026-11-01). */
  since: "2026-10-01",
  /** Pull requests to these owners aren't contributions to other projects. */
  hiddenOwners: ["Karthik-beta", "Pivotr"],
  /** Repositories Karthik chose not to list (owner/name). */
  hiddenRepos: ["g8r-b8/frontierLab"],
  /** How a repository is named in running text, where its slug would read oddly. */
  projectNames: { "deepset-ai/haystack": "Haystack", "SigNoz/signoz": "SigNoz" } as Record<
    string,
    string
  >,
  libraries: [
    {
      name: "workclock",
      summary:
        "Business-time arithmetic: working hours, SLAs, shifts, holidays and time zones. A Rust core with Python and JavaScript bindings.",
      status: "not yet stable",
      languages: ["Rust", "Python", "JavaScript"],
      packages: { npm: "workclock", pypi: "workclock", crates: "workclock" },
      site: "https://workclock.karthik.nz",
      docs: "https://workclock.karthik.nz/docs/",
      repo: "https://github.com/Karthik-beta/workclock",
    },
    {
      name: "fiscalclock",
      summary:
        "Fiscal calendars (4-4-5, 52/53-week and fixed-date) computed from one JSON definition. A Rust core with Python and JavaScript bindings.",
      status: "in development",
      languages: ["Rust", "Python", "JavaScript"],
      packages: { npm: "fiscalclock", pypi: "fiscalclock", crates: "fiscalclock" },
      site: "https://fiscalclock.karthik.nz",
      docs: "https://github.com/Karthik-beta/fiscalclock/wiki",
      repo: "https://github.com/Karthik-beta/fiscalclock",
    },
  ] satisfies Library[],
};
