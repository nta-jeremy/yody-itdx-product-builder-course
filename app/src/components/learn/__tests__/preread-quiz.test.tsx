import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { PreReadQuiz } from "../preread-quiz";

const questions = [
  { question: "Q1?", options: ["A", "B", "C", "D"] },
  { question: "Q2?", options: ["A", "B", "C", "D"] },
  { question: "Q3?", options: ["A", "B", "C", "D"] },
];

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

  it("transitions intro → answering on button click", () => {
    render(<PreReadQuiz questions={questions} code="I1.1" />);
    fireEvent.click(screen.getByText("Bắt đầu làm quiz"));
    expect(screen.getByText(/Câu 1 \/ 3/)).toBeInTheDocument();
  });

  it("enables 'next' button only when option selected", () => {
    render(<PreReadQuiz questions={questions} code="I1.1" />);
    fireEvent.click(screen.getByText("Bắt đầu làm quiz"));
    const nextBtn = screen.getByText(/Câu tiếp theo|Nộp bài/);
    expect(nextBtn).toBeDisabled();
    fireEvent.click(screen.getByText("A"));
    expect(nextBtn).not.toBeDisabled();
  });

  it("transitions to 'submitting' then 'result' after submit", async () => {
    global.fetch = vi.fn(async () => ({
      json: async () => ({
        correct: 3,
        explanations: ["Đúng!", "Đúng!", "Đúng!"],
      }),
    })) as unknown as typeof fetch;
    render(<PreReadQuiz questions={questions} code="I1.1" />);
    fireEvent.click(screen.getByText("Bắt đầu làm quiz"));
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Câu tiếp theo|Nộp bài/));
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Câu tiếp theo|Nộp bài/));
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Nộp bài/));

    await waitFor(() => {
      expect(screen.getByText(/Bạn đã pass/)).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/preread/I1.1/check",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("shows 'Bắt đầu buổi live' button when pass (≥2/3)", async () => {
    global.fetch = vi.fn(async () => ({
      json: async () => ({
        correct: 3,
        explanations: ["Đúng!", "Đúng!", "Đúng!"],
      }),
    })) as unknown as typeof fetch;
    render(<PreReadQuiz questions={questions} code="I1.1" />);
    fireEvent.click(screen.getByText("Bắt đầu làm quiz"));
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Câu tiếp theo|Nộp bài/));
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Câu tiếp theo|Nộp bài/));
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Nộp bài/));

    await waitFor(() => {
      expect(screen.getByText(/Bắt đầu buổi live/)).toBeInTheDocument();
    });
  });

  it("shows 'Làm lại' button when fail (<2/3)", async () => {
    global.fetch = vi.fn(async () => ({
      json: async () => ({
        correct: 1,
        explanations: ["Sai", "Sai", "Sai"],
      }),
    })) as unknown as typeof fetch;
    render(<PreReadQuiz questions={questions} code="I1.1" />);
    fireEvent.click(screen.getByText("Bắt đầu làm quiz"));
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Câu tiếp theo|Nộp bài/));
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Câu tiếp theo|Nộp bài/));
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Nộp bài/));

    await waitFor(() => {
      expect(screen.getByText(/Chưa đạt/)).toBeInTheDocument();
      expect(screen.getByText("Làm lại")).toBeInTheDocument();
    });
  });
});
