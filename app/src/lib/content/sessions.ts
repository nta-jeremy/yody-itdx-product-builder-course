/**
 * Content reader — sessions + teaching kits.
 *
 * Reads markdown from `docs/idea/Intern-Product-Builder/` (repo-relative).
 * The content directory lives OUTSIDE the Next.js app (`app/`), at the
 * monorepo root (`../docs/idea/`). Reading happens at BUILD TIME only:
 * Next.js 16 Server Components execute during `next build` (SSG), and with
 * `output: 'export'` every route is prerendered — no runtime fs. This lib is
 * therefore safe to use from Server Components / `generateStaticParams`.
 *
 * FK contract: `sessionCode` is the ONLY stable identifier exposed. The
 * underlying file path is never leaked — file renames do not break the DB
 * (Phase 2b stores code, not path).
 *
 * Path traversal guard: `sessionCode` is validated against
 * `^I[1-5]\.[1-3]$` before any filesystem touch. No user input reaches fs.
 *
 * Read-only: this module NEVER writes files.
 *
 * Next.js 16 notes verified against nextjs.org/docs (v16.2.9):
 *  - fs/promises is fine in Server Components (default nodejs runtime).
 *  - cacheComponents is NOT enabled in this app's next.config.ts, so the
 *    "generateStaticParams must return >=1 param" constraint does NOT apply.
 *  - output:'export' is a Phase 2c concern; this lib is build-time only.
 *  - params is a Promise in v15+/16 — Phase 2c routes must `await params`.
 */

import { readdir, readFile } from "node:fs/promises";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { cache } from "react";

// ─── Types ──────────────────────────────────────────────────────────────

/**
 * Stable session content shape. `code` is the FK (e.g. "I1.1").
 * No file paths leak here — rename-safe.
 */
export type SessionContent = {
  /** Stable identifier, e.g. "I1.1". Matches `^I[1-5]\.[1-3]$`. */
  code: string;
  /** Human title from the H1, e.g. "AI Fundamentals (conceptual)". */
  title: string;
  /** Level code, e.g. "L1 Aware". */
  level: string;
  /** Gate role line verbatim from the header blockquote. */
  gateRole: string;
  /** Raw session giáo án markdown. */
  sessionMarkdown: string;
  /** Raw teaching-kit (cẩm nang giảng) markdown. Empty string if no kit. */
  kitMarkdown: string;
  /** Document version, e.g. "1.0". */
  version: string;
  /** Document date, e.g. "21/06/2026". */
  date: string;
};

// ─── Constants ───────────────────────────────────────────────────────────

/**
 * sessionCode whitelist — the ONLY valid values. 5 modules × 3 sessions =
 * 14 sessions (L5 has 3). Regex doubles as path-traversal guard: anything
 * containing path separators, dots beyond the single separator, or non
 * matching characters is rejected before fs is touched.
 */
export const SESSION_CODE_RE = /^I[1-5]\.[1-3]$/;

const REPO_ROOT = resolveRepoRoot();
export const CONTENT_ROOT = join(REPO_ROOT, "docs", "idea", "Intern-Product-Builder");
const SESSIONS_DIR = join(CONTENT_ROOT, "Sessions");

// ─── Repo root resolution ───────────────────────────────────────────────

/**
 * Resolve the monorepo root from this module's location.
 *
 * This file lives at `app/src/lib/content/sessions.ts`, so the repo root is
 * four `dirname` hops up. Computed once at module load — cheap and stable.
 */
export function resolveRepoRoot(): string {
  // app/src/lib/content/sessions.ts → app/src/lib/content → app/src/lib → app/src → app → repo root
  const here = dirname(fileURLToPath(import.meta.url));
  return resolve(here, "..", "..", "..", "..");
}

// ─── Validation ─────────────────────────────────────────────────────────

/**
 * Validate a sessionCode string. Returns true iff `code` matches
 * `^I[1-5]\.[1-3]$`. Use this in route handlers to guard user input.
 */
export function isValidSessionCode(code: string): boolean {
  return SESSION_CODE_RE.test(code);
}

/**
 * Assert `code` is a valid sessionCode. Throws on invalid input — callers
 * passing user input (route params) must validate first or catch + 404.
 * Path traversal is impossible: the regex only matches `I[1-5].[1-3]`.
 */
function assertValidCode(code: string): void {
  if (!SESSION_CODE_RE.test(code)) {
    throw new Error(
      `Invalid sessionCode: "${code}". Must match ^I[1-5]\\.[1-3]$.`,
    );
  }
}

// ─── Header parsing ──────────────────────────────────────────────────────

/**
 * Extract the title from a session H1 like:
 *   `# I1.1 — AI Fundamentals (conceptual)`  →  `AI Fundamentals (conceptual)`
 *
 * Falls back to the raw text after the first space if no em-dash is found.
 */
function parseTitle(h1Line: string, fallbackCode: string): string {
  // Strip leading "# " and the optional "I1.1 — " prefix.
  const withoutHash = h1Line.replace(/^#\s+/, "");
  const emDashIdx = withoutHash.indexOf("\u2014"); // —
  if (emDashIdx !== -1) {
    return withoutHash.slice(emDashIdx + 1).trim();
  }
  // Fallback: take everything after the first space.
  const spaceIdx = withoutHash.indexOf(" ");
  return spaceIdx === -1 ? withoutHash.trim() || fallbackCode : withoutHash.slice(spaceIdx + 1).trim();
}

/**
 * Pull `Level`, `Vai trò gate`, `Phiên bản`, `Ngày` out of the header
 * blockquote lines that every session file starts with. Missing fields
 * default to the empty string — the content is still returned.
 */
function parseHeaderMetadata(
  lines: string[],
): { level: string; gateRole: string; version: string; date: string } {
  let level = "";
  let gateRole = "";
  let version = "";
  let date = "";

  // Headers are in the first ~8 lines, each a `>` blockquote. Scan a small
  // window so we don't iterate the whole file.
  for (const raw of lines.slice(0, 8)) {
    const line = raw.trim();
    if (!line.startsWith(">")) continue;
    const body = line.replace(/^>\s*/, "");

    if (!level) {
      const m = body.match(/\*\*Level:\*\*\s*(.+?)(?:\s*\u00b7|$)/);
      if (m) level = m[1].trim();
    }
    if (!gateRole) {
      const m = body.match(/\*\*Vai tr\u00f2 gate:\*\*\s*(.+?)(?:\s*\u00b7|$)/);
      if (m) gateRole = m[1].trim();
    }
    if (!version) {
      const m = body.match(/\*\*Phi\u00ean b\u1ea3n:\*\*\s*(\S+)/);
      if (m) version = m[1].trim();
    }
    if (!date) {
      const m = body.match(/\*\*Ng\u00e0y:\*\*\s*(\S+)/);
      if (m) date = m[1].trim();
    }
  }

  return { level, gateRole, version, date };
}

// ─── File discovery ─────────────────────────────────────────────────────

/**
 * Find the session markdown file for `code` under `Sessions/`.
 * Matches `${code}-*.md`. Returns absolute path or null if missing.
 *
 * Uses readdir + filter (no glob lib dep). Sorted for determinism.
 */
async function findSessionFile(code: string): Promise<string | null> {
  const prefix = `${code}-`;
  let entries: string[];
  try {
    entries = await readdir(SESSIONS_DIR);
  } catch {
    return null;
  }
  const match = entries
    .filter((e) => e.startsWith(prefix) && e.endsWith(".md"))
    .sort()[0];
  return match ? join(SESSIONS_DIR, match) : null;
}

/**
 * Find the teaching-kit (cẩm nang giảng) markdown for `code`.
 * Matches `Teaching-Kit-${code}/*-Cam-Nang-Giang-*.md`.
 * Returns absolute path or null if missing.
 */
async function findKitFile(code: string): Promise<string | null> {
  const kitDir = join(CONTENT_ROOT, `Teaching-Kit-${code}`);
  const needle = "-Cam-Nang-Giang-";
  let entries: string[];
  try {
    entries = await readdir(kitDir);
  } catch {
    return null;
  }
  const match = entries
    .filter((e) => e.includes(needle) && e.endsWith(".md"))
    .sort()[0];
  return match ? join(kitDir, match) : null;
}

// ─── Public API ─────────────────────────────────────────────────────────

/**
 * Read a session + its teaching kit by stable code.
 *
 * @param code sessionCode, e.g. "I1.1" — must match `^I[1-5]\.[1-3]$`.
 * @returns `SessionContent` or `null` if the session file does not exist.
 * @throws if `code` fails validation (path-traversal guard).
 *
 * Memoised per `code` within a single render pass via React `cache` so that
 * `generateStaticParams`, `generateMetadata`, and the page body sharing the
 * same `code` do not re-read the file.
 */
export const getSession = cache(async (code: string): Promise<SessionContent | null> => {
  assertValidCode(code);

  const sessionPath = await findSessionFile(code);
  if (!sessionPath) return null;

  const sessionMarkdown = await readFile(sessionPath, "utf8");
  const lines = sessionMarkdown.split("\n");

  const h1Line = lines.find((l) => l.startsWith("# ")) ?? `# ${code}`;
  const title = parseTitle(h1Line, code);
  const { level, gateRole, version, date } = parseHeaderMetadata(lines);

  let kitMarkdown = "";
  const kitPath = await findKitFile(code);
  if (kitPath) {
    kitMarkdown = await readFile(kitPath, "utf8");
  }

  return {
    code,
    title,
    level,
    gateRole,
    sessionMarkdown,
    kitMarkdown,
    version,
    date,
  };
});

/**
 * List all sessions (14). Sorted by sessionCode ascending (I1.1 → I5.3).
 * Missing files are skipped — the list reflects what exists on disk.
 *
 * Memoised across the render pass via React `cache`.
 */
export const listSessions = cache(async (): Promise<SessionContent[]> => {
  let entries: string[];
  try {
    entries = await readdir(SESSIONS_DIR);
  } catch {
    return [];
  }

  // Collect candidate codes from filenames `I${m}.${s}-*.md`.
  const codes = new Set<string>();
  for (const entry of entries) {
    if (!entry.endsWith(".md")) continue;
    const m = entry.match(/^(I[1-5]\.[1-3])-/);
    if (m) codes.add(m[1]);
  }

  // Stable order: numeric sort on module/session.
  const sorted = [...codes].sort((a, b) => {
    const [am, as] = a.slice(1).split(".").map(Number);
    const [bm, bs] = b.slice(1).split(".").map(Number);
    return am - bm || as - bs;
  });

  const out: SessionContent[] = [];
  for (const code of sorted) {
    const s = await getSession(code);
    if (s) out.push(s);
  }
  return out;
});