import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { PreReadBanner } from "../preread-banner";

describe("PreReadBanner", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("shows CTA when no localStorage key", () => {
    render(<PreReadBanner code="I1.1" totalMinutes={30} />);
    expect(screen.getByText(/Làm pre-read/)).toBeInTheDocument();
  });

  it("hides CTA when localStorage set", () => {
    localStorage.setItem("preReadPassed.I1.1", "true");
    render(<PreReadBanner code="I1.1" totalMinutes={30} />);
    expect(screen.queryByText(/Làm pre-read/)).not.toBeInTheDocument();
    expect(screen.getByText(/đã hoàn thành/)).toBeInTheDocument();
  });
});
