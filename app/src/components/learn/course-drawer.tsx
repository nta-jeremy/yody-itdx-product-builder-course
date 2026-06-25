/**
 * CourseDrawer — client island wrapping the Sidebar in a Radix Dialog for
 * mobile (`<lg`). Uses the **children-prop pattern**: the Sidebar is an
 * async Server Component, so a client component cannot import it directly
 * (that would leak fs + await into the client bundle). The Server Component
 * page renders `<Sidebar>` and passes the result as `children` here.
 *
 * Desktop (`>=lg`): the trigger is hidden; the page renders the Sidebar
 * directly in a `hidden lg:flex` container.
 *
 * YODY DS: token colors only, tap target >=44px on the trigger, visible
 * focus ring, no emoji. Icon from lucide-react (Menu).
 */

"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu } from "lucide-react";

export interface CourseDrawerProps {
  /** Server-rendered Sidebar output. */
  children: React.ReactNode;
}

export function CourseDrawer({ children }: CourseDrawerProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        type="button"
        aria-label="Mở danh sách buổi học"
        className="lg:hidden inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-border bg-[var(--bg)] px-[var(--s-2)] text-[var(--fg-2)] outline-ring/50 transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--fg-1)] focus-visible:ring-[3px]"
      >
        <Menu size={20} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
        <Dialog.Content className="fixed left-0 top-0 z-50 h-full w-[280px] max-w-[80vw] overflow-auto bg-[var(--bg-warm)] outline-none">
          <Dialog.Title className="sr-only">Danh sách buổi học</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CourseDrawer;