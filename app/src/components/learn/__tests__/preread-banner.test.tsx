import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { PreReadBanner, type PreReadBannerProps } from "../preread-banner";

function renderBanner(props: PreReadBannerProps) {
  return render(<PreReadBanner {...props} />);
}

function seedHistory(code: string, attempts: Array<{ score: number; total: number; at: number }>) {
  localStorage.setItem(`preReadHistory.${code}`, JSON.stringify(attempts));
}

describe("PreReadBanner", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("shows CTA when no localStorage key", () => {
    renderBanner({ code: "I1.1", totalMinutes: 30 });
    expect(screen.getByText(/Làm test/)).toBeInTheDocument();
  });

  it("hides CTA when localStorage set", () => {
    localStorage.setItem("preReadPassed.I1.1", "true");
    renderBanner({ code: "I1.1", totalMinutes: 30 });
    expect(screen.queryByText(/Làm test/)).not.toBeInTheDocument();
    expect(screen.getByText(/đã hoàn thành/)).toBeInTheDocument();
  });

  it("shows 'Làm lại quiz' link when passed", () => {
    localStorage.setItem("preReadPassed.I1.1", "true");
    renderBanner({ code: "I1.1", totalMinutes: 30 });
    const links = screen.getAllByRole("link");
    const retryLink = links.find((l) => l.getAttribute("href") === "/learn/I1.1/preread");
    expect(retryLink).toBeDefined();
    expect(retryLink!.textContent).toMatch(/Làm lại quiz/);
  });

  it("shows attempt summary (highest + last) when multiple attempts exist", () => {
    localStorage.setItem("preReadPassed.I1.1", "true");
    seedHistory("I1.1", [
      { score: 2, total: 3, at: 1_000 },
      { score: 3, total: 3, at: 2_000 },
      { score: 1, total: 3, at: 3_000 },
    ]);
    renderBanner({ code: "I1.1", totalMinutes: 30 });
    expect(screen.getByText(/Điểm cao nhất 3\/3/)).toBeInTheDocument();
    expect(screen.getByText(/Lần cuối 1\/3/)).toBeInTheDocument();
    expect(screen.getByText(/3 lần làm/)).toBeInTheDocument();
  });

  it("shows only highest when exactly one attempt exists (no 'Lần cuối')", () => {
    localStorage.setItem("preReadPassed.I1.1", "true");
    seedHistory("I1.1", [{ score: 3, total: 3, at: 1_000 }]);
    renderBanner({ code: "I1.1", totalMinutes: 30 });
    expect(screen.getByText(/Điểm cao nhất 3\/3/)).toBeInTheDocument();
    expect(screen.queryByText(/Lần cuối/)).not.toBeInTheDocument();
  });

  it("ignores malformed history entries", () => {
    localStorage.setItem("preReadPassed.I1.1", "true");
    localStorage.setItem("preReadHistory.I1.1", JSON.stringify([{ garbage: true }, "string"]));
    renderBanner({ code: "I1.1", totalMinutes: 30 });
    expect(screen.getByText(/đã hoàn thành/)).toBeInTheDocument();
    expect(screen.queryByText(/Điểm cao nhất/)).not.toBeInTheDocument();
  });
});