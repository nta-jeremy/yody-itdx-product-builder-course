import { describe, it, expect } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import { resolve, join } from "node:path";

const CONTENT_ROOT = resolve(
  process.cwd(),
  "content/idea/Intern-Product-Builder",
);

describe("14 Cam-Nang cross-ref pre-read", () => {
  const codes = [
    "I1.1",
    "I1.2",
    "I2.1",
    "I2.2",
    "I2.3",
    "I3.1",
    "I3.2",
    "I3.3",
    "I4.1",
    "I4.2",
    "I4.3",
    "I5.1",
    "I5.2",
    "I5.3",
  ];

  for (const code of codes) {
    it(`${code}-Cam-Nang-Giang-*.md references /learn/${code}/preread`, async () => {
      const dir = join(CONTENT_ROOT, `Teaching-Kit-${code}`);
      const entries = await readdir(dir);
      const camNang = entries.find(
        (e) => e.includes("Cam-Nang-Giang") && e.endsWith(".md"),
      );
      expect(camNang).toBeDefined();
      const content = await readFile(join(dir, camNang!), "utf8");
      expect(content).toContain(`/learn/${code}/preread`);
    });
  }
});

describe("6 heavy Cam-Nang have sub-session structure + agenda", () => {
  const heavy = ["I2.1", "I2.3", "I3.1", "I4.1", "I4.2", "I5.1"];
  for (const code of heavy) {
    it(`${code}-Cam-Nang has sub-session structure block`, async () => {
      const dir = join(CONTENT_ROOT, `Teaching-Kit-${code}`);
      const entries = await readdir(dir);
      const camNang = entries.find(
        (e) => e.includes("Cam-Nang-Giang") && e.endsWith(".md"),
      );
      expect(camNang).toBeDefined();
      const content = await readFile(join(dir, camNang!), "utf8");
      expect(content).toMatch(/Cấu trúc buổi học/i);
      expect(content).toContain(`${code}.1`);
      expect(content).toContain(`${code}.2`);
    });
  }
});

describe("Teaching-Kit-INDEX.md has new columns + section", () => {
  it("INDEX.md có cột 'Pre-read' trong table", async () => {
    const path = join(CONTENT_ROOT, "Teaching-Kit-INDEX.md");
    const content = await readFile(path, "utf8");
    expect(content).toMatch(/\|.*Pre-read.*\|/);
  });

  it("INDEX.md có cột 'Buổi phụ' trong table", async () => {
    const path = join(CONTENT_ROOT, "Teaching-Kit-INDEX.md");
    const content = await readFile(path, "utf8");
    expect(content).toMatch(/\|.*Buổi phụ.*\|/);
  });

  it("INDEX.md có section 'Cấu trúc buổi học (update 26/06/2026)'", async () => {
    const path = join(CONTENT_ROOT, "Teaching-Kit-INDEX.md");
    const content = await readFile(path, "utf8");
    expect(content).toContain("Cấu trúc buổi học (update 26/06/2026)");
  });
});
