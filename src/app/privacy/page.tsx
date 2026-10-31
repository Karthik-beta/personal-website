import type { Metadata } from "next";
import { MarginGrid } from "@/components/home/margin-grid";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What karthik.nz records about visits, and how to opt out.",
  alternates: { canonical: "/privacy" },
  // Kept out of search results: it's here for visitors who look for it, not as a landing page.
  robots: { index: false, follow: true },
};

export default function Privacy() {
  return (
    <main id="content" className="py-16 lg:py-24">
      <Container>
        <MarginGrid margin="Updated 31 Oct 2026">
          <div className="grid max-w-[65ch] gap-4">
            <h1 className="text-3xl font-semibold stretch-heading">Privacy</h1>
            <p className="text-lg">
              This site uses two analytics tools to see which pages and links are useful. Nothing is
              sold or used for advertising.
            </p>

            <h2 className="mt-6 text-xl font-semibold stretch-heading">Google Analytics</h2>
            <p>
              Google Analytics sets cookies to tell a returning browser from a new one. It records
              the pages you open, the links and buttons you click, how far you scroll, the site that
              sent you, your device and browser, and your approximate location (country and city).
              Google doesn&rsquo;t store IP addresses in Google Analytics, and the data is kept for
              two months.
            </p>
            <p>
              To opt out, block cookies for this site, use a content blocker, or install
              Google&rsquo;s{" "}
              <TextLink href="https://tools.google.com/dlpage/gaoptout">opt-out add-on</TextLink>.
              Google&rsquo;s own use of the data is covered by its{" "}
              <TextLink href="https://policies.google.com/technologies/partner-sites">
                partner-sites policy
              </TextLink>
              .
            </p>

            <h2 className="mt-6 text-xl font-semibold stretch-heading">Cloudflare Web Analytics</h2>
            <p>
              Cloudflare counts visits and measures page speed without cookies and without
              identifying you.
            </p>

            <h2 className="mt-6 text-xl font-semibold stretch-heading">Email</h2>
            <p>
              If you email <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink>, your
              message is used only to reply. Questions about this page can go to the same address.
            </p>
          </div>
        </MarginGrid>
      </Container>
    </main>
  );
}
