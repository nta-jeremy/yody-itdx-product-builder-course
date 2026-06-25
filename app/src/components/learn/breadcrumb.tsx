/**
 * Breadcrumb — Server Component rendering the 3-level learner breadcrumb:
 * `Học > {level} > {code}`. Program links to `/learn`, level links to the
 * `/learn#L{n}` anchor (the list route's `<section id="L{n}">`), current
 * code is non-link. No client state.
 *
 * YODY DS: token colors only, no emoji. Icon from lucide-react (ChevronRight).
 */

import Link from "next/link";
import type { Route } from "next";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbProps {
  /** Level label, e.g. "L1 Aware". */
  level: string;
  /** Level number 1..5 (anchor id). */
  levelNum: number;
  /** Current session code, e.g. "I1.1". */
  code: string;
}

export function Breadcrumb({ level, levelNum, code }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Đường dẫn"
      className="mb-4 flex items-center gap-1.5 font-[family-name:var(--font-body)] text-[13px] text-[var(--fg-3)]"
    >
      <Link href="/learn" className="rounded-md outline-ring/50 hover:text-[var(--fg-1)] focus-visible:ring-[3px]">
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
      <span className="font-medium text-[var(--fg-1)]">{code}</span>
    </nav>
  );
}

export default Breadcrumb;