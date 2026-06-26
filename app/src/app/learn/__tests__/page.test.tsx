import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import * as fsPromises from "node:fs/promises";

vi.mock("node:fs/promises");
vi.mock("next/headers", () => ({
  headers: vi.fn(() => new Map()),
}));
vi.mock("@/lib/content", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/content")>("@/lib/content");
  return {
    ...actual,
    _resetSubCaches: () => undefined,
  };
});

import LearnPage from "@/app/learn/[code]/page";
import { _resetSubCaches } from "@/lib/content";

beforeEach(() => {
  vi.mocked(fsPromises.readdir).mockReset();
  vi.mocked(fsPromises.readFile).mockReset();
  _resetSubCaches();
});

describe("/learn/[code] page — sub-list section", () => {
  it("renders sub-list when subSessions.length > 0", async () => {
    vi.mocked(fsPromises.readdir).mockImplementation(async (dir) => {
      const s = String(dir);
      if (s.endsWith("Intern-Product-Builder")) return ["Teaching-Kit-I4.2"];
      if (s.includes("Teaching-Kit-I4.2/main-content"))
        return ["I4.2.1-Arch.md", "I4.2.2-Vibe.md"];
      return [];
    });
    vi.mocked(fsPromises.readFile).mockResolvedValue(
      "# I4.2 — Xây Dựng AI Feature Có Trách Nhiệm\n\nContent",
    );
    const page = await LearnPage({
      params: Promise.resolve({ code: "I4.2" }),
    });
    const { container } = render(page);
    await waitFor(() => {
      expect(screen.getByText(/Buổi học gồm 2 buổi phụ/)).toBeInTheDocument();
    });
    expect(container.querySelector("a[href='/learn/I4.2/1']")).not.toBeNull();
    expect(container.querySelector("a[href='/learn/I4.2/2']")).not.toBeNull();
  });

  it("hides sub-list when subSessions.length === 0", async () => {
    vi.mocked(fsPromises.readdir).mockImplementation(async (dir) => {
      const s = String(dir);
      if (s.endsWith("Intern-Product-Builder"))
        return ["Teaching-Kit-I1.1"];
      if (s.includes("Teaching-Kit-I1.1/main-content"))
        return ["I1.1-AI-Fundamentals.md"];
      return [];
    });
    vi.mocked(fsPromises.readFile).mockResolvedValue(
      "# I1.1 — AI Fundamentals\n\nContent",
    );
    const page = await LearnPage({
      params: Promise.resolve({ code: "I1.1" }),
    });
    render(page);
    expect(screen.queryByText(/Buổi học gồm/)).not.toBeInTheDocument();
  });
});
