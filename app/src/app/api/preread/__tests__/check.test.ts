import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../[code]/check/route";
import { _resetPreReadCaches } from "@/lib/content";

vi.mock("@/lib/content", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/content")>("@/lib/content");
  return actual;
});

beforeEach(() => {
  _resetPreReadCaches();
});

const basePreread = {
  code: "I1.1",
  summary: { tldr: "", bullets: [], readingMinutes: 0 },
  video: null,
  questions: [
    { question: "Q1", options: ["A", "B"], correctIndex: 0, explanation: "vì A đúng" },
    { question: "Q2", options: ["A", "B"], correctIndex: 1, explanation: "vì B đúng" },
  ],
  totalMinutes: 0,
} as const;

function callCheck(body: unknown) {
  const req = new Request("http://test/api/preread/I1.1/check", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return POST(req, { params: Promise.resolve({ code: "I1.1" }) });
}

async function mockPreread(value: typeof basePreread | null) {
  vi.spyOn(await import("@/lib/content"), "getPreRead").mockResolvedValue(
    value as unknown as Awaited<ReturnType<typeof import("@/lib/content").getPreRead>>,
  );
}

describe("POST /api/preread/[code]/check", () => {
  it("returns correct count + explanations when answers correct (unshuffled)", async () => {
    await mockPreread(basePreread);
    const res = await callCheck({ answers: [0, 1] });
    const data = (await res.json()) as { correct: number; explanations: string[] };
    expect(data.correct).toBe(2);
    expect(data.explanations).toHaveLength(2);
    expect(data.explanations[0]).toContain("Đúng");
  });

  it("returns 400 on invalid code", async () => {
    const req = new Request("http://test/api/preread/foo/check", {
      method: "POST",
      body: JSON.stringify({ answers: [0] }),
    });
    const res = await POST(req, {
      params: Promise.resolve({ code: "foo" }),
    });
    expect(res.status).toBe(400);
  });

  it("returns 404 when preread missing", async () => {
    await mockPreread(null);
    const res = await callCheck({ answers: [0, 1] });
    expect(res.status).toBe(404);
  });

  it("grades correctly when client sends shuffled questions + permuted options", async () => {
    await mockPreread(basePreread);
    // Original questions: [Q1(correct=A idx0), Q2(correct=B idx1)].
    // Simulate server shuffled: question order = [1, 0] (Q2 first, Q1 second).
    // For each shuffled question, simulate option reordering such that
    // picking option 0 in the shuffled view picks the original correct one.
    const body = {
      answers: [0, 0],
      questionOrder: [1, 0],
      optionOrders: [
        // shuffled Q2 (orig idx 1, correctIndex=1) → flip options [B, A]
        [1, 0],
        // shuffled Q1 (orig idx 0, correctIndex=0) → keep [A, B]
        [0, 1],
      ],
    };
    const res = await callCheck(body);
    const data = (await res.json()) as { correct: number; explanations: string[] };
    expect(data.correct).toBe(2);
    // Both explanations should be the "Đúng!" form.
    expect(data.explanations.every((e) => e.startsWith("Đúng!"))).toBe(true);
  });

  it("counts wrong picks when option permutation is respected", async () => {
    await mockPreread(basePreread);
    // Same shuffled view, but user picks option 1 in the shuffled view of Q2,
    // which after permutation maps to original option 0 (A) → wrong (correct=B).
    const body = {
      answers: [1, 0],
      questionOrder: [1, 0],
      optionOrders: [
        [1, 0],
        [0, 1],
      ],
    };
    const res = await callCheck(body);
    const data = (await res.json()) as { correct: number; explanations: string[] };
    expect(data.correct).toBe(1);
    // Explanations are aligned with ORIGINAL question order (Q1 then Q2).
    // Q1 was answered correctly (A), Q2 was answered wrongly (picked A, correct B).
    expect(data.explanations[0]).toMatch(/^Đúng!/);
    expect(data.explanations[1]).toMatch(/Đáp án đúng: B/);
  });

  it("falls back to unshuffled grading when questionOrder length mismatches", async () => {
    await mockPreread(basePreread);
    // questionOrder length != preread.questions.length → backward-compat path.
    const body = {
      answers: [0, 1],
      questionOrder: [0],
      optionOrders: [[0, 1]],
    };
    const res = await callCheck(body);
    const data = (await res.json()) as { correct: number };
    expect(data.correct).toBe(2);
  });
});