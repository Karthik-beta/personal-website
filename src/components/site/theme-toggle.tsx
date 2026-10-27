"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { buttonClasses } from "@/components/ui/button";

type Theme = "light" | "dark";
const darkQuery = "(prefers-color-scheme: dark)";

function currentTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia(darkQuery).matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(darkQuery);
  const observer = new MutationObserver(onChange);
  media.addEventListener("change", onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => {
    media.removeEventListener("change", onChange);
    observer.disconnect();
  };
}

export function ThemeToggle() {
  // null on the server: the theme is only known in the browser.
  const theme = useSyncExternalStore<Theme | null>(subscribe, currentTheme, () => null);

  function toggle() {
    const root = document.documentElement;
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    root.classList.add("theme-switching");
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage blocked: the choice lasts for this page view only.
    }
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.classList.remove("theme-switching")),
    );
  }

  const label =
    theme === null
      ? "Switch colour theme"
      : theme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className={buttonClasses("quiet", undefined, "icon")}
    >
      <Moon aria-hidden size={18} strokeWidth={1.75} className="dark:hidden" />
      <Sun aria-hidden size={18} strokeWidth={1.75} className="hidden dark:block" />
    </button>
  );
}
