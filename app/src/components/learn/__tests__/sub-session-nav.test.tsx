import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SubSessionNav } from "../sub-session-nav";

describe("SubSessionNav", () => {
  it("renders both prev + next when available", () => {
    render(
      <SubSessionNav
        prevCode="I2.1.1"
        prevTitle="4 Kỹ thuật"
        prevKind="sub"
        nextCode="I2.1.2"
        nextTitle="Lab + Iterate"
        nextKind="sub"
      />,
    );
    expect(screen.getByText("I2.1.1")).toBeInTheDocument();
    expect(screen.getByText("I2.1.2")).toBeInTheDocument();
    expect(screen.getByText(/Buổi phụ trước/)).toBeInTheDocument();
    expect(screen.getByText(/Buổi phụ sau/)).toBeInTheDocument();
    
    // Check hrefs are correctly formatted as /learn/[parent]/[sub]
    expect(screen.getByRole("link", { name: /Buổi phụ trước/i })).toHaveAttribute("href", "/learn/I2.1/1");
    expect(screen.getByRole("link", { name: /Buổi phụ sau/i })).toHaveAttribute("href", "/learn/I2.1/2");
  });

  it("renders 'Buổi sau' label when nextKind='parent'", () => {
    render(
      <SubSessionNav
        prevCode={null}
        prevTitle=""
        prevKind={null}
        nextCode="I2.3.1"
        nextTitle="Tiếp theo"
        nextKind="parent"
      />,
    );
    expect(screen.getByText(/Buổi sau/)).toBeInTheDocument();
    expect(screen.getByText("I2.3.1")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Buổi sau/i })).toHaveAttribute("href", "/learn/I2.3/1");
  });

  it("hides prev when null (first sub)", () => {
    render(
      <SubSessionNav
        prevCode={null}
        prevTitle=""
        prevKind={null}
        nextCode="I2.1.2"
        nextTitle="Lab"
        nextKind="sub"
      />,
    );
    expect(screen.queryByText(/Buổi phụ trước/)).not.toBeInTheDocument();
  });

  it("hides next when null (last sub)", () => {
    render(
      <SubSessionNav
        prevCode="I5.1.1"
        prevTitle="Overview"
        prevKind="sub"
        nextCode={null}
        nextTitle=""
        nextKind={null}
      />,
    );
    expect(screen.queryByText(/Buổi phụ sau|Buổi sau/)).not.toBeInTheDocument();
  });
});
