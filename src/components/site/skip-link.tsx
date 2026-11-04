import { buttonClasses } from "@/components/ui/button";

export function SkipLink() {
  return (
    <a
      href="#content"
      className={buttonClasses(
        "primary",
        "sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50",
      )}
    >
      Skip to content
    </a>
  );
}
