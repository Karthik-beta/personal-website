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
              I use two simple analytics tools to learn which pages and projects people find useful,
              so I can keep improving the site. I never sell this data or use it for ads.
            </p>

            <h2 className="mt-6 text-xl font-semibold stretch-heading">Google Analytics</h2>
            <p>
              Google Analytics uses a small cookie to count returning visits. It shows me things
              like which pages get read, which links get clicked and roughly where visitors are
              (country or city). It doesn&rsquo;t tell me who you are. Google doesn&rsquo;t keep IP
              addresses, and the data is deleted after two months.
            </p>
            <p>
              If you&rsquo;d rather not be counted, a content blocker or Google&rsquo;s{" "}
              <TextLink href="https://tools.google.com/dlpage/gaoptout">opt-out add-on</TextLink>{" "}
              turns it off. Google explains how it handles this data in its{" "}
              <TextLink href="https://policies.google.com/technologies/partner-sites">
                partner-sites policy
              </TextLink>
              .
            </p>

            <h2 className="mt-6 text-xl font-semibold stretch-heading">Cloudflare Web Analytics</h2>
            <p>Cloudflare only counts visits and checks how fast pages load. It uses no cookies.</p>

            <h2 className="mt-6 text-xl font-semibold stretch-heading">Email</h2>
            <p>
              If you email me at <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink>,
              I&rsquo;ll only use your message to reply. Any questions about this page are welcome
              there too.
            </p>
          </div>
        </MarginGrid>
      </Container>
    </main>
  );
}
