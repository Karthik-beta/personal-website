"use client";

import { Download } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { sections, site } from "@/lib/site";
import { MobileMenu } from "./mobile-menu";
import { Monogram } from "./monogram";
import { ThemeToggle } from "./theme-toggle";

/** Slim nav: hides while scrolling down, returns on scroll up, always shown at the top or with focus inside. */
export function SiteHeader() {
  const ref = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    function update() {
      frame = 0;
      const y = window.scrollY;
      const focusInside = ref.current?.contains(document.activeElement) ?? false;
      setScrolled(y > 8);
      if (y < 64 || focusInside) setHidden(false);
      else if (y > lastY + 4) setHidden(true);
      else if (y < lastY - 4) setHidden(false);
      lastY = y;
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      ref={ref}
      onFocus={() => setHidden(false)}
      className={cn(
        "sticky top-0 z-40 border-b bg-paper transition-[translate,border-color] duration-200 ease-enter",
        scrolled ? "border-rule" : "border-transparent",
        hidden && "-translate-y-full",
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-[64rem] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label={`${site.name}, home`}
          className="mr-auto flex min-h-11 items-center gap-2 text-sm font-semibold"
        >
          <Monogram tone="ink" />
          <span aria-hidden className="hidden sm:inline">
            {site.name}
          </span>
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {sections.map((section) => (
              <li key={section.id}>
                <Link
                  href={`/#${section.id}`}
                  aria-current={
                    section.id === "work" && pathname.startsWith("/work") ? "page" : undefined
                  }
                  className="flex min-h-11 items-center px-3 text-sm font-medium decoration-2 underline-offset-[0.35em] hover:underline aria-[current=page]:underline"
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
        <a href={site.resume} className={buttonClasses("primary")}>
          <Download aria-hidden size={18} strokeWidth={1.75} />
          Resume
          <span className="sr-only"> (PDF)</span>
        </a>
        <MobileMenu />
      </div>
    </header>
  );
}
