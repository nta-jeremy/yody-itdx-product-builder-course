/**
 * Content reader — Pre-read async (Phase 4, Slice #2).
 *
 * Per Teaching-Kit, the `preread/` folder holds 3 files:
 *   - `${code}-preread-summary.md` — TL;DR + 3-5 bullets
 *   - `${code}-preread-video.md`   — video URL + duration
 *   - `${code}-preread-qa.md`      — 2-3 multiple-choice questions
 *
 * Phase 4 ships the reader + parsers + 1 verification sample (I1.1).
 * Phase 6 applies the template to the remaining 13 kits.
 *
 * Backward compat: if the `preread/` folder (or any of the 3 files) is
 * missing, `getPreRead` returns `null` — same pattern as `getLearnerContent`
 * when `main-content/` is absent. UI in Phase 5 renders a "Chưa có pre-read"
 * fallback.
 *
 * Security: `correctIndex` is parsed from markdown and exposed in the
 * build-time output. Per plan §Security, Phase 5 (quiz UI) keeps the answer
 * hidden behind a "Bắt đầu quiz" interaction — the source markdown is the
 * dev-facing source of truth (annotated for editors, not users).
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { CONTENT_ROOT, isValidSessionCode } from "./sessions";

// ─── Types ──────────────────────────────────────────────────────────────

export type PreReadSummary = {
  /** 3-5 bullet points from `# Điểm cốt lõi`. */
  bullets: string[];
  /** TL;DR paragraph from `# TL;DR`. */
  tldr: string;
  /** Estimated reading time (minutes). */
  readingMinutes: number;
};

export type PreReadVideo = {
  /** Video URL (YouTube embed, Loom, or direct file). */
  url: string;
  /** Video duration in seconds. */
  durationSeconds: number;
  /** Caption/transcript (empty string if not yet recorded). */
  transcript: string;
};

export type PreReadQuestion = {
  /** Question text (without the "Câu N:" prefix). */
  question: string;
  /** 3-4 multiple-choice options (A, B, C, D). */
  options: string[];
  /** Correct option index (0-based). */
  correctIndex: number;
  /** Explanation (empty string if missing). */
  explanation: string;
};

export type PreReadContent = {
  /** sessionCode, e.g. "I1.1". */
  code: string;
  summary: PreReadSummary;
  /** Video embed metadata. Null if URL is a placeholder. */
  video: PreReadVideo | null;
  questions: PreReadQuestion[];
  /** Total pre-read time estimate (reading + video). */
  totalMinutes: number;
};

// ─── Per-call memo (avoids recursive listSubLearnerContent deadlock pattern) ─

const _prereadCache = new Map<string, Promise<PreReadContent | null>>();

/** Test-only: clear memoisation between cases. */
export function _resetPreReadCaches(): void {
  _prereadCache.clear();
}

// ─── File discovery ─────────────────────────────────────────────────────

interface RawPrereadFiles {
  summary: string;
  video: string;
  qa: string;
}

async function findPrereadFiles(code: string): Promise<RawPrereadFiles | null> {
  const dir = join(CONTENT_ROOT, `Teaching-Kit-${code}`, "preread");
  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch {
    return null;
  }
  const summaryFile = entries.find((e) => e === `${code}-preread-summary.md`);
  const videoFile = entries.find((e) => e === `${code}-preread-video.md`);
  const qaFile = entries.find((e) => e === `${code}-preread-qa.md`);
  if (!summaryFile || !videoFile || !qaFile) return null;
  const [summary, video, qa] = await Promise.all([
    readFile(join(dir, summaryFile), "utf8"),
    readFile(join(dir, videoFile), "utf8"),
    readFile(join(dir, qaFile), "utf8"),
  ]);
  return { summary, video, qa };
}

// ─── Parsers ────────────────────────────────────────────────────────────

/** Placeholder URL substring that signals "video not yet recorded". */
const VIDEO_PLACEHOLDER = "placeholder";

/**
 * Parse summary markdown. Expected format:
 *   # TL;DR
 *   <paragraph>
 *   # Điểm cốt lõi
 *   - bullet 1
 *   - bullet 2
 *   ...
 * Tolerates missing sections (returns empty string / empty array).
 */
export function parseSummary(md: string): Omit<PreReadSummary, "readingMinutes"> {
  const lines = md.split("\n");
  let tldr = "";
  const bullets: string[] = [];
  let section: "tldr" | "bullets" | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (/^#\s*TL;?DR/i.test(line)) {
      section = "tldr";
      continue;
    }
    if (/^#\s*Điểm cốt lõi/i.test(line) || /^#\s*Core points/i.test(line)) {
      section = "bullets";
      continue;
    }
    if (/^#\s/.test(line)) {
      section = null;
      continue;
    }
    if (!line) continue;

    if (section === "tldr") {
      tldr += (tldr ? " " : "") + line;
    } else if (section === "bullets") {
      const m = line.match(/^[-*]\s+(.+)/);
      if (m) bullets.push(m[1]!.trim());
    }
  }

  return { tldr: tldr.trim(), bullets };
}

/**
 * Parse video markdown. Expected format (key:value, simple):
 *   url: <video URL>
 *   duration: <seconds>
 *   transcript: |
 *     <text>
 * Returns null if the URL contains "placeholder" (signal: video not yet recorded).
 */
export function parseVideo(md: string): PreReadVideo | null {
  const lines = md.split("\n");
  let url = "";
  let durationSeconds = 0;
  let transcript = "";
  let inTranscript = false;
  const transcriptLines: string[] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (inTranscript) {
      if (line) transcriptLines.push(line);
      continue;
    }
    if (/^transcript\s*:/i.test(line)) {
      inTranscript = true;
      const inline = line.replace(/^transcript\s*:\s*\|?\s*/i, "").trim();
      if (inline) transcriptLines.push(inline);
      continue;
    }
    const urlMatch = line.match(/^url\s*:\s*(.+)/i);
    if (urlMatch) {
      url = urlMatch[1]!.trim();
      continue;
    }
    const durMatch = line.match(/^duration\s*:\s*(\d+)/i);
    if (durMatch) {
      durationSeconds = Number(durMatch[1]);
    }
  }
  transcript = transcriptLines.join(" ").trim();

  if (!url || url.toLowerCase().includes(VIDEO_PLACEHOLDER)) {
    return null;
  }
  return { url, durationSeconds, transcript };
}

/**
 * Parse QA markdown. Expected format (one block per question):
 *   > [!question]
 *   > **Câu 1:** <question text>
 *   > - A. <option>
 *   > - B. <option>
 *   > - C. <option>
 *   > - D. <option>
 *   > **Đáp án: A**
 *   > **Giải thích:** <explanation>
 *
 * Blocks missing `**Đáp án:**` are skipped (malformed).
 */
export function parseQuestions(md: string): PreReadQuestion[] {
  const out: PreReadQuestion[] = [];
  const blocks = md.split(/^> \[!question\]\s*$/m);
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    const lines = trimmed
      .split("\n")
      .map((l) => l.replace(/^>\s?/, "").trim())
      .filter(Boolean);
    let question = "";
    const options: string[] = [];
    let correctIndex = -1;
    let explanation = "";

    for (const raw of lines) {
      // Strip wrapping **...** from the line (common markdown bold around
      // the whole `Câu N:` prefix or the entire question text).
      const line = raw.replace(/^\*\*|\*\*$/g, "").trim();
      const qMatch = line.match(/^Câu\s+\d+\s*:\s*(.+)$/);
      if (qMatch) {
        question = qMatch[1]!.replace(/^\*\*|\*\*$/g, "").trim();
        continue;
      }
      const optMatch = line.match(/^[-*]\s*([A-Da-d])[.)]\s*(.+)$/);
      if (optMatch) {
        options.push(optMatch[2]!.replace(/^\*\*|\*\*$/g, "").trim());
        continue;
      }
      const ansMatch = line.match(/^Đáp án\s*:\s*([A-Da-d])/i);
      if (ansMatch) {
        correctIndex = ansMatch[1]!.toUpperCase().charCodeAt(0) - 65;
        continue;
      }
      const explMatch = line.match(/^Giải thích\s*:\s*(.+)$/i);
      if (explMatch) {
        explanation = explMatch[1]!.trim();
      }
    }

    if (correctIndex === -1 || options.length === 0 || !question) continue;
    if (correctIndex >= options.length) continue;

    out.push({ question, options, correctIndex, explanation });
  }
  return out;
}

// ─── Public API ─────────────────────────────────────────────────────────

/**
 * Read pre-read content by stable session code.
 *
 * @param code sessionCode, e.g. "I1.1" — must match `SESSION_CODE_RE`.
 * @returns `PreReadContent` or `null` if the folder/files are missing.
 * @throws if `code` fails validation (path-traversal guard).
 */
export function getPreRead(code: string): Promise<PreReadContent | null> {
  const cached = _prereadCache.get(code);
  if (cached) return cached;
  const p = _getPreReadImpl(code);
  _prereadCache.set(code, p);
  return p;
}

async function _getPreReadImpl(code: string): Promise<PreReadContent | null> {
  if (!isValidSessionCode(code)) {
    throw new Error(
      `Invalid sessionCode: "${code}". Must match ^I[1-5]\\.[1-3](\\.[1-3])?$.`,
    );
  }
  const files = await findPrereadFiles(code);
  if (!files) return null;

  const summaryRaw = parseSummary(files.summary);
  const video = parseVideo(files.video);
  const questions = parseQuestions(files.qa);

  const summaryWords =
    summaryRaw.tldr.split(/\s+/).filter(Boolean).length +
    summaryRaw.bullets.join(" ").split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(summaryWords / 200));
  const videoMinutes = video ? Math.ceil(video.durationSeconds / 60) : 0;
  const totalMinutes = readingMinutes + videoMinutes;

  return {
    code,
    summary: { ...summaryRaw, readingMinutes },
    video,
    questions,
    totalMinutes,
  };
}

/**
 * List pre-read content across all 14 Teaching-Kit folders. Skips kits
 * without a `preread/` folder (returns `[]` if no kit has pre-read yet —
 * Phase 4 ships only I1.1; Phase 6 applies template to 13 more).
 */
export async function listPreReads(): Promise<PreReadContent[]> {
  const { stat } = await import("node:fs/promises");
  let entries: string[];
  try {
    entries = await readdir(CONTENT_ROOT);
  } catch {
    return [];
  }
  // Sibling files like `Teaching-Kit-INDEX.md` start with the same prefix —
  // stat each entry to keep only directories.
  const dirCodes: string[] = [];
  for (const entry of entries) {
    if (!entry.startsWith("Teaching-Kit-")) continue;
    const code = entry.replace("Teaching-Kit-", "");
    try {
      const s = await stat(join(CONTENT_ROOT, entry));
      if (!s.isDirectory()) continue;
    } catch {
      continue;
    }
    dirCodes.push(code);
  }
  dirCodes.sort((a, b) => {
    const [am, as] = a.slice(1).split(".").map(Number);
    const [bm, bs] = b.slice(1).split(".").map(Number);
    return am - bm || as - bs;
  });

  const out: PreReadContent[] = [];
  for (const code of dirCodes) {
    const pr = await getPreRead(code);
    if (pr) out.push(pr);
  }
  return out;
}
