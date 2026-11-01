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
  docs: string;
  repo: string;
};

export const openSource = {
  github: "Karthik-beta",
  /** First day of the unbroken run of daily activity (confirmed by Karthik, 2026-11-01). */
  since: "2026-10-10",
  /** Pull requests to these owners aren't contributions to other projects. */
  hiddenOwners: ["Karthik-beta", "Pivotr"],
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
      docs: "https://github.com/Karthik-beta/fiscalclock/wiki",
      repo: "https://github.com/Karthik-beta/fiscalclock",
    },
  ] satisfies Library[],
};
