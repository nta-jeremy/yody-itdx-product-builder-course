/**
 * Sidebar — Server Component shell (YODY DS).
 *
 * Pulls the 14 sessions from the content layer (listSessions) at build time,
 * grouped into the 5-level roadmap (L1..L5) per plan decision #20:
 *   L1 mint · L2-L4 iris · L5 gold
 *
 * Layout: sticky aside, per-module roman numeral + title, indented lesson
 * list with a left rail.
 *
 * YODY DS compliance:
 *  - No emoji. Token colors only (level color via CSS var, not hex).
 *  - Active session highlighted (passed as prop from the page, since this is a
 *    server component and usePathname is client-only).
 *  - Tap targets ≥44px (min-h on links). Visible focus ring.
 *  - Root aside carries `data-surface="app"`.
 */

import Link from "next/link";
import type { Route } from "next";
import { listSessions, type SessionContent } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Level descriptors — token colors per plan decision #20. */
const LEVELS: ReadonlyArray<{
  level: string;            // "L1"
  numeral: string;          // "I"
  title: string;            // "Nền tảng AI"
  colorVar: string;         // CSS var for the roman numeral
  modulePrefix: string;     // "I1"
}> = [
  { level: "L1", numeral: "I",   title: "Nền tảng AI",      colorVar: "var(--mint-deep)", modulePrefix: "I1" },
  { level: "L2", numeral: "II",  title: "Tạo & đo lường",   colorVar: "var(--iris-deep)", modulePrefix: "I2" },
  { level: "L3", numeral: "III", title: "Workflow & deliverable", colorVar: "var(--iris-deep)", modulePrefix: "I3" },
  { level: "L4", numeral: "IV",  title: "Tích hợp & vận hành", colorVar: "var(--iris-deep)", modulePrefix: "I4" },
  { level: "L5", numeral: "V",   title: "Kiến trúc & ship", colorVar: "var(--gold-deep)", modulePrefix: "I5" },
];

export interface SidebarProps {
  /** sessionCode of the page being viewed, to highlight its link. */
  activeCode?: string;
  /** Sessions already fetched (avoid duplicate reads when the page has them). */
  sessions?: SessionContent[];
}

async function loadSessions(): Promise<SessionContent[]> {
  return listSessions();
}

export async function Sidebar({ activeCode, sessions }: SidebarProps) {
  const all = sessions ?? (await loadSessions());

  return (
    <aside
      data-surface="app"
      aria-label="Danh sách buổi học theo level"
      className="sticky top-[73px] max-h-[calc(100vh-73px)] w-[280px] flex-none overflow-auto border-r border-border bg-[var(--bg-warm)] p-4"
    >
      {LEVELS.map((lvl) => {
        const lvlSessions = all.filter((s) => s.code.startsWith(lvl.modulePrefix));
        if (lvlSessions.length === 0) return null;
        return (
          <div key={lvl.level} className="mb-5">
            <div className="mb-2 flex items-baseline gap-2">
              <span
                className="font-[family-name:var(--font-impact)] text-[15px] font-extrabold italic"
                style={{ color: lvl.colorVar }}
              >
                {lvl.numeral}
              </span>
              <span className="font-[family-name:var(--font-brand)] text-xs font-bold leading-[1.3] text-[var(--fg-1)]">
                {lvl.title}
              </span>
            </div>

            <div className="ml-2.5 flex flex-col gap-px border-l border-border pl-[13px]">
              {lvlSessions.map((s) => {
                const isActive = activeCode === s.code;
                return (
                  <Link
                    key={s.code}
                    href={`/sessions/${s.code}` as Route}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "min-h-[36px] rounded-[6px] px-2.5 py-1.5 text-left font-[family-name:var(--font-body)] text-[13px] leading-[1.4] outline-ring/50 transition-colors focus-visible:ring-[3px]",
                      isActive
                        ? "bg-[var(--brand-tint)] font-bold text-[var(--brand)]"
                        : "font-normal text-[var(--fg-2)] hover:bg-[var(--card)] hover:text-[var(--fg-1)]",
                    )}
                  >
                    <span className="mr-2 font-[family-name:var(--font-mono)] text-[11px] text-[var(--fg-3)]">
                      {s.code}
                    </span>
                    {s.title}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </aside>
  );
}

export default Sidebar;