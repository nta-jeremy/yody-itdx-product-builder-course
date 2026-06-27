/**
 * Sidebar — Server Component shell (YODY DS).
 *
 * Pulls the 14 sessions from the content layer (listSessions) at build time,
 * grouped into the 5-level roadmap (L1..L5) per plan decision #20:
 *   L1 mint · L2-L4 iris · L5 gold
 *
 * Layout: sticky aside, per-module roman numeral + title, indented lesson
 * list with a VitePress-style left indicator rail on each item that
 * highlights on hover/active.
 *
 * Auto-expand: any parent whose kit has been split into multiple `.md`
 * files (i.e. `subSessions.length > 0`) is rendered with its sub-list
 * expanded at all times — the buổi phụ is visible at a glance so users
 * can navigate directly without first clicking into the parent page.
 * The active sub-session (if any) is highlighted via `activeSubCode` /
 * `pathname` (legacy).
 *
 * YODY DS compliance:
 *  - No emoji. Token colors only (level color via CSS var, not hex).
 *  - Active session highlighted (passed as prop from the page, since this is a
 *    server component and usePathname is client-only).
 *  - Tap targets ≥44px (min-h on links). Visible focus ring.
 *  - Root aside carries `data-surface="app"`.
 *
 * Render shape:
 *  - Sync path (`sessions` provided): renders synchronously — compatible with
 *    test environments (jsdom) that can't `await` async server components.
 *  - Async path (`sessions` omitted): wraps `loadSessions()` + defers via
 *    `SidebarAsync`. Callers must `await` it.
 */

import Link from "next/link";
import type { Route } from "next";
import { headers } from "next/headers";
import { listSessions, type SessionContent, type SubSessionMeta } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Level descriptors — token colors per plan decision #20. */
const LEVELS: ReadonlyArray<{
  level: string;
  numeral: string;
  title: string;
  colorVar: string;
  modulePrefix: string;
}> = [
  { level: "L1", numeral: "I",   title: "Nền tảng AI",      colorVar: "var(--mint-deep)", modulePrefix: "I1" },
  { level: "L2", numeral: "II",  title: "Prompt & Evaluate",   colorVar: "var(--iris-deep)", modulePrefix: "I2" },
  { level: "L3", numeral: "III", title: "Workflow & Deliverable", colorVar: "var(--iris-deep)", modulePrefix: "I3" },
  { level: "L4", numeral: "IV",  title: "Tích hợp & Vận hành", colorVar: "var(--iris-deep)", modulePrefix: "I4" },
  { level: "L5", numeral: "V",   title: "Harness & Ship", colorVar: "var(--gold-deep)", modulePrefix: "I5" },
];

/**
 * Structural session ref — Sidebar only reads `code` + `title` (+ optional
 * `subSessions`), so both the mentor `SessionContent[]` and the learner
 * `LearnerContent[]` (G2) satisfy it. Backward compatible: existing callers
 * passing `SessionContent[]` (without `subSessions`) keep working.
 */
type SidebarSession = {
  code: string;
  title: string;
  subSessions?: readonly SubSessionMeta[];
};

export interface SidebarProps {
  activeCode?: string;
  /**
   * Active sub-session code (full 3-segment form, e.g. "I2.1.1"). When set,
   * the matching parent auto-expands to reveal its sub-list. Preferred over
   * the `pathname` prop — call sites already have the code in hand.
   */
  activeSubCode?: string;
  sessions?: ReadonlyArray<SidebarSession>;
  linkBase?: string;
  /** Current pathname (set via `x-pathname` header by middleware). When
   *  provided, used to detect active sub-session for auto-expand.
   *  DEPRECATED: prefer `activeSubCode` — this fallback exists only for
   *  legacy routes that pre-date the sub-session UI. */
  pathname?: string;
}

async function loadSessions(): Promise<SessionContent[]> {
  return listSessions();
}

async function readPathname(): Promise<string> {
  try {
    const hdrs = await headers();
    return hdrs.get("x-pathname") ?? "";
  } catch {
    return "";
  }
}

interface RenderArgs {
  sessions: ReadonlyArray<SidebarSession>;
  activeCode?: string;
  activeSubCode?: string;
  linkBase: string;
  pathname: string;
}

function renderSidebar({
  sessions,
  activeCode,
  activeSubCode,
  linkBase,
  pathname,
}: RenderArgs) {
  // Resolve the active sub-session (full 3-segment form, e.g. "I2.1.1").
  // Prefer explicit prop, fall back to parsing pathname. Used to highlight
  // the active sub in the expanded list — parents with sub-sessions always
  // expand (see `expandSubs` below), so highlight can stay decoupled.
  const subFromPath = pathname.match(
    new RegExp(`^${linkBase.replace(/\//g, "\\/")}\\/(I[1-5]\\.[1-3])\\/([1-3])$`),
  );
  const resolvedSubCode = activeSubCode
    ? activeSubCode
    : subFromPath
    ? `${subFromPath[1]}.${subFromPath[2]}`
    : null;

  return (
    <aside
      data-surface="app"
      aria-label="Danh sách buổi học theo level"
      className="sticky top-[64px] max-h-[calc(100vh-64px)] w-[280px] flex-none overflow-y-auto border-r border-border bg-[var(--bg-warm)] px-3 py-5"
    >
      {LEVELS.map((lvl) => {
        const lvlSessions = sessions.filter((s) => s.code.startsWith(lvl.modulePrefix));
        if (lvlSessions.length === 0) return null;
        return (
          <div key={lvl.level} className="mb-5 last:mb-0">
            <div className="mb-2 flex items-baseline gap-2 px-3">
              <span
                className="font-[family-name:var(--font-impact)] text-[14px] font-extrabold italic leading-none"
                style={{ color: lvl.colorVar }}
              >
                {lvl.numeral}
              </span>
              <span className="font-[family-name:var(--font-brand)] text-[12px] font-bold leading-[1.3] text-[var(--fg-1)]">
                {lvl.title}
              </span>
            </div>

            <div className="relative">
              <div className="absolute bottom-1 left-0 top-1 w-px bg-[var(--border)]" aria-hidden="true" />
              <div className="flex flex-col">
                {lvlSessions.map((s) => {
                  const isActive = activeCode === s.code;
                  const hasSubs = (s.subSessions?.length ?? 0) > 0;
                  // Always expand parents that have sub-sessions — users
                  // need to see the buổi phụ at a glance, regardless of
                  // whether the current page is the parent or a sub-route.
                  const expandSubs = hasSubs;
                  return (
                    <div key={s.code}>
                      <Link
                        href={`${linkBase}/${s.code}` as Route}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "group relative flex min-h-[44px] items-start rounded-r-[8px] py-2.5 pl-5 pr-3 text-left font-[family-name:var(--font-body)] text-[13px] leading-[1.5] outline-ring/50 transition-colors focus-visible:ring-[3px]",
                          isActive
                            ? "bg-[var(--brand-tint)] font-semibold text-[var(--brand)]"
                            : "font-normal text-[var(--fg-2)] hover:bg-[var(--bg-muted)] hover:text-[var(--fg-1)]",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute bottom-2 left-0 top-2 w-[2px] rounded-full transition-colors",
                            isActive
                              ? "bg-[var(--brand)]"
                              : "bg-transparent group-hover:bg-[var(--border-hover)]",
                          )}
                        />
                        <span className="mr-2 mt-0.5 flex-none font-[family-name:var(--font-mono)] text-[11px] text-[var(--fg-3)]">
                          {s.code}
                        </span>
                        <span className="line-clamp-2">{s.title}</span>
                      </Link>
                      {expandSubs ? (
                        <ul className="mb-1 flex flex-col">
                          {s.subSessions!.map((sub) => {
                            const isSubActive = sub.subCode === resolvedSubCode;
                            return (
                              <li key={sub.subCode}>
                                <Link
                                  href={`${linkBase}/${s.code}/${sub.subCode.replace(`${s.code}.`, "")}` as Route}
                                  aria-current={isSubActive ? "page" : undefined}
                                  className={cn(
                                    "group relative flex min-h-[40px] items-start gap-1.5 rounded-r-[8px] py-1.5 pl-9 pr-3 text-left font-[family-name:var(--font-body)] text-[12px] leading-[1.5] outline-ring/50 transition-colors focus-visible:ring-[3px]",
                                    isSubActive
                                      ? "bg-[var(--brand-tint)] font-semibold text-[var(--brand)]"
                                      : "text-[var(--fg-3)] hover:bg-[var(--bg-muted)] hover:text-[var(--fg-1)]",
                                  )}
                                >
                                  <span className="mt-0.5 flex-none font-[family-name:var(--font-mono)] text-[10px]">
                                    {sub.subCode}
                                  </span>
                                  <span className="line-clamp-2 flex-1">{sub.title}</span>
                                  <span className="ml-auto flex-none font-[family-name:var(--font-mono)] text-[10px] text-[var(--fg-3)]">
                                    {sub.readingMinutes}&rsquo; đọc · {sub.duration}&rsquo; live
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </aside>
  );
}

/** Sync entry — call when `sessions` is pre-fetched (most routes). */
export function Sidebar({
  activeCode,
  activeSubCode,
  sessions,
  linkBase = "/sessions",
  pathname,
}: SidebarProps) {
  if (!sessions) {
    return SidebarAsync({ activeCode, activeSubCode, linkBase });
  }
  return renderSidebar({
    sessions,
    activeCode,
    activeSubCode,
    linkBase,
    pathname: pathname ?? "",
  });
}

/** Async entry — call when caller wants Sidebar to load sessions itself. */
export async function SidebarAsync({
  activeCode,
  activeSubCode,
  linkBase = "/sessions",
  pathname,
}: Omit<SidebarProps, "sessions">) {
  const sessions = await loadSessions();
  return renderSidebar({
    sessions,
    activeCode,
    activeSubCode,
    linkBase,
    pathname: pathname ?? (await readPathname()),
  });
}

export default Sidebar;
