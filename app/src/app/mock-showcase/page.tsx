/**
 * /mock-showcase — read-only display of mock learners, scorecards + gate evidence.
 *
 * All data is mock (no PII), read at build time, render-only.
 *
 * YODY DS: no emoji, token colors only, Badge variants for gate status
 * (live = passed, build = in review, plan = passed with conditions,
 * outline = not started), Be Vietnam Pro inherits, root `data-surface="app"`.
 */

import type { Metadata } from "next";
import {
  listLearners,
  listGateEvidence,
  listBadges,
  listScorecards,
  type Learner,
  type GateEvidence,
  type GateStatus,
  type Badge,
  type Scorecard,
} from "@/lib/content";
import { Badge as BadgeChip } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Showcase mock",
  description: "Dữ liệu giả minh hoạ — học viên, gate evidence và huy hiệu. Không có dữ liệu thật (no PII).",
};

const GATE_DECISION_VARIANT: Record<GateStatus, "live" | "build" | "plan" | "outline"> = {
  passed: "live",
  passed_with_conditions: "plan",
  in_review: "build",
  not_started: "outline",
};

const GATE_DECISION_LABEL: Record<GateStatus, string> = {
  passed: "Passed",
  passed_with_conditions: "Passed w/ conditions",
  in_review: "In review",
  not_started: "Not started",
};

const BADGE_TONE: Record<Badge["color_token"], { dot: string }> = {
  mint: { dot: "bg-[var(--mint)]" },
  iris: { dot: "bg-[var(--iris)]" },
  gold: { dot: "bg-[var(--gold)]" },
};

function formatDate(iso: string): string {
  if (!iso) return iso;
  // YYYY-MM-DD → DD/MM/YYYY for VI display.
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

export default async function MockShowcasePage() {
  const [learners, evidence, badges, scorecards] = await Promise.all([
    listLearners(),
    listGateEvidence(),
    listBadges(),
    listScorecards(),
  ]);

  const badgeById = new Map(badges.map((b) => [b.id, b] as const));
  const scorecardById = new Map(scorecards.map((s) => [s.id, s] as const));

  return (
    <div data-surface="app" className="mx-auto w-full max-w-[var(--container-max)] px-6 py-16 md:px-11">
      <header className="mb-10">
        <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--brand)]">
          Showcase mock
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-impact)] text-[clamp(32px,3.4vw,44px)] font-extrabold leading-[1.1] text-[var(--fg-1)]">
          Dữ liệu giả — học viên + gate evidence
        </h1>
        <p className="mt-3 max-w-[680px] font-[family-name:var(--font-body)] text-[16px] leading-[1.6] text-[var(--fg-2)]">
          Toàn bộ dữ liệu dưới đây là <strong className="text-[var(--fg-1)]">mock</strong> — không có dữ
          liệu thật, không PII. Mục đích: minh hoạ cách hệ thống hiển thị hồ sơ
          học viên, gate submissions và huy hiệu đã cấp.
        </p>
      </header>

      {/* Learners */}
      <section aria-labelledby="learners-heading" className="mb-12">
        <h2
          id="learners-heading"
          className="mb-4 font-[family-name:var(--font-brand)] text-xl font-bold text-[var(--fg-1)]"
        >
          Học viên ({learners.length})
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {learners.map((l) => (
            <LearnerCard
              key={l.id}
              learner={l}
              badges={l.badges
                .map((id) => badgeById.get(id))
                .filter((b): b is Badge => Boolean(b))}
              scorecards={l.scorecard_ids
                .map((id) => scorecardById.get(id))
                .filter((s): s is Scorecard => Boolean(s))}
            />
          ))}
        </div>
      </section>

      {/* Gate evidence */}
      <section aria-labelledby="gate-heading">
        <h2
          id="gate-heading"
          className="mb-4 font-[family-name:var(--font-brand)] text-xl font-bold text-[var(--fg-1)]"
        >
          Gate evidence ({evidence.length})
        </h2>
        <ul className="flex flex-col gap-4">
          {evidence.map((g) => (
            <li key={g.id} className="rounded-xl border border-border bg-[var(--bg)] p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-[family-name:var(--font-mono)] text-[12px] font-semibold text-[var(--brand)]">
                  {g.gate}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--fg-3)]">
                  · buổi {g.session_code}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--fg-3)]">
                  · {g.submission_type}
                </span>
                <BadgeChip variant={GATE_DECISION_VARIANT[g.decision]}>
                  {GATE_DECISION_LABEL[g.decision]}
                </BadgeChip>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 font-[family-name:var(--font-body)] text-[14px] leading-[1.55] text-[var(--fg-2)] md:grid-cols-2">
                <Field label="Học viên">{g.learner_id}</Field>
                <Field label="Nộp ngày">{formatDate(g.submitted_at)}</Field>
                <Field label="Reviewer">
                  {g.reviewer_id} · <span className="text-[var(--fg-3)]">{g.reviewer_role}</span>
                </Field>
                <Field label="Duyệt ngày">{formatDate(g.reviewed_at)}</Field>
              </div>

              <GateEvidenceBody ev={g.evidence} />

              {g.review_notes && (
                <div className="mt-3 border-t border-border pt-3 font-[family-name:var(--font-body)] text-[14px] italic text-[var(--fg-2)]">
                  “{g.review_notes}”
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

interface LearnerCardProps {
  learner: Learner;
  badges: Badge[];
  scorecards: Scorecard[];
}

function LearnerCard({ learner, badges, scorecards }: LearnerCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-border bg-[var(--bg)] p-6">
      <header>
        <div className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--fg-3)]">
          {learner.id}
        </div>
        <h3 className="mt-1 font-[family-name:var(--font-brand)] text-lg font-bold text-[var(--fg-1)]">
          {learner.display_name}
        </h3>
        <div className="mt-1 font-[family-name:var(--font-body)] text-[13px] text-[var(--fg-3)]">
          {learner.department} · vào {formatDate(learner.joined_at)}
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <BadgeChip variant="build">{learner.current_level}</BadgeChip>
        {learner.badges.length > 0 ? (
          <ul className="flex flex-wrap items-center gap-1.5">
            {badges.map((b) => {
              const tone = BADGE_TONE[b.color_token] ?? BADGE_TONE.iris;
              return (
                <li key={b.id} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${tone.dot}`} aria-hidden />
                  <span className="font-[family-name:var(--font-mono)] text-[11px] font-semibold text-[var(--fg-2)]">
                    {b.level}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--fg-3)]">
            chưa có huy hiệu
          </span>
        )}
      </div>

      <div>
        <h4 className="mb-1 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fg-3)]">
          Trạng thái gate
        </h4>
        <ul className="flex flex-col gap-1">
          {(Object.entries(learner.gate_status) as Array<[string, GateStatus]>).map(([gate, st]) => (
            <li key={gate} className="flex items-center gap-2 font-[family-name:var(--font-body)] text-[13px]">
              <span className="w-[110px] text-[var(--fg-3)]">{gate}</span>
              <BadgeChip variant={GATE_DECISION_VARIANT[st]}>{GATE_DECISION_LABEL[st]}</BadgeChip>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-border pt-3">
        <h4 className="mb-2 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fg-3)]">
          Scorecards ({scorecards.length})
        </h4>
        {scorecards.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {scorecards.map((sc) => (
              <li key={sc.id} className="rounded-lg border border-border bg-[var(--bg-2)] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-[family-name:var(--font-mono)] text-[11px] font-semibold text-[var(--brand)]">
                    {sc.stage}
                  </span>
                  <BadgeChip variant={sc.percent >= 80 ? "live" : sc.percent >= 60 ? "build" : "outline"}>
                    {sc.percent}%
                  </BadgeChip>
                  <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--fg-3)]">
                    · {formatDate(sc.date)}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 font-[family-name:var(--font-body)] text-[12px] text-[var(--fg-2)] sm:grid-cols-4">
                  {(["A_Outcome", "B_Can_Do", "C_Will_Do", "D_Will_FIT"] as const).map((k) => (
                    <div key={k}>
                      <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.1em] text-[var(--fg-3)]">
                        {k.replace("_", " ")}
                      </span>
                      <div className="font-semibold text-[var(--fg-1)]">
                        {sc.scores[k].total}/{sc.scores[k].max}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 font-[family-name:var(--font-body)] text-[12px] italic text-[var(--fg-2)]">
                  {sc.notes}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <span className="font-[family-name:var(--font-body)] text-[13px] text-[var(--fg-3)]">
            Chưa có scorecard.
          </span>
        )}
      </div>
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fg-3)]">
        {label}
      </span>
      <div className="text-[var(--fg-1)]">{children}</div>
    </div>
  );
}

const EVIDENCE_FIELD_LABEL: Record<string, string> = {
  deliverable_ref: "Deliverable",
  summary: "Tóm tắt",
  quiz_score: "Quiz score",
  diligence_statement: "Diligence statement",
  workflow_summary: "Workflow summary",
  user_evidence: "Bằng chứng người dùng",
  value_measured: "Giá trị đo được",
  human_review_layer: "Human review layer",
  product_summary: "Tóm tắt sản phẩm",
  architecture_doc_ref: "Architecture doc",
  risk_doc_ref: "Risk doc",
  monitoring_plan: "Monitoring plan",
};

function GateEvidenceBody({ ev }: { ev: GateEvidence["evidence"] }) {
  const entries = Object.entries(ev).filter(([, v]) => v != null && v !== "") as Array<[string, string]>;
  if (entries.length === 0) return null;
  return (
    <dl className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
      {entries.map(([key, val]) => (
        <div key={key}>
          <dt className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fg-3)]">
            {EVIDENCE_FIELD_LABEL[key] ?? key}
          </dt>
          <dd className="font-[family-name:var(--font-body)] text-[14px] leading-[1.55] text-[var(--fg-2)]">
            {val}
          </dd>
        </div>
      ))}
    </dl>
  );
}