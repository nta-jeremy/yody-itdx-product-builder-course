/**
 * /sessions — list all 14 sessions, grouped by the 5 levels.
 *
 * Side-by-side with the Sidebar (5-level tree). Reads live from the content
 * layer (build-time SSG).
 *
 * YODY DS: no emoji, token colors only, Be Vietnam Pro inherits, root carries
 * `data-surface="app"`.
 */

import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { listSessions, type SessionContent } from "@/lib/content";
import { Sidebar } from "@/components/shell";

export const metadata: Metadata = {
  title: "Danh sách buổi học",
  description: "14 buổi học của chương trình Intern Product Builder, theo 5 level (L1 Aware → L5 Architect).",
};

const LEVEL_LABEL: Record<string, string> = {
  L1: "L1 Aware",
  L2: "L2 Operator",
  L3: "L3 Builder",
  L4: "L4 Integrator",
  L5: "L5 Architect",
};

function levelOf(session: SessionContent): string {
  // `level` arrives like "L1 Aware" — derive the "L1" token.
  const m = session.level.match(/^L[1-5]/);
  return m ? m[0] : "";
}

export default async function SessionsListPage() {
  const sessions = await listSessions();

  return (
    <div data-surface="app" className="mx-auto flex w-full max-w-[var(--container-max)] items-start">
      <Sidebar sessions={sessions} />

      <main className="flex-1 px-6 py-11 md:px-11">
        <header className="mb-8">
          <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--brand)]">
            Buổi học
          </span>
          <h1 className="mt-3 font-[family-name:var(--font-impact)] text-[clamp(32px,3.4vw,44px)] font-extrabold leading-[1.1] text-[var(--fg-1)]">
            14 buổi — giáo án + cẩm nang giảng
          </h1>
          <p className="mt-2 max-w-[640px] font-[family-name:var(--font-body)] text-[16px] leading-[1.6] text-[var(--fg-2)]">
            Mỗi buổi có hai cột hiển thị song song: giáo án cho học viên và
            cẩm nang giảng cho trainer. Có chế độ in riêng cho trainer.
          </p>
        </header>

        <ul className="flex flex-col gap-3">
          {sessions.map((s) => {
            const lvl = levelOf(s);
            return (
              <li key={s.code}>
                <Link
                  href={`/sessions/${s.code}` as Route}
                  className="block min-h-[64px] rounded-xl border border-border bg-[var(--bg)] px-5 py-4 outline-ring/50 transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--bg-2)] focus-visible:ring-[3px]"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-[family-name:var(--font-mono)] text-[13px] font-semibold text-[var(--brand)]">
                      {s.code}
                    </span>
                    {lvl && (
                      <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fg-3)]">
                        {LEVEL_LABEL[lvl] ?? lvl}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 font-[family-name:var(--font-brand)] text-[17px] font-bold leading-[1.3] text-[var(--fg-1)]">
                    {s.title}
                  </div>
                  {s.gateRole && (
                    <div className="mt-1 font-[family-name:var(--font-body)] text-[13px] text-[var(--fg-3)]">
                      Gate role: {s.gateRole}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}