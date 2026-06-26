import { describe, it, expect } from "vitest";
import { readdir } from "node:fs/promises";
import { resolve, join } from "node:path";

const CONTENT_ROOT = resolve(
  process.cwd(),
  "content/idea/Intern-Product-Builder",
);

const MENTOR_CODES = ["I1.1", "I2.3", "I4.2", "I5.3"];

describe("Mentor view regression — Sessions/ directory untouched", () => {
  it("Sessions/ folder still contains 14 mentor markdown files", async () => {
    const dir = join(CONTENT_ROOT, "Sessions");
    const entries = await readdir(dir);
    const mdFiles = entries.filter((e) => e.endsWith(".md"));
    expect(mdFiles).toHaveLength(14);
  });

  for (const code of MENTOR_CODES) {
    it(`Sessions/I${code.split("I")[1]}-*.md exists for ${code}`, async () => {
      const dir = join(CONTENT_ROOT, "Sessions");
      const entries = await readdir(dir);
      const match = entries.find(
        (e) => e.startsWith(`${code}-`) && e.endsWith(".md"),
      );
      expect(
        match,
        `Mentor session file for ${code} missing in Sessions/`,
      ).toBeDefined();
    });
  }

  it("/sessions/[code] route still uses Sessions/ (not main-content)", async () => {
    // Source check: sessions.ts:SESSIONS_DIR must point to Sessions/.
    const { readFile } = await import("node:fs/promises");
    const source = await readFile(
      resolve(process.cwd(), "src/lib/content/sessions.ts"),
      "utf8",
    );
    expect(source).toContain("SESSIONS_DIR");
    expect(source).toMatch(/SESSIONS_DIR\s*=\s*join\(CONTENT_ROOT,\s*["']Sessions["']\)/);
  });
});
