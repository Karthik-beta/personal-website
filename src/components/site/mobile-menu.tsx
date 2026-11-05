"use client";

import { Menu } from "lucide-react";
import { type ComponentType, useEffect, useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import { MenuLabel } from "./menu-label";

// The Base UI dialog is only needed on phones, so its code isn't part of the initial page load
// (docs/design/11-performance-and-seo.md): it loads once the page is idle, or on the first tap.
//
// Not React.lazy: lazy() starts its own import on first render and suspends even when the code is
// already downloaded, and React then holds the Suspense reveal for ~300 ms. Keeping the loaded
// component here lets a tap render it in the same frame.
type DialogComponent = ComponentType<{ defaultOpen?: boolean }>;

let loadedDialog: DialogComponent | null = null;
let loading: Promise<DialogComponent> | null = null;

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
      <MenuLabel />
    </button>
  );
}

export function MobileMenu() {
  const [dialog, setDialog] = useState<{ Dialog: DialogComponent; open: boolean } | null>(null);
  const [waiting, setWaiting] = useState(false);

  // On phones there's no hover to warm the menu up, so once the page is idle, fetch it and mount it
  // closed. Mounting it costs a few hundred milliseconds on a mid-range phone: done here, a tap
  // only has to open it.
  useEffect(() => {
    if (!window.matchMedia("(max-width: 47.99rem)").matches) return;
    let cancelled = false;
    const mount = () =>
      void loadDialog().then(
        (Dialog) => !cancelled && setDialog((current) => current ?? { Dialog, open: false }),
        () => {},
      );
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(mount, { timeout: 3000 });
      return () => {
        cancelled = true;
        cancelIdleCallback(id);
      };
    }
    const id = setTimeout(mount, 1500);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, []);

  if (dialog) return <dialog.Dialog defaultOpen={dialog.open} />;

  function open() {
    if (loadedDialog) {
      setDialog({ Dialog: loadedDialog, open: true });
      return;
    }
    setWaiting(true);
    loadDialog().then(
      (Dialog) => setDialog({ Dialog, open: true }),
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
