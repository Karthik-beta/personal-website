import { MarginGrid } from "@/components/home/margin-grid";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";

export default function NotFound() {
  return (
    <main id="content" className="py-16 lg:py-24">
      <Container>
        <MarginGrid margin="404">
          <div className="grid max-w-[65ch] gap-4">
            <h1 className="text-3xl font-semibold stretch-heading">
              This page doesn&rsquo;t exist
            </h1>
            <p className="text-lg">The link may be old, or the address mistyped.</p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <TextLink href="/" kind="action">
                Go to the home page
              </TextLink>
              <TextLink href="/#work" kind="action">
                See my work
              </TextLink>
            </div>
          </div>
        </MarginGrid>
      </Container>
    </main>
  );
}
