import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { site } from "@/lib/site";

export function SiteFooter() {
  const links = [
    { href: site.links.github, label: "GitHub" },
    { href: site.links.linkedin, label: "LinkedIn" },
    { href: site.links.x, label: "X" },
    { href: `mailto:${site.email}`, label: "Email" },
    { href: site.repo, label: "Source on GitHub" },
    { href: "/privacy", label: "Privacy" },
  ];

  return (
    <footer className="mt-24 border-t border-rule py-8 text-xs text-muted">
      <Container className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <p>
          © {site.copyrightYear} {site.name}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((link) => (
            <li key={link.label}>
              <TextLink href={link.href} className="inline-flex min-h-6 items-center">
                {link.label}
              </TextLink>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
