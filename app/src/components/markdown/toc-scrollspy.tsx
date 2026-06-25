/**
 * TocScrollspy — client wrapper around the server-extracted TOC items.
 *
 * The server `extractToc` (toc.tsx) parses H2/H3 headings into `TocItem[]`.
 * This client island receives those items as a prop and uses an
 * IntersectionObserver to highlight the link of the heading currently in
 * view. Keeping extraction on the server preserves RSC purity; this
 * wrapper only handles the interaction state.
 *
 * YODY DS: token colors only (active state via --brand-tint / --brand),
 * no emoji, Be Vietnam Pro inherits, root carries `data-surface="app"`.
 */

"use client";

import * as React from "react";
import type { TocItem } from "./toc";
import { cn } from "@/lib/utils";

export interface TocScrollspyProps {
  /** Headings extracted server-side via `extractToc(source)`. */
  items: TocItem[];
  /** Extra className for the aside. */
  className?: string;
}

export function TocScrollspy({ items, className }: TocScrollspyProps) {
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    // No spy worth running for 0-1 headings (the server Toc also hides then).
    if (items.length < 2) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting entry as active.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (visible) setActiveId(visible.target.id);
      },
      // Trigger zone: bottom 70% of the viewport counts as "in view".
      { rootMargin: "0% 0% -70% 0%", threshold: [0, 1] },
    );

    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <aside
      data-surface="app"
      className={cn(
        "yody-toc",
        "sticky top-[var(--toc-offset,73px)]",
        "max-h-[calc(100vh-var(--toc-offset,73px))]",
        "w-[var(--toc-width,200px)] flex-none overflow-auto",
        "px-[var(--s-5)] py-[var(--s-10)]",
        className,
      )}
      aria-label="Mục lục"
    >
      <div className="yody-toc-label mb-[var(--s-3)] font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.2em] text-fg-3">
        Trên trang
      </div>
      <nav className="flex flex-col gap-[2px]">
        <ul className="m-0 list-none p-0">
          {items.map((item, idx) => {
            const isActive = activeId === item.id;
            return (
              <li
                key={`${item.id}-${idx}`}
                className={cn("yody-toc-item", item.level === 3 && "pl-[var(--s-4)]")}
              >
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "yody-toc-link block border-l-2 border-transparent py-[5px] pl-[var(--s-3)]",
                    "font-[family-name:var(--font-body)] text-[13px] leading-[1.4] no-underline",
                    "text-fg-2 hover:text-iris-deep hover:border-iris",
                    item.level === 3 && "text-[12px]",
                    isActive &&
                      "bg-[var(--brand-tint)] font-medium text-[var(--brand)] border-iris",
                  )}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default TocScrollspy;