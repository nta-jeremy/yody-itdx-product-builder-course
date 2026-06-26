import { describe, it, expect } from "vitest";
import { readdir } from "node:fs/promises";
import { resolve, join } from "node:path";

const CONTENT_ROOT = resolve(
  process.cwd(),
  "content/idea/Intern-Product-Builder",
);

describe("6 heavy kits archive convention", () => {
  const codes = ["I2.1", "I2.3", "I3.1", "I4.1", "I4.2", "I5.1"];
  for (const code of codes) {
    it(`${code}/main-content/_archive/ exists with original file`, async () => {
      const archiveDir = join(
        CONTENT_ROOT,
        `Teaching-Kit-${code}`,
        "main-content",
        "_archive",
      );
      const entries = await readdir(archiveDir);
      expect(entries.length).toBeGreaterThanOrEqual(1);
      expect(entries[0]).toMatch(/\.md$/);
    });
  }
});
