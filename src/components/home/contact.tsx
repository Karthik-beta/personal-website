import { Download } from "lucide-react";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons/brand";
import { CopyEmail } from "@/components/site/copy-email";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { site } from "@/lib/site";
import { MarginGrid } from "./margin-grid";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="pb-8">
      <Container>
        <MarginGrid className="border-t border-rule pt-10">
          <div className="grid max-w-[60ch] gap-6">
            <div className="grid gap-2">
              <h2 id="contact-title" className="text-2xl font-semibold stretch-heading">
                Contact
              </h2>
              <p className="text-lg">
                I&rsquo;m available now. The fastest way to reach me is email.
              </p>
            </div>
            <CopyEmail email={site.email} />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href={site.resume} className={buttonClasses("primary")}>
                <Download aria-hidden size={18} strokeWidth={1.75} />
                Download resume
                <span className="sr-only"> (PDF)</span>
              </a>
              <TextLink href={site.links.linkedin} kind="action" icon={<LinkedInIcon />}>
                LinkedIn
              </TextLink>
              <TextLink href={site.links.github} kind="action" icon={<GitHubIcon />}>
                GitHub
              </TextLink>
              <TextLink href={site.links.x} kind="action" icon={<XIcon />}>
                X
              </TextLink>
            </div>
          </div>
        </MarginGrid>
      </Container>
    </section>
  );
}
