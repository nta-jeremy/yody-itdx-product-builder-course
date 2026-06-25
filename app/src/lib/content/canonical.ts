/**
 * Reader for canonical reference files under `content/idea/00_Core/`:
 *   "competency_dictionary" → competency_dictionary.json
 *   "will_fit"              → will_fit.json
 *   "progression_ladder"    → progression_ladder.md
 *
 * Build-time only (see sessions.ts header for Next.js 16 notes). Read-only.
 * Path-traversal guard: `name` is validated against a whitelist.
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";
import { resolveAppRoot } from "./sessions";

const CORE_DIR = join(resolveAppRoot(), "content", "idea", "00_Core");

/**
 * Whitelisted canonical file stems (no extension). When the DB (Phase 2b)
 * references a canonical, it uses these stable names — not the on-disk
 * filename, so a `.json` → `.yaml` migration would not break anything.
 */
export type CanonicalName =
  | "competency_dictionary"
  | "will_fit"
  | "progression_ladder";

const ALLOWED = new Set<CanonicalName>([
  "competency_dictionary",
  "will_fit",
  "progression_ladder",
]);

/**
 * Read a canonical file by stem. The extension is resolved on disk
 * (`.json` for the two dictionaries, `.md` for the ladder).
 *
 * @param name the canonical file stem (no extension).
 * @returns raw file contents, or "" if not found.
 * @throws if `name` is not in the allowed whitelist (path-traversal guard).
 *
 * Memoised per `name` within a render pass via React `cache`.
 */
export const getCanonicalFile = cache(async (name: CanonicalName): Promise<string> => {
  if (!ALLOWED.has(name)) {
    throw new Error(
      `Invalid canonical file name: "${name}". Allowed: ${[...ALLOWED].join(", ")}.`,
    );
  }
  let entries: string[];
  try {
    entries = await readdir(CORE_DIR);
  } catch {
    return "";
  }
  // Match the stem, any extension. Sorted for determinism.
  const match = entries
    .filter((e) => e.startsWith(`${name}.`))
    .sort()[0];
  if (!match) return "";
  return readFile(join(CORE_DIR, match), "utf8");
});

/**
 * Type-guard for `CanonicalName`. Useful in route handlers.
 */
export function isCanonicalName(name: string): name is CanonicalName {
  return ALLOWED.has(name as CanonicalName);
}

/**
 * Read a canonical file and parse it as JSON. Throws if the file exists but
 * is not valid JSON. Returns `null` if the file is missing.
 *
 * Use for `competency_dictionary` and `will_fit` (both `.json`). For
 * `progression_ladder` (`.md`), use `getCanonicalFile` and keep the raw text.
 */
export const getCanonicalJson = cache(
  async <T = unknown>(name: CanonicalName): Promise<T | null> => {
    if (name === "progression_ladder") {
      throw new Error(
        "progression_ladder is markdown, not JSON. Use getCanonicalFile() instead.",
      );
    }
    const raw = await getCanonicalFile(name);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  },
);