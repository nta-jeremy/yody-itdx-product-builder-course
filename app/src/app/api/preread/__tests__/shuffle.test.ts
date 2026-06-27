import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../[code]/shuffle/route";
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
    {
      question: "Q1",
      options: ["A", "B", "C", "D"],
      correctIndex: 2,
      explanation: "vì C đúng",
    },
    {
      question: "Q2",
      options: ["X", "Y"],
      correctIndex: 1,
      explanation: "vì Y đúng",
    },
    {
      question: "Q3",
      options: ["P", "Q", "R"],
      correctIndex: 0,
      explanation: "vì P đúng",
    },
  ],
  totalMinutes: 0,
};

function callShuffle(code = "I1.1") {
  return GET({} as never, { params: Promise.resolve({ code }) });
}

async function mockPreread(value: typeof basePreread | null) {
  vi.spyOn(await import("@/lib/content"), "getPreRead").mockResolvedValue(
    value as unknown as Awaited<ReturnType<typeof import("@/lib/content").getPreRead>>,
  );
}

describe("GET /api/preread/[code]/shuffle", () => {
  it("returns questions + questionOrder + optionOrders", async () => {
    await mockPreread(basePreread);
    const res = await callShuffle();
    expect(res.status).toBe(200);
    const data = (await res.json()) as {
      questions: Array<{ question: string; options: string[] }>;
      questionOrder: number[];
      optionOrders: number[][];
    };
    expect(data.questions).toHaveLength(3);
    expect(data.questionOrder).toHaveLength(3);
    expect(data.optionOrders).toHaveLength(3);
  });

  it("questionOrder is a valid permutation of [0..n)", async () => {
    await mockPreread(basePreread);
    const res = await callShuffle();
    const data = (await res.json()) as { questionOrder: number[] };
    const sorted = [...data.questionOrder].sort((a, b) => a - b);
    expect(sorted).toEqual([0, 1, 2]);
  });

  it("each optionOrders[i] is a valid permutation of options length", async () => {
    await mockPreread(basePreread);
    const res = await callShuffle();
    const data = (await res.json()) as {
      optionOrders: number[][];
      questions: Array<{ options: string[] }>;
    };
    data.optionOrders.forEach((order, i) => {
      expect(order).toHaveLength(data.questions[i]!.options.length);
      expect([...order].sort((a, b) => a - b)).toEqual(
        Array.from({ length: data.questions[i]!.options.length }, (_, k) => k),
      );
    });
  });

  it("response KHÔNG chứa correctIndex hoặc explanation", async () => {
    await mockPreread(basePreread);
    const res = await callShuffle();
    const json = await res.text();
    expect(json).not.toMatch(/correctIndex/);
    expect(json).not.toMatch(/explanation/);
  });

  it("options values match original set (no data mutation)", async () => {
    await mockPreread(basePreread);
    const res = await callShuffle();
    const data = (await res.json()) as {
      questionOrder: number[];
      optionOrders: number[][];
      questions: Array<{ options: string[] }>;
    };
    data.questions.forEach((shuffledQ, shuffledIdx) => {
      const origIdx = data.questionOrder[shuffledIdx]!;
      const origQ = basePreread.questions[origIdx]!;
      const optOrder = data.optionOrders[shuffledIdx]!;
      expect([...shuffledQ.options].sort()).toEqual([...origQ.options].sort());
      shuffledQ.options.forEach((opt, optIdx) => {
        expect(opt).toBe(origQ.options[optOrder[optIdx]!]);
      });
    });
  });

  it("returns 400 on invalid code", async () => {
    const res = await callShuffle("foo; rm");
    expect(res.status).toBe(400);
  });

  it("returns 404 when preread missing", async () => {
    await mockPreread(null);
    const res = await callShuffle();
    expect(res.status).toBe(404);
  });

  it("question text matches the original at questionOrder[i]", async () => {
    await mockPreread(basePreread);
    const res = await callShuffle();
    const data = (await res.json()) as {
      questionOrder: number[];
      questions: Array<{ question: string }>;
    };
    data.questions.forEach((q, i) => {
      const origIdx = data.questionOrder[i]!;
      expect(q.question).toBe(basePreread.questions[origIdx]!.question);
    });
  });
});