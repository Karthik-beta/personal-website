"use client";

import { Dialog } from "@base-ui/react/dialog";
import { LoaderCircle, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { nav, navCurrent } from "@/lib/site";
import { MenuLabel } from "./menu-label";

/**
 * Loaded on demand by <MobileMenu>: mounted closed once the phone is idle, or open straight away
 * if someone taps the menu before then.
 */
export default function MobileMenuDialog({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [pending, setPending] = useState<string | null>(null);
  const pathname = usePathname();

  // A tap on a link to another page keeps the menu open, with that link marked as loading, until
  // the new page is in place. Closing at once left the old page on screen for a second or two on
  // slower phones, which read as a tap that hadn't worked.
  const [shownPath, setShownPath] = useState(pathname);
  if (pathname !== shownPath) {
    setShownPath(pathname);
    setOpen(false);
    setPending(null);
  }

  function onLinkClick(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    // Same page (a section of it): nothing to wait for, so close and let it scroll.
    if (new URL(href, window.location.href).pathname === pathname) setOpen(false);
    else setPending(href);
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setPending(null);
      }}
    >
      <Dialog.Trigger className={buttonClasses("quiet", "md:hidden")}>
        {open ? (
          <X aria-hidden size={18} strokeWidth={1.75} />
        ) : (
          <Menu aria-hidden size={18} strokeWidth={1.75} />
        )}
        <MenuLabel />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-x-0 top-14 bottom-0 bg-ink/20 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed inset-x-0 top-14 border-b border-rule bg-surface px-4 pt-2 pb-6 text-ink transition-[opacity,translate] duration-200 ease-enter data-ending-style:-translate-y-2 data-ending-style:opacity-0 data-ending-style:duration-150 data-ending-style:ease-exit data-starting-style:-translate-y-2 data-starting-style:opacity-0 sm:px-6">
          <Dialog.Title className="sr-only">Site menu</Dialog.Title>
          <nav aria-label="Main">
            <ul>
              {nav.map((item) => {
                const loading = pending === item.href;
                return (
                  <li key={item.href} className="border-b border-rule last:border-b-0">
                    <Link
                      href={item.href}
                      aria-current={navCurrent(item.href, pathname)}
                      aria-busy={loading || undefined}
                      onClick={(event) => onLinkClick(event, item.href)}
                      className={cn(
                        "flex min-h-14 items-center justify-between gap-4 text-xl font-semibold stretch-title decoration-2 underline-offset-[0.25em] aria-[current]:underline",
                        loading && "underline",
                      )}
                    >
                      {item.label}
                      {/* Always rendered, so showing it doesn't move anything. */}
                      <LoaderCircle
                        aria-hidden
                        size={20}
                        strokeWidth={1.75}
                        className={cn(
                          "shrink-0 text-muted transition-opacity motion-safe:animate-spin",
                          loading ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
