import { describe, it, expect } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import { resolve, join } from "node:path";

const CONTENT_ROOT = resolve(
  process.cwd(),
  "content/idea/Intern-Product-Builder",
);

const HEAVY = [
  { code: "I2.1", subs: ["I2.1.1", "I2.1.2"] },
  { code: "I2.3", subs: ["I2.3.1", "I2.3.2"] },
  { code: "I3.1", subs: ["I3.1.1", "I3.1.2"] },
  { code: "I4.1", subs: ["I4.1.1", "I4.1.2"] },
  { code: "I4.2", subs: ["I4.2.1", "I4.2.2"] },
  { code: "I5.1", subs: ["I5.1.1", "I5.1.2"] },
];

describe("12 sub-session files render correctly", () => {
  for (const { code, subs } of HEAVY) {
    it(`${code} has 2 sub-session files matching expected pattern`, async () => {
      const dir = join(CONTENT_ROOT, `Teaching-Kit-${code}`, "main-content");
      const entries = await readdir(dir);
      const subFiles = entries.filter(
        (e) =>
          (e.startsWith(`${subs[0]}-`) || e.startsWith(`${subs[1]}-`)) &&
          e.endsWith(".md"),
      );
      expect(subFiles).toHaveLength(2);
    });
  }

  it("legacy files được archive (không còn ở root main-content)", async () => {
    for (const { code } of HEAVY) {
      const dir = join(CONTENT_ROOT, `Teaching-Kit-${code}`, "main-content");
      const entries = await readdir(dir);
      const legacyFiles = entries.filter(
        (e) => e.startsWith(`${code}-Tai-Lieu-Hoc-`) && e.endsWith(".md"),
      );
      expect(legacyFiles).toHaveLength(0);
    }
  });

  it("content integrity: tổng dòng file mới ≈ file gốc (trong tolerance)", async () => {
    for (const { code, subs } of HEAVY) {
      const archiveDir = join(
        CONTENT_ROOT,
        `Teaching-Kit-${code}`,
        "main-content",
        "_archive",
      );
      const archiveEntries = await readdir(archiveDir);
      const archiveFile = archiveEntries.find(
        (e) => e.endsWith(".md"),
      );
      if (!archiveFile) continue;
      const originalContent = await readFile(
        join(archiveDir, archiveFile),
        "utf8",
      );
      const originalLines = originalContent.split("\n").length;

      let newLines = 0;
      for (const sub of subs) {
        const dir = join(CONTENT_ROOT, `Teaching-Kit-${code}`, "main-content");
        const entries = await readdir(dir);
        const subFile = entries.find(
          (e) => e.startsWith(`${sub}-`) && e.endsWith(".md"),
        );
        if (!subFile) continue;
        const content = await readFile(join(dir, subFile), "utf8");
        newLines += content.split("\n").length;
      }

      // 15% tolerance accounts for front-matter duplication in new files.
      const diff = Math.abs(newLines - originalLines) / originalLines;
      expect(diff).toBeLessThan(0.15);
    }
  });
});
