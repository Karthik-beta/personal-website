import { FileText } from "lucide-react";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons/brand";
import { AskAi, McpConnect } from "@/components/site/ask-ai";
import { CopyEmail } from "@/components/site/copy-email";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { askAi } from "@/content/ask-ai";
import { home } from "@/content/home";
import { site } from "@/lib/site";
import { MarginGrid } from "./margin-grid";

export function Contact() {
  const { contact } = home;
  return (
    <section id="contact" aria-labelledby="contact-title" className="pb-8">
      <Container>
        <MarginGrid className="border-t border-rule pt-10">
          <div className="grid max-w-[60ch] gap-6">
            <div className="grid gap-2">
              <h2 id="contact-title" className="text-2xl font-semibold stretch-heading">
                {contact.title}
              </h2>
              <p className="text-lg">{contact.lead}</p>
            </div>
            <CopyEmail email={site.email} />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <ButtonLink href={site.resume}>
                <FileText aria-hidden size={18} strokeWidth={1.75} />
                {contact.actions.resume}
              </ButtonLink>
              <TextLink href={site.links.linkedin} kind="action" icon={<LinkedInIcon />}>
                {contact.actions.linkedin}
              </TextLink>
              <TextLink href={site.links.github} kind="action" icon={<GitHubIcon />}>
                {contact.actions.github}
              </TextLink>
              <TextLink href={site.links.x} kind="action" icon={<XIcon />}>
                {contact.actions.x}
              </TextLink>
            </div>
            <div className="grid gap-3">
              <AskAi copy={askAi.home} />
              <McpConnect />
            </div>
          </div>
        </MarginGrid>
      </Container>
    </section>
  );
}
