/**
 * Reader for the 3 root program docs under `content/idea/`:
 *   "01" → 01_Tong-Quan-Chuong-Trinh.md
 *   "02" → 02_Khung-Nang-Luc-Danh-Gia.md
 *   "03" → 03_Giao-An-Trien-Khai.md
 *
 * Build-time only (see sessions.ts header for Next.js 16 notes). Read-only.
 * Path-traversal guard: `name` is validated against a 3-value whitelist.
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";
import { resolveAppRoot } from "./sessions";

const ROOT_DOCS_DIR = join(resolveAppRoot(), "content", "idea");

/**
 * Whitelisted root-doc short names. The `01`/`02`/`03` prefix is the stable
 * key — full filenames can be renamed (e.g. transliteration) without breaking
 * consumers, as long as the numeric prefix stays.
 */
export type RootDocName = "01" | "02" | "03";

const ALLOWED = new Set<RootDocName>(["01", "02", "03"]);

/**
 * Read one of the three root docs by short name.
 *
 * @param name one of "01" | "02" | "03".
 * @returns raw markdown, or "" if the file is missing.
 * @throws if `name` is not one of the three allowed values.
 *
 * Memoised per `name` within a render pass via React `cache`.
 */
export const getRootDoc = cache(async (name: RootDocName): Promise<string> => {
  if (!ALLOWED.has(name)) {
    throw new Error(`Invalid root doc name: "${name}". Must be "01" | "02" | "03".`);
  }
  const prefix = `${name}_`;
  let entries: string[];
  try {
    entries = await readdir(ROOT_DOCS_DIR);
  } catch {
    return "";
  }
  const match = entries
    .filter((e) => e.startsWith(prefix) && e.endsWith(".md"))
    .sort()[0];
  if (!match) return "";
  return readFile(join(ROOT_DOCS_DIR, match), "utf8");
});

/**
 * Type-guard for `RootDocName`. Useful in route handlers.
 */
export function isRootDocName(name: string): name is RootDocName {
  return name === "01" || name === "02" || name === "03";
}