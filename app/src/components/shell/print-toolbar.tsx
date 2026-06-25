/**
 * PrintToolbar — client island for the print route.
 *
 * The print route is otherwise fully Server-Component rendered; this is the
 * only interactive bit: a "In trang" button calling window.print() and a
 * "Quay lại buổi học" link. Hidden under `@media print`.
 */

"use client";

import * as React from "react";
import type { Route } from "next";
import Link from "next/link";

export interface PrintToolbarProps {
  title: string;
  backHref: Route;
}

export function PrintToolbar({ title, backHref }: PrintToolbarProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-4 print:hidden">
      <div>
        <div className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fg-3)]">
          Bản in
        </div>
        <h1 className="mt-1 font-[family-name:var(--font-brand)] text-lg font-bold text-[var(--fg-1)]">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={backHref}
          className="inline-flex min-h-[44px] items-center rounded-full border border-border px-4 text-sm font-medium text-[var(--fg-1)] outline-ring/50 transition-colors hover:bg-[var(--bg-muted)] focus-visible:ring-[3px]"
        >
          Quay lại buổi học
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-[44px] items-center rounded-full bg-[var(--brand)] px-5 text-sm font-semibold text-white outline-ring/50 transition-colors hover:bg-[var(--brand-light)] focus-visible:ring-[3px]"
        >
          In trang
        </button>
      </div>
    </div>
  );
}

export default PrintToolbar;