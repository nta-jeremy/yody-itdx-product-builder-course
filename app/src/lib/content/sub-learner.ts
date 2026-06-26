/**
 * Content reader — sub-session learner view (Phase 2, Slice #1 continuation).
 *
 * Mirror of `learner.ts` but for the 3-segment sub-session codes
 * (`I4.2.1`, `I4.2.2`, ...). A sub-session is a slice of a parent kit when
 * the main-content folder contains multiple `.md` files. Phase 6 will
 * produce the actual split files; Phase 2 only defines the API + tests.
 *
 * Why a separate file (not in learner.ts): keeps the 14-session list path
 * unchanged for `/learn/[code]` (backward compat) while letting the new
 * sub-session route live at `/learn/[code]/[subCode]`.
 *
 * Two public functions: `getSubLearnerContent(subCode)` +
 * `listSubLearnerContent()`. Build-time only. FK contract: `subCode` is
 * the only stable id (e.g. "I4.2.1"). No file paths leak.
 *
 * Gate duration rule (B1.9): for gate kits (I1.2, I2.3, I3.3, I4.3, I5.3),
 * the LAST sub-session in a parent is `duration: 75'` (shorter summary),
 * all other subs are `90'`.
 *
 * Next.js 16 notes: `cache()` from React memoises per-arg within a render
 * pass — so recursive `listSubLearnerContent` → `getSubLearnerContent`
 * does not loop.
 */

import * as fsPromises from "node:fs/promises";
import { join } from "node:path";
import { CONTENT_ROOT } from "./sessions";

// ─── Constants ──────────────────────────────────────────────────────────

/**
 * Sub-session code whitelist: parent (`I[1-5].[1-3]`) + `.z` (1..3).
 * Stricter than `SESSION_CODE_RE`: requires 3 segments exactly.
 * Doubles as path-traversal guard — only matches valid codes.
 */
export const SUB_SESSION_CODE_RE = /^I[1-5]\.[1-3]\.[1-3]$/;

/** Codes where the LAST sub-session is a 75' gate summary. */
const GATE_CODES = new Set(["I1.2", "I2.3", "I3.3", "I4.3", "I5.3"]);

const LEVEL_MAP: Record<number, string> = {
  1: "L1 Aware",
  2: "L2 Operator",
  3: "L3 Builder",
  4: "L4 Integrator",
  5: "L5 Architect",
};

// ─── Types ──────────────────────────────────────────────────────────────

export type SubLearnerContent = {
  /** Sub-session code, e.g. "I4.2.1". Matches `SUB_SESSION_CODE_RE`. */
  subCode: string;
  /** Parent code (2 segments), e.g. "I4.2". */
  parentCode: string;
  /** Human title — parsed from H1 with `subCode — ` prefix stripped. */
  title: string;
  /** Filename slug, e.g. "Kien-Truc-5-Lop". Empty if no `-{slug}` suffix. */
  slug: string;
  /** Level label inherited from parent, e.g. "L4 Integrator". */
  level: string;
  /** Level number 1..5, inherited from parent. */
  levelNum: number;
  /** Raw learner markdown. */
  markdown: string;
  /** Word count (whitespace split, filter Boolean). */
  wordCount: number;
  /** Reading minutes — `Math.ceil(wordCount / 200)`, min 1. */
  readingMinutes: number;
  /** Live-session duration: 75' (gate last) or 90' (everything else). */
  duration: 75 | 90;
  /** Position within parent (1..3). */
  position: 1 | 2 | 3;
  /** Total sub-sessions in the parent kit (2 or 3). */
  totalInParent: 2 | 3;
  /** Sibling navigation — populated by B1.8. Phase 1 stub: all null. */
  navigation: SubNavigation;
};

export type SubNavigation = {
  prevCode: string | null;
  nextCode: string | null;
  prevKind: "sub" | "parent" | null;
  nextKind: "sub" | "parent" | null;
};

// ─── Validation ─────────────────────────────────────────────────────────

/** Validate a sub-session code. Stricter than `isValidSessionCode`. */
export function isValidSubSessionCode(code: string): boolean {
  return SUB_SESSION_CODE_RE.test(code);
}

// ─── Helpers ────────────────────────────────────────────────────────────

function parseSubTitle(h1Line: string, subCode: string): string {
  const withoutHash = h1Line.replace(/^#\s+/, "");
  const codePrefix = new RegExp(`^${subCode.replace(/\./g, "\\.")}\\s*[—\\-–]\\s*`);
  return withoutHash.replace(codePrefix, "").trim() || subCode;
}

function levelFromCode(code: string): { level: string; levelNum: number } {
  const m = code.match(/^I([1-5])\./);
  const n = m ? Number(m[1]) : 1;
  return { level: LEVEL_MAP[n] ?? `L${n}`, levelNum: n };
}

// ─── Public API ─────────────────────────────────────────────────────────

/**
 * Read sub-session learner content by stable code.
 *
 * @param subCode sub-sessionCode, e.g. "I4.2.1" — must match `SUB_SESSION_CODE_RE`.
 * @returns `SubLearnerContent` or `null` if the file is missing.
 * @throws if `subCode` fails validation (path-traversal guard).
 */
// Per-arg memo within this module. Recursive `listSubLearnerContent` →
// `getSubLearnerContent` would otherwise loop; Map dedupes by subCode.
const _subCache = new Map<string, Promise<SubLearnerContent | null>>();

/** Test-only: clear memoisation between cases. Production never calls this. */
export function _resetSubCaches(): void {
  _subCache.clear();
}

export async function getSubLearnerContent(subCode: string): Promise<SubLearnerContent | null> {
  const cached = _subCache.get(subCode);
  if (cached) return cached;
  const p = _getSubLearnerContentImpl(subCode);
  _subCache.set(subCode, p);
  // After computing, fill in navigation by looking up in the full list.
  const sub = await p;
  if (!sub) return null;
  // Best-effort: navigation = all-subs lookup. If list fails, return stub.
  try {
    const all = await listSubLearnerContent();
    const idx = all.findIndex((s) => s.subCode === subCode);
    if (idx === -1) return sub;
    const prev = idx > 0 ? all[idx - 1] : undefined;
    const next = idx < all.length - 1 ? all[idx + 1] : undefined;
    return {
      ...sub,
      navigation: {
        prevCode: prev?.subCode ?? null,
        nextCode: next?.subCode ?? null,
        prevKind: prev
          ? prev.parentCode === sub.parentCode
            ? "sub"
            : "parent"
          : null,
        nextKind: next
          ? next.parentCode === sub.parentCode
            ? "sub"
            : "parent"
          : null,
      },
    };
  } catch {
    return sub;
  }
}

async function _getSubLearnerContentImpl(subCode: string): Promise<SubLearnerContent | null> {
    if (!isValidSubSessionCode(subCode)) {
      throw new Error(
        `Invalid subSessionCode: "${subCode}". Must match ^I[1-5]\\.[1-3]\\.[1-3]$.`,
      );
    }
    const parentMatch = subCode.match(/^(I[1-5]\.[1-3])\.[1-3]$/);
    if (!parentMatch) return null;
    const parentCode = parentMatch[1]!;
    const kitDir = join(
      CONTENT_ROOT,
      `Teaching-Kit-${parentCode}`,
      "main-content",
    );

    let entries: string[];
    try {
      entries = await fsPromises.readdir(kitDir);
    } catch {
      return null;
    }
    const fileName = entries.find(
      (e) => e.startsWith(`${subCode}-`) && e.endsWith(".md"),
    );
    if (!fileName) return null;
    const markdown = await fsPromises.readFile(join(kitDir, fileName), "utf8");

    const lines = markdown.split("\n");
    const h1Line = lines.find((l) => l.startsWith("# ")) ?? "";
    const title = parseSubTitle(h1Line, subCode);
    const slug = fileName
      .replace(/^I[1-5]\.[1-3]\.[1-3]-/, "")
      .replace(/\.md$/, "");
    const position = Number(
      subCode.match(/\.([1-3])$/)![1],
    ) as 1 | 2 | 3;
    const subFiles = entries.filter((e) =>
      /^I[1-5]\.[1-3]\.[1-3]-.+\.md$/.test(e),
    );
    const totalInParent = (
      subFiles.length >= 3 ? 3 : 2
    ) as 2 | 3;

    const isGate = GATE_CODES.has(parentCode);
    const duration: 75 | 90 =
      isGate && position === totalInParent ? 75 : 90;

    const { level, levelNum } = levelFromCode(parentCode);
    const wordCount = markdown.split(/\s+/).filter(Boolean).length;
    const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

    // Navigation populated by B1.8: handled in `listSubLearnerContent` after
    // all sub-content is enumerated, then merged back into each result.
    // `_getSubLearnerContentImpl` must NOT call `listSubLearnerContent` here
    // — that would deadlock (this promise awaits list, list awaits this).
    const navigation: SubNavigation = {
      prevCode: null,
      nextCode: null,
      prevKind: null,
      nextKind: null,
    };

    return {
      subCode,
      parentCode,
      title,
      slug,
      level,
      levelNum,
      markdown,
      wordCount,
      readingMinutes,
      duration,
      position,
      totalInParent,
      navigation,
    };
}

/**
 * Enumerate all sub-sessions across all 14 kits. Returns empty array when
 * no kit folder contains sub-session files (Phase 6 will produce them).
 *
 * Sort: parent ascending, then subCode ascending within parent
 * (I2.1.1 → I2.1.2 → I2.3.1 → ...).
 */
export async function listSubLearnerContent(): Promise<SubLearnerContent[]> {
    const all = await _listAllSubs();
    // Populate navigation now that the full list is known.
    return all.map((sub) => {
      const idx = all.findIndex((s) => s.subCode === sub.subCode);
      const prev = idx > 0 ? all[idx - 1] : undefined;
      const next = idx < all.length - 1 ? all[idx + 1] : undefined;
      return {
        ...sub,
        navigation: {
          prevCode: prev?.subCode ?? null,
          nextCode: next?.subCode ?? null,
          prevKind: prev
            ? prev.parentCode === sub.parentCode
              ? "sub"
              : "parent"
            : null,
          nextKind: next
            ? next.parentCode === sub.parentCode
              ? "sub"
              : "parent"
            : null,
        },
      };
    });
}

async function _listAllSubs(): Promise<SubLearnerContent[]> {
    let entries: string[];
    try {
      entries = await fsPromises.readdir(CONTENT_ROOT);
    } catch {
      return [];
    }
    const codes = entries
      .filter((e) => e.startsWith("Teaching-Kit-"))
      .map((e) => e.replace("Teaching-Kit-", ""))
      .sort((a, b) => {
        const [am, as] = a.slice(1).split(".").map(Number);
        const [bm, bs] = b.slice(1).split(".").map(Number);
        return am - bm || as - bs;
      });

    const out: SubLearnerContent[] = [];
    for (const code of codes) {
      const kitDir = join(
        CONTENT_ROOT,
        `Teaching-Kit-${code}`,
        "main-content",
      );
      let kitEntries: string[];
      try {
        kitEntries = await fsPromises.readdir(kitDir);
      } catch {
        continue;
      }
      const subFiles = kitEntries
        .filter((e) => /^I[1-5]\.[1-3]\.[1-3]-.+\.md$/.test(e))
        .sort();
      for (const fileName of subFiles) {
        const m = fileName.match(/^(I[1-5]\.[1-3]\.[1-3])-/);
        if (m) {
          // Direct call (no cache, no listSubLearnerContent) to avoid
          // circular dependency between getSubLearnerContent and
          // listSubLearnerContent (both would await each other).
          const sub = await _getSubLearnerContentImpl(m[1]!);
          if (sub) out.push(sub);
        }
      }
    }
    return out;
}
