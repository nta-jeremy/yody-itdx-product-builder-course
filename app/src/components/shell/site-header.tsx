/**
 * SiteHeader — Server Component shell (YODY DS).
 *
 * Props-driven, no client state. Navigation is real <Link>s (works under
 * static export). Active section is passed as a prop since this is a Server
 * Component (usePathname is client-only).
 *
 * YODY DS compliance:
 *  - No emoji. Tag pills via Badge variants only (not used here).
 *  - Token colors only (no raw hex).
 *  - Gold reserved for the "Học" accent in the logo wordmark (decoration),
 *    never used as text body or button.
 *  - Tap targets ≥44px on interactive links; visible focus ring inherits
 *    from globals.css `outline-ring/50`.
 *  - Be Vietnam Pro inherits from the app surface (body font var).
 *  - Root carries `data-surface="app"`.
 */

import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/utils";

/** Top-level nav target. */
export type NavKey = "home" | "sessions" | "roadmap" | "badges";

export interface SiteHeaderProps {
  /** Currently active section, used to highlight the matching nav link. */
  active?: NavKey;
}

/** Nav link descriptors — order matches the rendered bar. */
const NAV_ITEMS: ReadonlyArray<{ key: NavKey; href: Route; label: string }> = [
  { key: "sessions", href: "/sessions", label: "Buổi học" },
  { key: "roadmap", href: "/roadmap", label: "Lộ trình" },
  { key: "badges", href: "/badges", label: "Huy hiệu" },
];

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header
      data-surface="app"
      className="sticky top-0 z-20 flex items-center gap-6 border-b border-border bg-[var(--bg-warm)]/92 px-6 py-3.5 backdrop-blur-md md:px-11"
    >
      <Link
        href="/"
        className="font-[family-name:var(--font-impact)] text-[17px] font-extrabold leading-none text-[var(--brand)] outline-ring/50 focus-visible:ring-[3px]"
      >
        YODY
        <span className="ml-1 text-[15px] font-bold text-[var(--gold-deep)]">
          Học
        </span>
      </Link>

      <nav
        aria-label="Điều hướng chính"
        className="flex items-center gap-1 font-[family-name:var(--font-body)] text-sm"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.key;
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex min-h-[44px] items-center rounded-md px-3 text-sm outline-ring/50 transition-colors focus-visible:ring-[3px]",
                isActive
                  ? "font-semibold text-[var(--fg-1)]"
                  : "font-medium text-[var(--fg-2)] hover:text-[var(--fg-1)]",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

export default SiteHeader;