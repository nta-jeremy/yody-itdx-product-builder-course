/**
 * /learn — landing page for the 14 learner sessions.
 *
 * Server Component. Build-time SSG (`output` not set). `listLearnerSessions()`
 * runs at build only. No client state, no `usePathname`.
 *
 * Layout mirrors the learn-harness-engineering reference: a hero intro, a row
 * of path cards (one per level), then the sessions grouped by level with a
 * visible level header and rich session cards. The Sidebar stays as the
 * persistent course navigation (desktop inline, mobile via CourseDrawer on
 * detail pages).
 *
 * YODY DS: no emoji, token colors only, Be Vietnam Pro inherits, root carries
 * `data-surface="app"`, tap targets >=44px.
 */

import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { BookOpen, Workflow, Blocks, GitBranch, Compass, ArrowRight } from "lucide-react";
import { listLearnerSessions } from "@/lib/content";
import { Sidebar } from "@/components/shell";

export const metadata: Metadata = {
  title: "Học — 14 buổi",
  description:
    "14 buổi học dành cho người học, theo 5 level (L1 Aware → L5 Architect).",
};

/** Level path-card descriptors — token colors per plan decision #20. */
const LEVEL_PATHS: ReadonlyArray<{
  levelNum: number;
  level: string;        // "L1 Aware"
  numeral: string;      // "I"
  title: string;        // "Nền tảng AI"
  blurb: string;        // one-line description
  modulePrefix: string; // "I1"
  colorVar: string;    // CSS var for numeral + accent
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}> = [
  {
    levelNum: 1, level: "L1 Aware", numeral: "I",
    title: "Nền tảng AI",
    blurb: "Hiểu mô hình AI hoạt động và giới hạn an toàn.",
    modulePrefix: "I1", colorVar: "var(--mint-deep)", Icon: BookOpen,
  },
  {
    levelNum: 2, level: "L2 Operator", numeral: "II",
    title: "Prompt & Evaluate",
    blurb: "Prompt nâng cao, công cụ AI và đo lường giá trị.",
    modulePrefix: "I2", colorVar: "var(--iris-deep)", Icon: Workflow,
  },
  {
    levelNum: 3, level: "L3 Builder", numeral: "III",
    title: "Workflow & Deliverable",
    blurb: "Thiết kế workflow cowork và giao n phẩm có chất lượng.",
    modulePrefix: "I3", colorVar: "var(--iris-deep)", Icon: Blocks,
  },
  {
    levelNum: 4, level: "L4 Integrator", numeral: "IV",
    title: "Tích hợp & Vận hành",
    blurb: "Tư duy sản phẩm, technical track và vòng lặp iterate.",
    modulePrefix: "I4", colorVar: "var(--iris-deep)", Icon: GitBranch,
  },
  {
    levelNum: 5, level: "L5 Architect", numeral: "V",
    title: "Harness Engineering & Ship",
    blurb: "Kiến trúc giải pháp, production readiness và capstone.",
    modulePrefix: "I5", colorVar: "var(--gold-deep)", Icon: Compass,
  },
];

export default async function LearnListPage() {
  const sessions = await listLearnerSessions();
  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((sum, s) => sum + s.readingMinutes, 0);

  return (
    <div
      data-surface="app"
      className="mx-auto flex w-full max-w-[var(--container-max)] items-start"
    >
      <Sidebar sessions={sessions} linkBase="/learn" />

      <main className="min-w-0 flex-1 px-6 py-11 md:px-11">
        {/* ─── Hero ─── */}
        <header className="mb-12 max-w-[720px]">
          <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--brand)]">
            Học
          </span>
          <h1 className="mt-3 font-[family-name:var(--font-impact)] text-[clamp(32px,3.4vw,44px)] font-extrabold leading-[1.1] text-[var(--fg-1)]">
            14 buổi — tài liệu học
          </h1>
          <p className="mt-3 font-[family-name:var(--font-body)] text-[17px] leading-[1.65] text-[var(--fg-2)]">
            Tài liệu học dành cho người học. Đọc theo lộ trình 5 level từ nền
            tảng AI đến kiến trúc và ship sản phẩm. Mỗi buổi là một đơn vị đọc
            độc lập, kèm mục lục và ước tính thời gian đọc.
          </p>
          <div className="mt-5 flex items-center gap-5 font-[family-name:var(--font-mono)] text-[12px] text-[var(--fg-3)]">
            <span>{totalSessions} buổi</span>
            <span className="text-[var(--border-hover)]">·</span>
            <span>~{totalMinutes} phút đọc</span>
            <span className="text-[var(--border-hover)]">·</span>
            <span>5 level</span>
          </div>
        </header>

        {/* ─── Path cards — one per level ─── */}
        <section aria-label="Lộ trình 5 level" className="mb-14">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {LEVEL_PATHS.map((lvl) => {
              const count = sessions.filter((s) => s.code.startsWith(lvl.modulePrefix)).length;
              return (
                <Link
                  key={lvl.levelNum}
                  href={`/learn#L${lvl.levelNum}` as Route}
                  className="group flex min-h-[160px] flex-col justify-between rounded-xl border border-border bg-[var(--bg)] p-5 outline-ring/50 transition-all hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:bg-[var(--bg-muted)] focus-visible:ring-[3px]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className="font-[family-name:var(--font-impact)] text-[28px] font-extrabold italic leading-none"
                        style={{ color: lvl.colorVar }}
                      >
                        {lvl.numeral}
                      </span>
                      <lvl.Icon size={18} className="text-[var(--fg-3)] transition-colors group-hover:text-[var(--fg-1)]" />
                    </div>
                    <div className="mt-4 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-3)]">
                      {lvl.level}
                    </div>
                    <div className="mt-1.5 font-[family-name:var(--font-brand)] text-[16px] font-bold leading-[1.3] text-[var(--fg-1)]">
                      {lvl.title}
                    </div>
                    <p className="mt-2 font-[family-name:var(--font-body)] text-[13px] leading-[1.5] text-[var(--fg-2)]">
                      {lvl.blurb}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between font-[family-name:var(--font-mono)] text-[11px] font-semibold text-[var(--fg-3)]">
                    <span>{count} buổi</span>
                    <span className="inline-flex items-center gap-1 text-[var(--brand)] transition-transform group-hover:translate-x-0.5">
                      Bắt đầu <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ─── Sessions grouped by level ─── */}
        <div className="space-y-12">
          {LEVEL_PATHS.map((lvl) => {
            const groupSessions = sessions.filter((s) =>
              s.code.startsWith(lvl.modulePrefix),
            );
            if (groupSessions.length === 0) return null;
            return (
              <section
                key={lvl.levelNum}
                id={`L${lvl.levelNum}`}
                aria-label={lvl.level}
                className="scroll-mt-[88px]"
              >
                {/* Visible level header — the reference shows clear section
                    titles; the Sidebar grouping alone is not enough on the
                    landing page where the reader scans top-to-bottom. */}
                <div className="mb-4 flex items-baseline gap-3 border-b border-border pb-3">
                  <span
                    className="font-[family-name:var(--font-impact)] text-[22px] font-extrabold italic leading-none"
                    style={{ color: lvl.colorVar }}
                  >
                    {lvl.numeral}
                  </span>
                  <h2 className="font-[family-name:var(--font-brand)] text-[18px] font-bold leading-[1.2] text-[var(--fg-1)]">
                    {lvl.title}
                  </h2>
                  <span className="ml-auto font-[family-name:var(--font-mono)] text-[11px] font-semibold text-[var(--fg-3)]">
                    {lvl.level}
                  </span>
                </div>

                <ul className="flex flex-col gap-3">
                  {groupSessions.map((s) => (
                    <li key={s.code}>
                      <Link
                        href={`/learn/${s.code}` as Route}
                        className="group block min-h-[72px] rounded-xl border border-border bg-[var(--bg)] px-5 py-4 outline-ring/50 transition-all hover:border-[var(--border-hover)] hover:bg-[var(--bg-muted)] focus-visible:ring-[3px]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-[family-name:var(--font-mono)] text-[13px] font-semibold text-[var(--brand)]">
                            {s.code}
                          </span>
                          <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--fg-3)]">
                            {s.level}
                          </span>
                          <span className="ml-auto inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--fg-3)]">
                            ~{s.readingMinutes} phút
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between gap-3">
                          <span className="font-[family-name:var(--font-brand)] text-[17px] font-bold leading-[1.3] text-[var(--fg-1)]">
                            {s.title}
                          </span>
                          <ArrowRight
                            size={16}
                            className="flex-none text-[var(--fg-3)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-[var(--brand)] group-hover:opacity-100"
                          />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        {/* ─── Next steps ─── */}
        <section className="mt-14 border-t border-border pt-8">
          <h2 className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fg-3)]">
            Bước tiếp theo
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href={`/learn/${sessions[0]?.code ?? "I1.1"}` as Route}
              className="group flex min-h-[72px] items-center justify-between rounded-xl border border-border bg-[var(--bg)] px-5 py-4 outline-ring/50 transition-all hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:bg-[var(--bg-muted)] focus-visible:ring-[3px]"
            >
              <div>
                <div className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--fg-3)]">
                  Bắt đầu từ đầu
                </div>
                <div className="mt-1 font-[family-name:var(--font-brand)] text-[15px] font-bold leading-[1.3] text-[var(--fg-1)]">
                  {sessions[0]?.code} — {sessions[0]?.title}
                </div>
              </div>
              <ArrowRight size={18} className="flex-none text-[var(--brand)] transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={"/roadmap" as Route}
              className="group flex min-h-[72px] items-center justify-between rounded-xl border border-border bg-[var(--bg)] px-5 py-4 outline-ring/50 transition-all hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:bg-[var(--bg-muted)] focus-visible:ring-[3px]"
            >
              <div>
                <div className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--fg-3)]">
                  Xem toàn bộ lộ trình
                </div>
                <div className="mt-1 font-[family-name:var(--font-brand)] text-[15px] font-bold leading-[1.3] text-[var(--fg-1)]">
                  Lộ trình & huy hiệu
                </div>
              </div>
              <ArrowRight size={18} className="flex-none text-[var(--brand)] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}