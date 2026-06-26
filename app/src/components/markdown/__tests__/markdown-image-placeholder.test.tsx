import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MarkdownView } from "../markdown";

describe("MarkdownView — image placeholder integration", () => {
  it("renders <EmptyImage> for <!-- CẦN HÌNH: prompt --> in markdown", () => {
    const { container } = render(
      <MarkdownView source={"before\n\n<!-- CẦN HÌNH: cinematic prompt -->\n\nafter"} />,
    );
    const figure = container.querySelector("figure.yody-empty-image");
    expect(figure).not.toBeNull();
    expect(figure?.getAttribute("data-prompt")).toBe("cinematic prompt");
  });

  it("preserves surrounding markdown content", () => {
    const { container } = render(
      <MarkdownView source={"# Heading\n\n<!-- CẦN HÌNH: x -->\n\nparagraph"} />,
    );
    expect(container.querySelector("h1.yody-h1")).not.toBeNull();
    expect(container.querySelector("p.yody-p")).not.toBeNull();
    expect(container.querySelector("figure.yody-empty-image")).not.toBeNull();
  });

  it("does not render placeholder for plain text containing marker", () => {
    const { container } = render(
      <MarkdownView source={"paragraph mentioning CẦN HÌNH: inline"} />,
    );
    expect(container.querySelector("figure.yody-empty-image")).toBeNull();
  });
});
