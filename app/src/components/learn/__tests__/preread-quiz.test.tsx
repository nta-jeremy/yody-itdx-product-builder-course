import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { PreReadQuiz } from "../preread-quiz";

const questions = [
  { question: "Q1?", options: ["A", "B", "C", "D"] },
  { question: "Q2?", options: ["A", "B", "C", "D"] },
  { question: "Q3?", options: ["A", "B", "C", "D"] },
];

const shuffledPayload = {
  questions,
  questionOrder: [0, 1, 2],
  optionOrders: [
    [0, 1, 2, 3],
    [0, 1, 2, 3],
    [0, 1, 2, 3],
  ],
};

function mockFetchShuffleAndCheck(
  checkResponse: { correct: number; explanations: string[] },
) {
  global.fetch = vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input.toString();
    if (url.endsWith("/shuffle")) {
      return {
        ok: true,
        status: 200,
        json: async () => shuffledPayload,
      } as Response;
    }
    return {
      ok: true,
      status: 200,
      json: async () => checkResponse,
    } as Response;
  }) as unknown as typeof fetch;
}

describe("PreReadQuiz state machine", () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    cleanup();
    localStorage.clear();
  });

  it("starts in 'intro' phase showing 'Bắt đầu làm quiz' button", () => {
    render(<PreReadQuiz questions={questions} code="I1.1" />);
    expect(screen.getByText("Bắt đầu làm quiz")).toBeInTheDocument();
  });

  it("transitions intro → loading → answering on button click (after shuffle fetch)", async () => {
    mockFetchShuffleAndCheck({ correct: 0, explanations: [] });
    render(<PreReadQuiz questions={questions} code="I1.1" />);
    fireEvent.click(screen.getByText("Bắt đầu làm quiz"));
    await waitFor(() => {
      expect(screen.getByText(/Câu 1 \/ 3/)).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/preread/I1.1/shuffle",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("shows error and stays on intro when shuffle fetch fails", async () => {
    global.fetch = vi.fn(async () => {
      throw new Error("network");
    }) as unknown as typeof fetch;
    render(<PreReadQuiz questions={questions} code="I1.1" />);
    fireEvent.click(screen.getByText("Bắt đầu làm quiz"));
    await waitFor(() => {
      expect(screen.getByText(/Không tải được câu hỏi/)).toBeInTheDocument();
    });
    expect(screen.getByText("Bắt đầu làm quiz")).toBeInTheDocument();
  });

  it("enables 'next' button only when option selected", async () => {
    mockFetchShuffleAndCheck({ correct: 0, explanations: [] });
    render(<PreReadQuiz questions={questions} code="I1.1" />);
    fireEvent.click(screen.getByText("Bắt đầu làm quiz"));
    await waitFor(() => {
      expect(screen.getByText(/Câu 1 \/ 3/)).toBeInTheDocument();
    });
    const nextBtn = screen.getByText(/Câu tiếp theo|Nộp bài/);
    expect(nextBtn).toBeDisabled();
    fireEvent.click(screen.getByText("A"));
    expect(nextBtn).not.toBeDisabled();
  });

  it("submits with questionOrder + optionOrders, transitions to result", async () => {
    mockFetchShuffleAndCheck({
      correct: 3,
      explanations: ["Đúng!", "Đúng!", "Đúng!"],
    });
    render(<PreReadQuiz questions={questions} code="I1.1" />);
    fireEvent.click(screen.getByText("Bắt đầu làm quiz"));
    await waitFor(() => {
      expect(screen.getByText(/Câu 1 \/ 3/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Câu tiếp theo|Nộp bài/));
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Câu tiếp theo|Nộp bài/));
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Nộp bài/));

    await waitFor(() => {
      expect(screen.getByText(/Bạn đã pass/)).toBeInTheDocument();
    });

    const checkCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.find(
      (call) => (call[0] as string).endsWith("/check"),
    );
    expect(checkCall).toBeDefined();
    const body = JSON.parse(
      (checkCall![1] as RequestInit).body as string,
    ) as {
      answers: number[];
      questionOrder: number[];
      optionOrders: number[][];
    };
    expect(body.answers).toEqual([0, 0, 0]);
    expect(body.questionOrder).toEqual([0, 1, 2]);
    expect(body.optionOrders).toEqual([
      [0, 1, 2, 3],
      [0, 1, 2, 3],
      [0, 1, 2, 3],
    ]);
  });

  it("shows 'Bắt đầu buổi live' + 'Làm lại quiz' buttons when pass", async () => {
    mockFetchShuffleAndCheck({
      correct: 3,
      explanations: ["Đúng!", "Đúng!", "Đúng!"],
    });
    render(<PreReadQuiz questions={questions} code="I1.1" />);
    fireEvent.click(screen.getByText("Bắt đầu làm quiz"));
    await waitFor(() => {
      expect(screen.getByText(/Câu 1 \/ 3/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Câu tiếp theo|Nộp bài/));
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Câu tiếp theo|Nộp bài/));
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Nộp bài/));

    await waitFor(() => {
      expect(screen.getByText(/Bạn đã pass/)).toBeInTheDocument();
    });
    expect(screen.getByText(/Bắt đầu buổi live/)).toBeInTheDocument();
    expect(screen.getAllByText(/Làm lại/).length).toBeGreaterThan(0);
  });

  it("appends attempt to preReadHistory.${code} after submit", async () => {
    mockFetchShuffleAndCheck({
      correct: 3,
      explanations: ["Đúng!", "Đúng!", "Đúng!"],
    });
    render(<PreReadQuiz questions={questions} code="I1.1" />);
    fireEvent.click(screen.getByText("Bắt đầu làm quiz"));
    await waitFor(() => {
      expect(screen.getByText(/Câu 1 \/ 3/)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Câu tiếp theo|Nộp bài/));
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Câu tiếp theo|Nộp bài/));
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Nộp bài/));

    await waitFor(() => {
      expect(screen.getByText(/Bạn đã pass/)).toBeInTheDocument();
    });
    const raw = localStorage.getItem("preReadHistory.I1.1");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!) as Array<{
      score: number;
      total: number;
      at: number;
    }>;
    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toMatchObject({ score: 3, total: 3 });
    expect(typeof parsed[0]!.at).toBe("number");
  });

  it("retry button (after fail) re-fetches shuffle and restarts", async () => {
    const fetchSpy = vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.endsWith("/shuffle")) {
        return {
          ok: true,
          status: 200,
          json: async () => shuffledPayload,
        } as Response;
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          correct: 1,
          explanations: ["Sai", "Sai", "Sai"],
        }),
      } as Response;
    });
    global.fetch = fetchSpy as unknown as typeof fetch;

    render(<PreReadQuiz questions={questions} code="I1.1" />);
    fireEvent.click(screen.getByText("Bắt đầu làm quiz"));
    await waitFor(() => {
      expect(screen.getByText(/Câu 1 \/ 3/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Câu tiếp theo|Nộp bài/));
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Câu tiếp theo|Nộp bài/));
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Nộp bài/));

    await waitFor(() => {
      expect(screen.getByText(/Chưa đạt/)).toBeInTheDocument();
    });

    const shuffleCallsBefore = fetchSpy.mock.calls.filter((c) =>
      (c[0] as string).endsWith("/shuffle"),
    ).length;

    const retryBtn = screen.getByText("Làm lại");
    fireEvent.click(retryBtn);

    await waitFor(() => {
      const shuffleCallsAfter = fetchSpy.mock.calls.filter((c) =>
        (c[0] as string).endsWith("/shuffle"),
      ).length;
      expect(shuffleCallsAfter).toBe(shuffleCallsBefore + 1);
    });
  });
});