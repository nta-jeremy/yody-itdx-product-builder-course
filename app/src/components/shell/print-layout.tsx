/**
 * PrintLayout — wrapper for the `/sessions/[code]/print` route.
 *
 * No header, no sidebar — just the content plus a thin print-toolbar with a
 * browser-print trigger (the only client island on the print page). All
 * chrome hidden under `@media print`.
 *
 * YODY DS compliance:
 *  - No emoji. Token colors only.
 *  - Root carries `data-surface="app"`.
 */

import * as React from "react";
import type { Route } from "next";
import { PrintToolbar } from "./print-toolbar";

export interface PrintLayoutProps {
  /** Page title shown in the print toolbar (browser view only). */
  title: string;
  /** Canonical URL of the source session page, for a "Back to session" link. */
  backHref: Route;
  children: React.ReactNode;
}

export function PrintLayout({ title, backHref, children }: PrintLayoutProps) {
  return (
    <div data-surface="app" className="mx-auto max-w-[820px] px-6 py-10 print:max-w-none print:px-0 print:py-0">
      <PrintToolbar title={title} backHref={backHref} />
      <div className="print-content">{children}</div>
    </div>
  );
}

export default PrintLayout;