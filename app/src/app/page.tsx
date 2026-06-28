/**
 * / — Intern program home (Server Component).
 *
 * Renders the Intern program cover: hero + stats + CTA → /learn. Reads
 * live session count from the content layer at build time.
 *
 * YODY DS: no emoji, token colors only, gold reserved for the logo wordmark
 * (handled in SiteHeader) and the single climax stat ("14"), Be Vietnam Pro
 * inherits from app surface, `data-surface="app"` on root.
 */

import Link from "next/link";
import { listSessions } from "@/lib/content";

export default async function HomePage() {
  const sessions = await listSessions();
  const sessionCount = sessions.length;

  return (
    <div data-surface="app" className="mx-auto w-full max-w-[var(--container-max)] px-6 py-16 md:px-11">
      {/* Hero */}
      <section aria-labelledby="hero-title" className="flex flex-col gap-6">
        <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--brand)]">
          Intern · Product Builder
        </span>
        <h1
          id="hero-title"
          className="font-[family-name:var(--font-impact)] text-[clamp(40px,5vw,64px)] font-extrabold leading-[1.05] text-[var(--fg-1)]"
        >
          Xây dựng sản phẩm AI — từ Mindset đến Ship.
        </h1>
        <p className="max-w-[680px] font-[family-name:var(--font-body)] text-[18px] leading-[1.65] text-[var(--fg-2)]">
          Chương trình Intern Product Builder gồm 5 level (L1–L5), 14 buổi học
          và cẩm nang giảng kèm. Mỗi level chốt bằng điều kiện để đi tiếp — bạn vượt
          qua bằng deliverable thật, không phải điểm số.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/learn"
            className="inline-flex min-h-[44px] items-center rounded-full bg-[var(--brand)] px-7 text-sm font-semibold text-white outline-ring/50 transition-colors hover:bg-[var(--brand-light)] focus-visible:ring-[3px]"
          >
            Bắt đầu học
          </Link>
          <Link
            href="/roadmap"
            className="inline-flex min-h-[44px] items-center rounded-full border border-border px-6 text-sm font-medium text-[var(--fg-1)] outline-ring/50 transition-colors hover:bg-[var(--bg-muted)] focus-visible:ring-[3px]"
          >
            Xem lộ trình
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section
        aria-label="Thông tin chương trình"
        className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4"
      >
        <Stat label="Buổi học" value={String(sessionCount)} />
        <Stat label="Level" value="5" />
        <Stat label="Gate hành vi" value="5" />
        <Stat label="Huy hiệu" value="5" accent />
      </section>

      {/* Closing CTA */}
      <section className="mt-16 flex flex-col gap-4 rounded-xl border border-border bg-[var(--bg-2)] px-6 py-10 md:flex-row md:items-center md:justify-between md:px-11">
        <div>
          <h2 className="font-[family-name:var(--font-brand)] text-lg font-bold text-[var(--fg-1)]">
            Nội dung được biên soạn và sưu tầm từ nhiều nguồn thông qua AI
          </h2>
          <p className="mt-1 font-[family-name:var(--font-body)] text-[15px] text-[var(--fg-2)]">
            Mỗi buổi sẽ có cả lý thuyết lẫn thực hành cùng quiz để tăng khả năng ghi nhớ.
          </p>
        </div>
        <Link
          href="/learn"
          className="inline-flex min-h-[44px] shrink-0 items-center rounded-full bg-[var(--brand)] px-7 text-sm font-semibold text-white outline-ring/50 transition-colors hover:bg-[var(--brand-light)] focus-visible:ring-[3px]"
        >
          Vào học
        </Link>
      </section>
    </div>
  );
}

interface StatProps {
  label: string;
  value: string;
  /** Gold climax — reserved for ONE stat per page (YODY DS). */
  accent?: boolean;
}

function Stat({ label, value, accent }: StatProps) {
  return (
    <div className="bg-[var(--bg)] px-6 py-8">
      <div
        className={
          accent
            ? "font-[family-name:var(--font-impact)] text-[clamp(36px,4.4vw,56px)] font-extrabold leading-none text-[var(--gold-deep)]"
            : "font-[family-name:var(--font-impact)] text-[clamp(36px,4.4vw,56px)] font-extrabold leading-none text-[var(--brand)]"
        }
      >
        {value}
      </div>
      <div className="mt-3 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fg-3)]">
        {label}
      </div>
    </div>
  );
}