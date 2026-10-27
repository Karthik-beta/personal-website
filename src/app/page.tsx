import { Chapters } from "@/components/home/chapters";
import { Hero } from "@/components/home/hero";
import { Work } from "@/components/home/work";

// Sections are added one at a time in Phase 5, each reviewed before the next.
export default function Home() {
  return (
    <main id="content">
      <Hero />
      <Chapters />
      <Work />
    </main>
  );
}
