import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fsPromises from "node:fs/promises";
import { POST } from "../../src/app/api/preread/[code]/check/route";
import { _resetPreReadCaches } from "../../src/lib/content/preread";

vi.mock("node:fs/promises");

const CODES = [
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

beforeEach(() => {
  vi.mocked(fsPromises.readdir).mockReset();
  vi.mocked(fsPromises.readFile).mockReset();
  _resetPreReadCaches();
});

/**
 * Adapted from B3.10 plan: instead of fetch POST against a live server
 * (sandbox blocks localhost), call the route handler directly with a
 * synthetic Request — exercises the same code path.
 */
describe("Quiz API 14 codes (direct handler call)", () => {
  for (const code of CODES) {
    it(`${code}/check returns 200 with correct + explanations shape`, async () => {
      vi.mocked(fsPromises.readdir).mockImplementation(async (dir) => {
        const s = String(dir);
        if (s.endsWith("Intern-Product-Builder"))
          return [`Teaching-Kit-${code}`];
        if (s.includes(`Teaching-Kit-${code}/preread`)) {
          return [
            `${code}-preread-summary.md`,
            `${code}-preread-video.md`,
            `${code}-preread-qa.md`,
          ];
        }
        if (s.includes(`Teaching-Kit-${code}/main-content`)) return [];
        return [];
      });
      vi.mocked(fsPromises.readFile).mockImplementation(async (p) => {
        const s = String(p);
        if (s.includes("summary")) return "# TL;DR\nTóm tắt.\n\n# Điểm cốt lõi\n- A\n- B\n- C";
        if (s.includes("video")) return "url: https://youtube.com/embed/placeholder\nduration: 600";
        if (s.includes("qa")) {
          return [
            "> [!question]",
            "> **Câu 1:** Q1?",
            "> - A. x",
            "> - B. y",
            "> **Đáp án: A**",
            "> **Giải thích:** vì A.",
            "",
            "> [!question]",
            "> **Câu 2:** Q2?",
            "> - A. x",
            "> - B. y",
            "> **Đáp án: B**",
            "> **Giải thích:** vì B.",
            "",
            "> [!question]",
            "> **Câu 3:** Q3?",
            "> - A. x",
            "> - B. y",
            "> **Đáp án: A**",
            "> **Giải thích:** vì A.",
            "",
          ].join("\n");
        }
        return "";
      });

      const req = new Request(`http://test/api/preread/${code}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: [0, 1, 0] }),
      });
      const res = await POST(req, {
        params: Promise.resolve({ code }),
      });
      expect(res.status).toBe(200);
      const data = (await res.json()) as {
        correct: number;
        explanations: string[];
        pass: boolean;
      };
      expect(typeof data.correct).toBe("number");
      expect(Array.isArray(data.explanations)).toBe(true);
      // With answers [0,1,0] and corrects [0,1,0]: expect correct=3.
      expect(data.correct).toBe(3);
      expect(data.explanations).toHaveLength(3);
      expect(data.pass).toBe(true);
    });
  }
});
