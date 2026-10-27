"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import { sections } from "@/lib/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={buttonClasses("quiet", "md:hidden")}>
        {open ? (
          <X aria-hidden size={18} strokeWidth={1.75} />
        ) : (
          <Menu aria-hidden size={18} strokeWidth={1.75} />
        )}
        Menu
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-x-0 top-14 bottom-0 bg-ink/20 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed inset-x-0 top-14 border-b border-rule bg-surface px-4 pt-2 pb-6 text-ink transition-[opacity,translate] duration-200 ease-enter data-ending-style:-translate-y-2 data-ending-style:opacity-0 data-ending-style:duration-150 data-ending-style:ease-exit data-starting-style:-translate-y-2 data-starting-style:opacity-0 sm:px-6">
          <Dialog.Title className="sr-only">Site menu</Dialog.Title>
          <nav aria-label="Main">
            <ul>
              {sections.map((section) => (
                <li key={section.id} className="border-b border-rule last:border-b-0">
                  <Link
                    href={`/#${section.id}`}
                    onClick={() => setOpen(false)}
                    className="flex min-h-14 items-center text-xl font-semibold stretch-title"
                  >
                    {section.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
