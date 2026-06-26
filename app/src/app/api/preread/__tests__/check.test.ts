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

describe("POST /api/preread/[code]/check", () => {
  it("returns correct count + explanations when answers correct", async () => {
    vi.spyOn(
      await import("@/lib/content"),
      "getPreRead",
    ).mockResolvedValue({
      code: "I1.1",
      summary: { tldr: "", bullets: [], readingMinutes: 0 },
      video: null,
      questions: [
        {
          question: "Q1",
          options: ["A", "B"],
          correctIndex: 0,
          explanation: "vì A đúng",
        },
        {
          question: "Q2",
          options: ["A", "B"],
          correctIndex: 1,
          explanation: "vì B đúng",
        },
      ],
      totalMinutes: 0,
    });

    const req = new Request("http://test/api/preread/I1.1/check", {
      method: "POST",
      body: JSON.stringify({ answers: [0, 1] }),
    });
    const res = await POST(req, {
      params: Promise.resolve({ code: "I1.1" }),
    });
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
    vi.spyOn(
      await import("@/lib/content"),
      "getPreRead",
    ).mockResolvedValue(null);
    const req = new Request("http://test/api/preread/I1.1/check", {
      method: "POST",
      body: JSON.stringify({ answers: [0] }),
    });
    const res = await POST(req, {
      params: Promise.resolve({ code: "I1.1" }),
    });
    expect(res.status).toBe(404);
  });
});
