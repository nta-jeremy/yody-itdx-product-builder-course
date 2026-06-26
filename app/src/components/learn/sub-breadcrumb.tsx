/**
 * SubBreadcrumb — Server Component rendering the 4-level sub-session
 * breadcrumb: `Học > {level} > {parentCode} · {parentTitle} > {subCode} · {subTitle}`.
 *
 * Mirrors `Breadcrumb` (3-level) and extends with the parent → sub link pair.
 * Parent links to `/learn/[parentCode]` (course detail with sub-list).
 * Sub code is non-link (current page). No client state.
 *
 * YODY DS: token colors only, no emoji, Be Vietnam Pro inherits.
 */

import Link from "next/link";
import type { Route } from "next";
import { ChevronRight } from "lucide-react";

export interface SubBreadcrumbProps {
  /** Level label, e.g. "L4 Integrator". */
  level: string;
  /** Level number 1..5 (anchor id). */
  levelNum: number;
  /** Parent code, e.g. "I4.2". */
  parentCode: string;
  /** Parent human title (for display after the parent code). */
  parentTitle: string;
  /** Sub-session code, e.g. "I4.2.1". */
  subCode: string;
  /** Sub-session human title (for display after the sub code). */
  subTitle: string;
}

export function SubBreadcrumb({
  level,
  levelNum,
  parentCode,
  parentTitle,
  subCode,
  subTitle,
}: SubBreadcrumbProps) {
  return (
    <nav
      aria-label="Đường dẫn"
      className="mb-4 flex flex-wrap items-center gap-1.5 font-[family-name:var(--font-body)] text-[13px] text-[var(--fg-3)]"
    >
      <Link
        href="/learn"
        className="rounded-md outline-ring/50 hover:text-[var(--fg-1)] focus-visible:ring-[3px]"
      >
        Học
      </Link>
      <ChevronRight size={12} />
      <Link
        href={`/learn#L${levelNum}` as Route}
        className="rounded-md outline-ring/50 hover:text-[var(--fg-1)] focus-visible:ring-[3px]"
      >
        {level}
      </Link>
      <ChevronRight size={12} />
      <Link
        href={`/learn/${parentCode}` as Route}
        className="max-w-[280px] truncate rounded-md outline-ring/50 hover:text-[var(--fg-1)] focus-visible:ring-[3px]"
      >
        {parentCode} · {parentTitle}
      </Link>
      <ChevronRight size={12} />
      <span className="font-medium text-[var(--fg-1)]">
        {subCode} · {subTitle}
      </span>
    </nav>
  );
}

export default SubBreadcrumb;
