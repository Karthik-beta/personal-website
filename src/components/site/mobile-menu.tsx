"use client";

import { Menu } from "lucide-react";
import { type ComponentType, useEffect, useState } from "react";
import { buttonClasses } from "@/components/ui/button";

// The Base UI dialog is only needed on phones, and only once someone opens the menu, so its
// code isn't part of the initial page load (docs/design/11-performance-and-seo.md).
//
// Not React.lazy: lazy() starts its own import on first render and suspends even when the code is
// already downloaded, and React then holds the Suspense reveal for ~300 ms. Keeping the loaded
// component here lets a tap render it in the same frame.
let loadedDialog: ComponentType | null = null;
let loading: Promise<ComponentType> | null = null;

function loadDialog() {
  loading ??= import("./mobile-menu-dialog")
    .then((mod) => (loadedDialog = mod.default))
    .catch((error: unknown) => {
      loading = null; // let the next tap try again, e.g. after a dropped connection
      throw error;
    });
  return loading;
}

const preload = () => void loadDialog().catch(() => {});

function MenuButton(props: React.ComponentProps<"button">) {
  return (
    <button type="button" className={buttonClasses("quiet", "md:hidden")} {...props}>
      <Menu aria-hidden size={18} strokeWidth={1.75} />
      Menu
    </button>
  );
}

export function MobileMenu() {
  const [Dialog, setDialog] = useState<ComponentType | null>(null);
  const [waiting, setWaiting] = useState(false);

  // On phones there's no hover to warm the menu up, so fetch it once the page is idle.
  useEffect(() => {
    if (!window.matchMedia("(max-width: 47.99rem)").matches) return;
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(preload, { timeout: 3000 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(preload, 1500);
    return () => clearTimeout(id);
  }, []);

  if (Dialog) return <Dialog />;

  function open() {
    if (loadedDialog) {
      setDialog(() => loadedDialog);
      return;
    }
    setWaiting(true);
    loadDialog().then(
      (component) => setDialog(() => component),
      () => setWaiting(false),
    );
  }

  return (
    <MenuButton
      aria-haspopup="dialog"
      aria-busy={waiting || undefined}
      onPointerEnter={preload}
      onFocus={preload}
      onClick={open}
    />
  );
}
