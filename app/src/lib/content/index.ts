/**
 * Content layer barrel — the single import surface for routes (Phase 2c).
 *
 * Per plan decision #21, exports exactly 5 typed functions:
 *   - getContent     — generic content resolver (session | root doc | canonical)
 *   - listSessions    — 14 sessions (delegates to sessions.ts)
 *   - listBadges      — badge inventory from `_mock-data/mock_badges.json`
 *   - listLearners    — learners from `_mock-data/mock_learners.json`
 *   - listGateEvidence — gate submissions from `_mock-data/mock_gate_evidence.json`
 *
 * Also exports `listScorecards` (mock scorecards) used by /mock-showcase.
 *
 * Mock data lives in `content/idea/_mock-data/` (Phase 1c owns those files; this
 * lib only READS them). Read at build time — same constraints as sessions.ts.
 *
 * FK contract: every mock record references `sessionCode` (e.g. gate evidence
 * `session_code: "I1.2"`), which is the stable FK into the content layer.
 * Badge `criteria_ref` references `00_Core/progression_ladder.md` anchors.
 *
 * All readers are memoised per-arg within a render pass via React `cache`.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";
import { resolveAppRoot } from "./sessions";
import {
  getSession,
  listSessions,
  type SessionContent,
  isValidSessionCode,
} from "./sessions";
import { getRootDoc, isRootDocName, type RootDocName } from "./root-docs";
import {
  getCanonicalFile,
  getCanonicalJson,
  isCanonicalName,
  type CanonicalName,
} from "./canonical";

// ─── Re-exports for Phase 2c routes ────────────────────────────────────
export type { SessionContent, RootDocName, CanonicalName };
export {
  getSession,
  listSessions,
  isValidSessionCode,
  getRootDoc,
  isRootDocName,
  getCanonicalFile,
  getCanonicalJson,
  isCanonicalName,
};

// ─── Mock data location ─────────────────────────────────────────────────

const MOCK_DIR = join(resolveAppRoot(), "content", "idea", "_mock-data");

/** Read + parse a mock JSON file. Returns null if missing. */
async function readMockJson<T>(file: string): Promise<T | null> {
  try {
    const raw = await readFile(join(MOCK_DIR, file), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// ─── Mock data types (mirror content/idea/_mock-data/*.json shapes) ──────

/** One badge from mock_badges.json. `color_token` ∈ {mint, iris, gold}. */
export type Badge = {
  id: string;
  name: string;
  level: string; // "L1".."L5"
  color_token: "mint" | "iris" | "gold";
  criteria_ref: string; // progression_ladder.md anchor
  gate: string | null;
  awarded_when: string;
  is_graduation?: boolean;
};

export type BadgesFile = {
  meta: { version: string; created: string; note: string; handshake: string; award_rule: string };
  badges: Badge[];
};

/** Gate-status value used per learner. */
export type GateStatus =
  | "passed"
  | "in_review"
  | "not_started"
  | "passed_with_conditions";

export type Learner = {
  id: string;
  display_name: string;
  department: string;
  program: string;
  current_level: string; // "L1".."L5"
  gate_status: Record<string, GateStatus>;
  scorecard_ids: string[];
  gate_evidence_ids: string[];
  /** sessionCode → progress state. FK keys are stable sessionCodes. */
  session_progress: Record<string, "completed" | "in_progress" | "in_review" | "not_started">;
  badges: string[]; // badge ids
  joined_at: string;
};

export type LearnersFile = {
  meta: { version: string; created: string; note: string; program_scope: string; handshake: string };
  learners: Learner[];
};

/** One gate submission (evidence pack). `session_code` is the stable FK. */
export type GateEvidence = {
  id: string;
  learner_id: string;
  gate: string; // "L1_to_L2" etc.
  session_code: string; // stable FK into sessions
  submitted_at: string;
  submission_type: string;
  evidence: {
    deliverable_ref?: string;
    summary?: string;
    quiz_score?: string;
    diligence_statement?: string;
    workflow_summary?: string;
    user_evidence?: string;
    value_measured?: string;
    human_review_layer?: string;
    product_summary?: string;
    architecture_doc_ref?: string;
    risk_doc_ref?: string;
    monitoring_plan?: string;
  };
  reviewer_id: string;
  reviewer_role: string;
  decision: GateStatus;
  reviewed_at: string;
  review_notes: string;
};

export type GateEvidenceFile = {
  meta: { version: string; created: string; note: string; handshake: string };
  gate_submissions: GateEvidence[];
};

/** One scorecard row from mock_scorecards.json. `learner_id` is the FK. */
export type Scorecard = {
  id: string;
  learner_id: string;
  program: string;
  assessor_id: string;
  stage: "entry" | "mid" | "end";
  date: string;
  scores: {
    A_Outcome: { A0: number | null; A1: number | null; A2: number | null; A3: number | null; total: number; max: number };
    B_Can_Do: { B1: number | null; B2: number | null; B3: number | null; B4: number | null; B5: number | null; total: number; max: number };
    C_Will_Do: { C1: number | null; C2: number | null; C3: number | null; total: number; max: number };
    D_Will_FIT: { D1: number | null; D2: number | null; D3: number | null; D4: number | null; D5: number | null; total: number; max: number };
  };
  grand_total: number;
  grand_max: number;
  percent: number;
  decision: string;
  notes: string;
};

export type ScorecardsFile = {
  meta: { version: string; created: string; note: string; score_scale: string; handshake: string };
  scorecards: Scorecard[];
};

// ─── The 5 typed functions (plan decision #21) ──────────────────────────

/**
 * Generic content resolver. Returns a session, root doc, or canonical file
 * based on `kind`. Use this when a single call site handles mixed content
 * (e.g. a search or sitemap). For known kinds, prefer the specific reader.
 *
 * @param kind "session" | "root-doc" | "canonical"
 * @param id  the stable id:
 *            - session: a sessionCode ("I1.1")
 *            - root-doc: "01" | "02" | "03"
 *            - canonical: "competency_dictionary" | "will_fit" | "progression_ladder"
 * @returns string (markdown/json text) for root-doc/canonical, SessionContent
 *          for session, or null if not found.
 */
export const getContent = cache(async (
  kind: "session" | "root-doc" | "canonical",
  id: string,
): Promise<SessionContent | string | null> => {
  switch (kind) {
    case "session": {
      // Validate first; invalid codes are "not found" here (vs `getSession`
      // which throws on invalid input — that's the strict API for routes
      // that already validated params). `getContent` is the lenient API.
      if (!isValidSessionCode(id)) return null;
      return getSession(id);
    }
    case "root-doc":
      return isRootDocName(id) ? getRootDoc(id) : null;
    case "canonical":
      return isCanonicalName(id) ? getCanonicalFile(id) : null;
    default:
      return null;
  }
});

/** List all sessions (14). Delegates to sessions.ts (re-exported above). */
// (Re-exported via the `export { listSessions }` block — no redefinition here.)

/**
 * List all badges from `_mock-data/mock_badges.json`. Returns empty array if
 * the file is missing (build-time resilience — routes still render).
 */
export const listBadges = cache(async (): Promise<Badge[]> => {
  const data = await readMockJson<BadgesFile>("mock_badges.json");
  return data?.badges ?? [];
});

/**
 * List all learners from `_mock-data/mock_learners.json`.
 * Returns empty array if the file is missing.
 */
export const listLearners = cache(async (): Promise<Learner[]> => {
  const data = await readMockJson<LearnersFile>("mock_learners.json");
  return data?.learners ?? [];
});

/**
 * List all gate-evidence submissions from `_mock-data/mock_gate_evidence.json`.
 * Returns empty array if the file is missing.
 */
export const listGateEvidence = cache(async (): Promise<GateEvidence[]> => {
  const data = await readMockJson<GateEvidenceFile>("mock_gate_evidence.json");
  return data?.gate_submissions ?? [];
});

/**
 * List all scorecards from `_mock-data/mock_scorecards.json`.
 * Returns empty array if the file is missing.
 */
export const listScorecards = cache(async (): Promise<Scorecard[]> => {
  const data = await readMockJson<ScorecardsFile>("mock_scorecards.json");
  return data?.scorecards ?? [];
});