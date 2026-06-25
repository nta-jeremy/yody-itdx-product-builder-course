/**
 * /badges — badge inventory (5 badges, L1–L5) from mock_badges.json.
 *
 * Read-only display. YODY DS:
 *  - L1 mint · L2-L4 iris · L5 gold (badge color_token drives the chip)
 *  - No emoji. Token colors only. Gold reserved for L5 (graduation climax).
 *  - Badge shadcn component (variant=build/plan/live) maps to YODY status
 *    pills — we use the raw token-backed chips here for finer color control
 *    since the badge variant set doesn't include mint-vs-iris distinction.
 */

import type { Metadata } from "next";
import { listBadges, type Badge } from "@/lib/content";

export const metadata: Metadata = {
  title: "Huy hiệu",
  description: "5 huy hiệu của chương trình Intern Product Builder — L1 Aware đến L5 Architect, cấp theo gate hành vi.",
};

const TOKEN_TONE: Record<Badge["color_token"], { chipBg: string; chipText: string; bar: string }> = {
  mint: {
    chipBg: "var(--mint-tint)",
    chipText: "var(--mint-deep)",
    bar: "var(--mint)",
  },
  iris: {
    chipBg: "var(--iris-tint)",
    chipText: "var(--iris-deep)",
    bar: "var(--iris)",
  },
  gold: {
    chipBg: "var(--gold-tint)",
    chipText: "var(--gold-deep)",
    bar: "var(--gold)",
  },
};

export default async function BadgesPage() {
  const badges = await listBadges();

  return (
    <div data-surface="app" className="mx-auto w-full max-w-[var(--container-max)] px-6 py-16 md:px-11">
      <header className="mb-10">
        <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--brand)]">
          Huy hiệu
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-impact)] text-[clamp(32px,3.4vw,44px)] font-extrabold leading-[1.1] text-[var(--fg-1)]">
          5 huy hiệu — cấp theo gate hành vi
        </h1>
        <p className="mt-3 max-w-[640px] font-[family-name:var(--font-body)] text-[16px] leading-[1.6] text-[var(--fg-2)]">
          Huy hiệu cấp khi <strong className="text-[var(--fg-1)]">qua gate hành vi</strong>, không
          phải khi đậu điểm. L1 mint · L2–L4 iris · L5 gold (quý giá nhất — kỷ
          niệm tốt nghiệp).
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {badges.map((b) => {
          const tone = TOKEN_TONE[b.color_token] ?? TOKEN_TONE.iris;
          return (
            <li
              key={b.id}
              className="flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-[var(--bg)]"
            >
              <div className="h-1.5 w-full" style={{ background: tone.bar }} aria-hidden />
              <div className="flex flex-1 flex-col gap-3 px-6 pb-6">
                <div className="flex items-center gap-2 pt-2">
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-wider"
                    style={{ background: tone.chipBg, color: tone.chipText }}
                  >
                    {b.level}
                  </span>
                  {b.is_graduation && (
                    <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-wider text-[var(--gold-deep)]">
                      Tốt nghiệp
                    </span>
                  )}
                </div>
                <h2 className="font-[family-name:var(--font-brand)] text-[20px] font-bold leading-[1.25] text-[var(--fg-1)]">
                  {b.name}
                </h2>
                <p className="font-[family-name:var(--font-body)] text-[14px] leading-[1.55] text-[var(--fg-2)]">
                  {b.awarded_when}
                </p>
                <dl className="mt-auto flex flex-col gap-1 border-t border-border pt-3 font-[family-name:var(--font-mono)] text-[11px] text-[var(--fg-3)]">
                  {b.gate && (
                    <div className="flex gap-2">
                      <dt>Gate</dt>
                      <dd className="text-[var(--fg-2)]">{b.gate}</dd>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <dt>Tham chiếu</dt>
                    <dd className="truncate text-[var(--fg-2)]" title={b.criteria_ref}>
                      {b.criteria_ref}
                    </dd>
                  </div>
                </dl>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}