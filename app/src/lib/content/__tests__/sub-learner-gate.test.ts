import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fsPromises from "node:fs/promises";
import { getSubLearnerContent, _resetSubCaches } from "../sub-learner";

vi.mock("node:fs/promises");

beforeEach(() => {
  _resetSubCaches();
});

describe("Gate sub-session duration logic", () => {
  function setupGateKit(code: string, totalInParent: 2 | 3) {
    vi.mocked(fsPromises.readdir).mockReset();
    vi.mocked(fsPromises.readFile).mockReset();
    const files: string[] = [];
    for (let i = 1; i <= totalInParent; i++) {
      files.push(`${code}.${i}-Sub.md`);
    }
    vi.mocked(fsPromises.readdir).mockImplementation(async (dir) => {
      const s = String(dir);
      if (s.endsWith("Intern-Product-Builder"))
        return [`Teaching-Kit-${code}`];
      if (s.includes(`Teaching-Kit-${code}/main-content`)) return files;
      return [];
    });
    vi.mocked(fsPromises.readFile).mockImplementation(async () => "# Sub\nContent");
  }

  const gateCases: Array<{ code: string; expectDuration: 75 | 90 }> = [
    { code: "I1.2.1", expectDuration: 90 },
    { code: "I1.2.2", expectDuration: 75 },
    { code: "I2.3.1", expectDuration: 90 },
    { code: "I2.3.2", expectDuration: 75 },
    { code: "I3.3.1", expectDuration: 90 },
    { code: "I3.3.2", expectDuration: 75 },
    { code: "I4.3.1", expectDuration: 90 },
    { code: "I4.3.2", expectDuration: 75 },
    { code: "I5.3.1", expectDuration: 90 },
    { code: "I5.3.2", expectDuration: 75 },
    { code: "I2.1.1", expectDuration: 90 },
    { code: "I2.1.2", expectDuration: 90 },
    { code: "I4.2.1", expectDuration: 90 },
    { code: "I4.2.2", expectDuration: 90 },
  ];

  for (const { code, expectDuration } of gateCases) {
    it(`${code} → duration = ${expectDuration}`, async () => {
      const parentCode = code.split(".").slice(0, 2).join(".");
      setupGateKit(parentCode, 2);
      const sub = await getSubLearnerContent(code);
      if (!sub) throw new Error(`${code}: sub is null`);
      expect(sub.duration).toBe(expectDuration);
    });
  }
});
