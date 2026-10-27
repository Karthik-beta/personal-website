"use client";

import { Menu } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { buttonClasses } from "@/components/ui/button";

// The Base UI dialog is only needed on phones, and only once someone opens the menu, so its
// code isn't part of the initial page load (docs/design/11-performance-and-seo.md).
const load = () => import("./mobile-menu-dialog");
const MobileMenuDialog = lazy(load);

function MenuButton(props: React.ComponentProps<"button">) {
  return (
    <button type="button" className={buttonClasses("quiet", "md:hidden")} {...props}>
      <Menu aria-hidden size={18} strokeWidth={1.75} />
      Menu
    </button>
  );
}

export function MobileMenu() {
  const [requested, setRequested] = useState(false);

  if (!requested) {
    // Start fetching on hover/focus so the menu is usually ready by the time it's tapped.
    return (
      <MenuButton
        aria-haspopup="dialog"
        onPointerEnter={load}
        onFocus={load}
        onClick={() => setRequested(true)}
      />
    );
  }

  return (
    <Suspense fallback={<MenuButton aria-haspopup="dialog" aria-busy />}>
      <MobileMenuDialog />
    </Suspense>
  );
}
