import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyImage } from "../empty-image";

describe("<EmptyImage>", () => {
  it("renders prompt in data-prompt and figcaption", () => {
    const { container } = render(<EmptyImage prompt="a prompt" />);
    const figure = container.querySelector("figure");
    expect(figure).not.toBeNull();
    expect(figure?.getAttribute("data-prompt")).toBe("a prompt");
    expect(screen.getByText(/Prompt:/)).toBeInTheDocument();
    expect(screen.getByText(/a prompt/)).toBeInTheDocument();
  });

  it("omits figcaption when prompt is empty", () => {
    const { container } = render(<EmptyImage prompt="" />);
    const figcaption = container.querySelector("figcaption");
    expect(figcaption).toBeNull();
  });

  it("renders an aspect-video placeholder box with aria-label", () => {
    render(<EmptyImage prompt="mô tả ngắn" />);
    const box = screen.getByRole("img", {
      name: /Ảnh minh họa chờ cập nhật/,
    });
    expect(box).toBeInTheDocument();
    expect(box.className).toContain("aspect-video");
  });

  it("does not crash on very long prompts", () => {
    const long = "a".repeat(500);
    const { container } = render(<EmptyImage prompt={long} />);
    const figure = container.querySelector("figure");
    expect(figure?.getAttribute("data-prompt")).toBe(long);
  });

  it("applies extra className when provided", () => {
    const { container } = render(
      <EmptyImage prompt="x" className="extra-class" />,
    );
    const figure = container.querySelector("figure");
    expect(figure?.className).toContain("extra-class");
    expect(figure?.className).toContain("yody-empty-image");
  });
});
