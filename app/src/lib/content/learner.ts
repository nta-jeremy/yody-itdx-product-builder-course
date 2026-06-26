/**
 * Content reader — learner-facing main-content (Teaching-Kit-I*).
 *
 * Mirror of sessions.ts (build-time SSG, React `cache`, fs/promises) but
 * for the LEARNER view: reads `Teaching-Kit-${code}/main-content/*.md`
 * (14 files). Two functions: `getLearnerContent(code)` + `listLearnerSessions()`.
 *
 * Differences from sessions.ts:
 *  - Tolerant title parser: H1 → strip `I{n}.x — ` prefix; H2 fallback when
 *    H1 is a brand header (I5.3 pattern: `# YODY PRODUCT BUILDER PROGRAM`).
 *    Does NOT enforce blockquote metadata (level is inferred from the code).
 *  - YAGNI: no `version` / `date` fields — the learner UI never renders them.
 *  - Path-traversal guard reuses the PUBLIC `isValidSessionCode` (sessions.ts
 *    exports it); does NOT import the private `assertValidCode`.
 *
 * Read-only. Build-time only. FK contract: `code` is the only stable id.
 *
 * Next.js 16 notes (verified, see phase-01-findings.md):
 *  - `output` is not set (default SSG); `generateStaticParams` prerenders.
 *  - `cache()` from React memoises per-arg within a render pass.
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";
import { CONTENT_ROOT, SESSION_CODE_RE, isValidSessionCode } from "./sessions";

/** Test-only: clear memoisation between cases. Production never calls this. */
export function _resetSubCaches(): void {
  // React `cache()` memoizes within a render pass; tests run separately so
  // there's nothing to clear here. Exists to satisfy the test-only import
  // surface; sub-learner.ts has its own Map that it clears.
}

// ─── Types ──────────────────────────────────────────────────────────────

/**
 * Learner-facing content shape (7 fields — YAGNI: no `version`/`date`).
 * `code` is the FK (e.g. "I1.1"). No file paths leak — rename-safe.
 */
export type LearnerContent = {
  /** Stable identifier, e.g. "I1.1". Matches `^I[1-5]\.[1-3](\.[1-3])?$`. */
  code: string;
  /** Human title from the H1 (stripped of `I{n}.x — ` prefix), or H2 fallback. */
  title: string;
  /** Level label, e.g. "L1 Aware". */
  level: string;
  /** Level number 1..5, inferred from the code (`I{n}.x` → n). */
  levelNum: number;
  /** Raw learner markdown (the single main-content file). */
  markdown: string;
  /** Word count (whitespace split, filter Boolean). */
  wordCount: number;
  /** Reading time estimate, `Math.ceil(wordCount / 200)`, min 1. */
  readingMinutes: number;
  /**
   * Sub-session metadata when the parent kit has been split into multiple
   * `.md` files (Phase 1 stub: empty when only one file exists).
   * Phase 2 enriches title/readingMinutes from the markdown.
   */
  subSessions: SubSessionMeta[];
};

/**
 * Sub-session metadata (Phase 1 stub). Populated when a kit's main-content
 * folder contains multiple `.md` files (e.g. `I4.2.1-*.md`, `I4.2.2-*.md`).
 * UI consumes this in Phase 3 for the sub-session navigation.
 */
export type SubSessionMeta = {
  /** Sub-session code, e.g. "I4.2.1". Matches parent + `.[1-3]`. */
  subCode: string;
  /** Filename slug, e.g. "Kien-Truc-5-Lop". Empty if no `-{slug}` suffix. */
  slug: string;
  /** Human title — Phase 1 stub equals subCode; Phase 2 enriches from H1. */
  title: string;
  /** Reading minutes — Phase 1 stub `0`; Phase 2 enriches from markdown. */
  readingMinutes: number;
  /** Live-session duration: 90' (deep slice) or 75' (gate position). */
  duration: 75 | 90;
};

// ─── Level map ───────────────────────────────────────────────────────────

const LEVEL_MAP: Record<number, string> = {
  1: "L1 Aware",
  2: "L2 Operator",
  3: "L3 Builder",
  4: "L4 Integrator",
  5: "L5 Architect",
};

function levelFromCode(code: string): { level: string; levelNum: number } {
  const m = code.match(/^I([1-5])\./);
  const n = m ? Number(m[1]) : 1;
  return { level: LEVEL_MAP[n] ?? `L${n}`, levelNum: n };
}

// ─── Title parsing (tolerant) ────────────────────────────────────────────

/**
 * Extract the learner title from the first H1, stripping the `I{n}.x — `
 * prefix. Brand-header fallback: if the H1 does NOT contain the session code
 * AND looks like a brand line (I5.3: `# YODY PRODUCT BUILDER PROGRAM`), the
 * title is taken from the first H2 instead.
 */
function parseLearnerTitle(lines: string[], code: string): string {
  const h1 = lines.find((l) => l.startsWith("# "));
  if (h1) {
    const withoutHash = h1.replace(/^#\s+/, "");
    // Brand header fallback (I5.3 pattern): H1 has no code prefix.
    if (!withoutHash.includes(code) && /YODY|PROGRAM/i.test(withoutHash)) {
      const h2 = lines.find((l) => l.startsWith("## "));
      if (h2) {
        const h2Text = h2.replace(/^##\s+/, "");
        // H2 format: "Tài Liệu Học Viên — I5.3: Ship & Bảo Vệ Sản Phẩm AI Cuối Khóa"
        const colonIdx = h2Text.indexOf(":");
        const dashIdx = h2Text.indexOf("\u2014");
        if (colonIdx !== -1 && (dashIdx === -1 || colonIdx > dashIdx)) {
          return h2Text.slice(colonIdx + 1).trim();
        }
        // Strip any "Tài Liệu Học..." prefix and return the remainder.
        const stripped = h2Text.replace(
          /^T[àa]i\s*[Ll]i[ệe]u\s*[Hh]ọc[^—:]*[—:]\s*/,
          "",
        );
        return stripped.trim() || h2Text;
      }
    }
    // Strip the `I{n}.x — ` em-dash prefix.
    const emDashIdx = withoutHash.indexOf("\u2014");
    if (emDashIdx !== -1) return withoutHash.slice(emDashIdx + 1).trim();
    // No em-dash: take everything after the first space.
    const spaceIdx = withoutHash.indexOf(" ");
    return spaceIdx === -1
      ? withoutHash.trim() || code
      : withoutHash.slice(spaceIdx + 1).trim();
  }
  return code;
}

// ─── File discovery ─────────────────────────────────────────────────────

/**
 * Parse a main-content filename like `I4.2.1-Kien-Truc-5-Lop.md` into
 * sub-session metadata. Phase 1 stub: title = subCode, readingMinutes = 0,
 * duration = 90'. Phase 2 enriches title/readingMinutes from the markdown.
 */
function parseSubSessionFromPath(absPath: string): SubSessionMeta {
  const fileName = absPath.split("/").pop() ?? "";
  const stem = fileName.replace(/\.md$/, "");
  const m = stem.match(/^(I[1-5]\.[1-3]\.[1-3])(?:-(.+))?$/);
  const subCode = m?.[1] ?? stem;
  const slug = m?.[2] ?? "";
  return {
    subCode,
    slug,
    title: subCode,
    readingMinutes: 0,
    duration: 90,
  };
}

/**
 * List all main-content `.md` files for `code` under `Teaching-Kit-${code}`,
 * sorted ascending (so `I4.2.1-*.md` precedes `I4.2.2-*.md`). Skips dirs
 * starting with `_` (e.g. `_archive/`, `_draft/`). Returns absolute paths.
 * Returns empty array if the folder is missing.
 */
async function listMainContentFiles(code: string): Promise<string[]> {
  const kitDir = join(CONTENT_ROOT, `Teaching-Kit-${code}`, "main-content");
  let entries: string[];
  try {
    entries = await readdir(kitDir);
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.endsWith(".md"))
    .filter((e) => !e.startsWith("_"))
    .sort()
    .map((e) => join(kitDir, e));
}

// ─── Public API ─────────────────────────────────────────────────────────

/**
 * Read learner content by stable code.
 *
 * @param code sessionCode, e.g. "I1.1" — must match `^I[1-5]\.[1-3](\.[1-3])?$`.
 * @returns `LearnerContent` or `null` if the main-content file is missing.
 * @throws if `code` fails validation (path-traversal guard via `isValidSessionCode`).
 *
 * Memoised per `code` within a single render pass via React `cache` so that
 * `generateStaticParams`, `generateMetadata`, and the page body sharing the
 * same `code` do not re-read the file.
 *
 * Sub-session handling (Phase 1+): if multiple `.md` files exist in the
 * main-content folder, the first (sorted) is treated as primary content,
 * and the rest populate `subSessions` as metadata stubs. Phase 2 enriches.
 */
export const getLearnerContent = cache(
  async (code: string): Promise<LearnerContent | null> => {
    if (!isValidSessionCode(code)) {
      throw new Error(
        `Invalid sessionCode: "${code}". Must match ^I[1-5]\\.[1-3](\\.[1-3])?$.`,
      );
    }
    const files = await listMainContentFiles(code);
    if (files.length === 0) return null;
    const primaryPath = files[0];
    const markdown = await readFile(primaryPath, "utf8");
    const lines = markdown.split("\n");
    const title = parseLearnerTitle(lines, code);
    const { level, levelNum } = levelFromCode(code);
    const wordCount = markdown.split(/\s+/).filter(Boolean).length;
    const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const subSessions = files.length > 1 ? files.map(parseSubSessionFromPath) : [];
    return {
      code,
      title,
      level,
      levelNum,
      markdown,
      wordCount,
      readingMinutes,
      subSessions,
    };
  },
);

/**
 * List all learner sessions (14). Sorted by sessionCode ascending
 * (I1.1 → I5.3) using the same numeric sort pattern as sessions.ts:279-283.
 * Missing files are skipped — the list reflects what exists on disk.
 *
 * Memoised across the render pass via React `cache`.
 */
export const listLearnerSessions = cache(async (): Promise<LearnerContent[]> => {
  let entries: string[];
  try {
    entries = await readdir(CONTENT_ROOT);
  } catch {
    return [];
  }
  const codes = entries
    .filter((e) => e.startsWith("Teaching-Kit-"))
    .map((e) => e.replace("Teaching-Kit-", ""))
    .filter((c) => SESSION_CODE_RE.test(c));
  // Stable numeric order on module/session (same pattern as sessions.ts).
  const sorted = [...codes].sort((a, b) => {
    const [am, as] = a.slice(1).split(".").map(Number);
    const [bm, bs] = b.slice(1).split(".").map(Number);
    return am - bm || as - bs;
  });
  const out: LearnerContent[] = [];
  for (const code of sorted) {
    const c = await getLearnerContent(code);
    if (c) out.push(c);
  }
  return out;
});