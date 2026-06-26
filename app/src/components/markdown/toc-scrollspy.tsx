/**
 * TocScrollspy — client wrapper around the server-extracted TOC items.
 *
 * The server `extractToc` (toc.tsx) parses H2/H3 headings into `TocItem[]`.
 * This client island receives those items as a prop and:
 *   1. Uses an IntersectionObserver to track the heading currently in view.
 *   2. Drives a VitePress-style `outline-marker` — a vertical bar that
 *      slides (top/height) to sit beside the active link, rather than only
 *      recolouring the item. The marker lives inside `.yody-toc-marker`
 *      and is positioned by inline style relative to the active <li>.
 *
 * Keeping extraction on the server preserves RSC purity; this wrapper only
 * handles the interaction state.
 *
 * YODY DS: token colors only (active state via --brand), no emoji, Be
 * Vietnam Pro inherits, root carries `data-surface="app"`.
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
  const listRef = React.useRef<HTMLUListElement>(null);
  const markerRef = React.useRef<HTMLDivElement>(null);

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

  // Move the sliding marker to align with the active <li>.
  React.useEffect(() => {
    if (items.length < 2) return;
    const list = listRef.current;
    const marker = markerRef.current;
    if (!list || !marker) return;

    const activeLi = activeId
      ? list.querySelector<HTMLElement>(`[data-target="${CSS.escape(activeId)}"]`)
      : null;

    if (activeLi) {
      const listRect = list.getBoundingClientRect();
      const liRect = activeLi.getBoundingClientRect();
      marker.style.top = `${liRect.top - listRect.top}px`;
      marker.style.height = `${liRect.height}px`;
      marker.style.opacity = "1";
    } else {
      marker.style.opacity = "0";
    }
  }, [activeId, items]);

  if (items.length < 2) return null;

  return (
    <aside
      data-surface="app"
      className={cn(
        "yody-toc",
        "sticky top-[96px]",
        "max-h-[calc(100vh-128px)]",
        "w-[200px] flex-none overflow-y-auto",
        "py-[var(--s-10)] pl-[var(--s-5)] pr-[var(--s-2)]",
        className,
      )}
      aria-label="Mục lục"
    >
      <div
        className="yody-toc-label mb-[var(--s-3)] font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fg-3)]"
        role="heading"
        aria-level={2}
      >
        Trên trang
      </div>
      <div className="relative">
        <div ref={markerRef} className="yody-toc-marker" style={{ opacity: 0 }} aria-hidden="true" />
        <nav>
          <ul ref={listRef} className="m-0 list-none p-0">
            {items.map((item, idx) => {
              const isActive = activeId === item.id;
              return (
                <li
                  key={`${item.id}-${idx}`}
                  data-target={item.id}
                  className={cn(item.level === 3 && "pl-[14px]")}
                >
                  <a
                    href={`#${item.id}`}
                    className={cn(
                      "yody-toc-link block py-[5px] pl-[14px] no-underline",
                      "font-[family-name:var(--font-body)] text-[13px] leading-[1.4]",
                      item.level === 3 && "text-[12px]",
                      isActive
                        ? "font-medium text-[var(--brand)]"
                        : "text-[var(--fg-3)] hover:text-[var(--fg-1)]",
                    )}
                  >
                    {item.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default TocScrollspy;