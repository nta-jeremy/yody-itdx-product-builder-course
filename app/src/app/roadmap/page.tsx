/**
 * /roadmap — 5 level visual (L1→L5) with gate markers.
 *
 * Token colors per plan decision #20:
 *   L1 mint · L2-L4 iris · L5 gold
 *
 * Gates (between levels):
 *   L1 → L2 at I1.2 (Gate L1→L2)
 *   L2 → L3 at I2.3 (Gate L2→L3)
 *   L3 → L4 at I3.3 (Gate L3→L4)
 *   L4 → L5 at I4.3 (Gate L4→L5)
 *   L5 graduation at I5.3 (Gate tốt nghiệp L5)
 *
 * YODY DS: no emoji, token colors only, gold reserved for the L5 climax
 * (decoration via the L5 token bar — never gold body text). Be Vietnam Pro
 * inherits from app surface. Root carries `data-surface="app"`.
 */

import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Lộ trình 5 cấp độ",
  description:
    "Lộ trình Intern Product Builder — 5 cấp độ từ L1 Nhận thức đến L5 Kiến trúc sư, với các gate hành vi chốt giữa mỗi cấp.",
};

/** One level row. */
interface LevelRow {
  level: string;          // "L1"
  name: string;           // "Aware"
  numeral: string;        // "I"
  colorClass: string;     // tailwind class with token var
  desc: string;
  sessions: ReadonlyArray<{ code: string; title: string }>;
  /** Gate that exits this level (null for L5 graduation handled separately). */
  exitGate?: {
    label: string;          // "Gate L1→L2"
    atCode: string;         // "I1.2"
    desc: string;
  };
}

const LEVELS: ReadonlyArray<LevelRow> = [
  {
    level: "L1",
    name: "Aware",
    numeral: "I",
    colorClass: "bg-[var(--mint)]",
    desc: "Nhận thức về AI — hiểu cơ chế hoạt động, giới hạn và hệ quả đối với quyết định sản phẩm.",
    sessions: [
      { code: "I1.1", title: "AI Fundamentals (conceptual)" },
      { code: "I1.2", title: "Giới hạn AI & an toàn dữ liệu" },
    ],
    exitGate: {
      label: "Gate L1→L2",
      atCode: "I1.2",
      desc: "Nộp bài phân tích một tính năng AI kèm bản cam kết thẩm tra, được Trainer duyệt.",
    },
  },
  {
    level: "L2",
    name: "Operator",
    numeral: "II",
    colorClass: "bg-[var(--iris)]",
    desc: "Vận hành AI — prompting nâng cao, sử dụng công cụ AI, đo lường prompt để rút ra insight.",
    sessions: [
      { code: "I2.1", title: "Advanced Prompting" },
      { code: "I2.2", title: "AI Tools trong Product Work" },
      { code: "I2.3", title: "Prompt → Insight → Spec" },
    ],
    exitGate: {
      label: "Gate L2→L3",
      atCode: "I2.3",
      desc: "Bản spec insight đã được đo lường giá trị rõ ràng, được Trainer và Trưởng nhóm duyệt.",
    },
  },
  {
    level: "L3",
    name: "Builder",
    numeral: "III",
    colorClass: "bg-[var(--iris)]",
    desc: "Xây dựng deliverable — thiết kế workflow, dựng sản phẩm, mentor review và lặp lại theo góp ý.",
    sessions: [
      { code: "I3.1", title: "Workflow Design & Cowork" },
      { code: "I3.2", title: "Build Deliverable" },
      { code: "I3.3", title: "Mentor Review & Iterate" },
    ],
    exitGate: {
      label: "Gate L3→L4",
      atCode: "I3.3",
      desc: "Demo workflow kèm bằng chứng từ người dùng thực, được Mentor sản phẩm duyệt.",
    },
  },
  {
    level: "L4",
    name: "Integrator",
    numeral: "IV",
    colorClass: "bg-[var(--iris)]",
    desc: "Tích hợp & vận hành — tư duy sản phẩm, track kỹ thuật, tích hợp sáng kiến vào thực tế và lặp lại.",
    sessions: [
      { code: "I4.1", title: "Product Thinking" },
      { code: "I4.2", title: "Technical Track (Claude Code)" },
      { code: "I4.3", title: "Tích hợp Initiative & Iterate" },
    ],
    exitGate: {
      label: "Gate L4→L5",
      atCode: "I4.3",
      desc: "Sáng kiến tích hợp đã vận hành thật trong sản phẩm và được duyệt.",
    },
  },
  {
    level: "L5",
    name: "Architect",
    numeral: "V",
    colorClass: "bg-[var(--gold)]",
    desc: "Kiến trúc & ra mắt — thiết kế kiến trúc giải pháp AI, chuẩn bị production readiness và guardrails, ra mắt và bảo vệ dự án.",
    sessions: [
      { code: "I5.1", title: "Kiến trúc giải pháp AI" },
      { code: "I5.2", title: "Production Readiness & Guardrails" },
      { code: "I5.3", title: "Ship, bảo vệ dự án" },
    ],
    exitGate: {
      label: "Gate tốt nghiệp L5",
      atCode: "I5.3",
      desc: "Hoàn thành bảo vệ dự án, được Hội đồng Product Builder đánh giá.",
    },
  },
];

export default function RoadmapPage() {
  return (
    <div data-surface="app" className="mx-auto w-full max-w-[var(--container-max)] px-6 py-16 md:px-11">
      <header className="mb-12">
        <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--brand)]">
          Lộ trình
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-impact)] text-[clamp(36px,4vw,52px)] font-extrabold leading-[1.08] text-[var(--fg-1)]">
          Năm cấp độ — từ L1 Nhận thức đến L5 Kiến trúc sư
        </h1>
        <p className="mt-3 max-w-[680px] font-[family-name:var(--font-body)] text-[17px] leading-[1.65] text-[var(--fg-2)]">
          Mỗi cấp độ chốt lại bằng một <strong className="text-[var(--fg-1)]">gate hành vi</strong>:
          bạn vượt qua gate nhờ một deliverable thực tế được duyệt, không dựa trên điểm số.
        </p>
      </header>

      <ol className="flex flex-col gap-4">
        {LEVELS.map((lvl) => (
          <li
            key={lvl.level}
            className="overflow-hidden rounded-xl border border-border bg-[var(--bg)]"
          >
            <div className="flex flex-col gap-6 p-6 md:flex-row md:p-8">
              {/* Level badge block */}
              <div className="flex shrink-0 items-center gap-4 md:w-[200px]">
                <div
                  aria-hidden
                  className={`flex h-[52px] w-[52px] items-center justify-center rounded-full font-[family-name:var(--font-impact)] text-xl font-extrabold text-white ${lvl.colorClass}`}
                >
                  {lvl.numeral}
                </div>
                <div>
                  <div className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fg-3)]">
                    {lvl.level}
                  </div>
                  <div className="font-[family-name:var(--font-brand)] text-lg font-bold text-[var(--fg-1)]">
                    {lvl.name}
                  </div>
                </div>
              </div>

              {/* Description + sessions */}
              <div className="flex-1">
                <p className="font-[family-name:var(--font-body)] text-[15px] leading-[1.6] text-[var(--fg-2)]">
                  {lvl.desc}
                </p>
                <ul className="mt-4 flex flex-col gap-1">
                  {lvl.sessions.map((s) => (
                    <li key={s.code}>
                      <Link
                        href={`/learn/${s.code}` as Route}
                        className="inline-flex min-h-[36px] w-full items-center gap-3 rounded-md px-2 py-1 text-left font-[family-name:var(--font-body)] text-sm text-[var(--fg-2)] outline-ring/50 transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--fg-1)] focus-visible:ring-[3px]"
                      >
                        <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--fg-3)]">
                          {s.code}
                        </span>
                        <span>{s.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Exit gate marker */}
            {lvl.exitGate && (
              <div className="flex items-start gap-3 border-t border-border bg-[var(--bg-2)] px-6 py-4 md:px-8">
                <Badge variant={lvl.level === "L5" ? "plan" : "build"}>
                  {lvl.exitGate.label}
                </Badge>
                <p className="font-[family-name:var(--font-body)] text-[13px] leading-[1.55] text-[var(--fg-2)]">
                  Tại <span className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--fg-1)]">{lvl.exitGate.atCode}</span>{" "}
                  — {lvl.exitGate.desc}
                </p>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}