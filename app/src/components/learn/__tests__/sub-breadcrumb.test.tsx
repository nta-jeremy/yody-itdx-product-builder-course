import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SubBreadcrumb } from "../sub-breadcrumb";

const defaultProps = {
  level: "L4 Integrator",
  levelNum: 4,
  parentCode: "I4.2",
  parentTitle: "Xây Dựng AI Feature",
  subCode: "I4.2.1",
  subTitle: "Kiến trúc 5 lớp",
};

describe("SubBreadcrumb", () => {
  it("renders 4-level path: Học > Level > Parent > Sub", () => {
    render(<SubBreadcrumb {...defaultProps} />);
    expect(screen.getByText("Học")).toBeInTheDocument();
    expect(screen.getByText("L4 Integrator")).toBeInTheDocument();
    expect(screen.getByText(/I4\.2 · Xây Dựng AI Feature/)).toBeInTheDocument();
    expect(screen.getByText(/I4\.2\.1 · Kiến trúc 5 lớp/)).toBeInTheDocument();
  });

  it("links Học → /learn", () => {
    render(<SubBreadcrumb {...defaultProps} />);
    const hocLink = screen.getByText("Học").closest("a");
    expect(hocLink).toHaveAttribute("href", "/learn");
  });

  it("links Level → /learn#L4", () => {
    render(<SubBreadcrumb {...defaultProps} />);
    const levelLink = screen.getByText("L4 Integrator").closest("a");
    expect(levelLink).toHaveAttribute("href", "/learn#L4");
  });
});
