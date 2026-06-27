import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "../sidebar";
import type { LearnerContent } from "@/lib/content";

const i42SubSessions: LearnerContent["subSessions"] = [
  {
    subCode: "I4.2.1",
    slug: "Kien-Truc-5-Lop",
    title: "Kiến trúc 5 lớp",
    readingMinutes: 30,
    duration: 90,
  },
  {
    subCode: "I4.2.2",
    slug: "Vibe-Coding-Lab",
    title: "Vibe Coding Lab",
    readingMinutes: 30,
    duration: 90,
  },
];

const sessions: LearnerContent[] = [
  {
    code: "I4.1",
    title: "Workflow Canvas",
    level: "L4 Integrator",
    levelNum: 4,
    markdown: "",
    wordCount: 0,
    readingMinutes: 1,
    subSessions: [],
  },
  {
    code: "I4.2",
    title: "Xây Dựng AI Feature",
    level: "L4 Integrator",
    levelNum: 4,
    markdown: "",
    wordCount: 0,
    readingMinutes: 1,
    subSessions: i42SubSessions,
  },
  {
    code: "I4.3",
    title: "Tích hợp",
    level: "L4 Integrator",
    levelNum: 4,
    markdown: "",
    wordCount: 0,
    readingMinutes: 1,
    subSessions: [],
  },
];

describe("Sidebar — sub-session auto-expand", () => {
  it("expands I4.2 when pathname matches /learn/I4.2/1", () => {
    const jsx = Sidebar({
      sessions,
      activeCode: "I4.2",
      linkBase: "/learn",
      pathname: "/learn/I4.2/1",
    });
    render(jsx);
    expect(screen.getByText(/I4\.2\.1/)).toBeInTheDocument();
    expect(screen.getByText(/I4\.2\.2/)).toBeInTheDocument();
  });

  it("expands I4.2 when activeSubCode prop is set (no pathname)", () => {
    const jsx = Sidebar({
      sessions,
      activeCode: "I4.2.1",
      activeSubCode: "I4.2.1",
      linkBase: "/learn",
    });
    render(jsx);
    expect(screen.getByText(/I4\.2\.1/)).toBeInTheDocument();
    expect(screen.getByText(/I4\.2\.2/)).toBeInTheDocument();
    // I4.2.1 should be marked as the active sub-session.
    const activeSubLink = document.querySelector("a[aria-current='page'][href='/learn/I4.2/1']");
    expect(activeSubLink).not.toBeNull();
  });

  it("always expands I4.2 because it has sub-sessions (no active sub)", () => {
    const jsx = Sidebar({
      sessions,
      activeCode: "I4.2",
      linkBase: "/learn",
      pathname: "/learn/I4.2",
    });
    const { container } = render(jsx);
    // I4.2 has subSessions — its sub-list should always be rendered,
    // regardless of whether the user is on the parent or a sub-route.
    expect(container.querySelector("a[href='/learn/I4.2/1']")).not.toBeNull();
    expect(container.querySelector("a[href='/learn/I4.2/2']")).not.toBeNull();
  });

  it("does not render sub-list for parents without sub-sessions", () => {
    const jsx = Sidebar({
      sessions,
      activeCode: "I4.1",
      linkBase: "/learn",
      pathname: "/learn/I4.1",
    });
    const { container } = render(jsx);
    // I4.1 has no subSessions — no sub-list links for I4.1.x should appear.
    expect(container.querySelector("a[href^='/learn/I4.1/']")).toBeNull();
    // Sanity: I4.2 (which has subs) still expands in the same render.
    expect(container.querySelector("a[href='/learn/I4.2/1']")).not.toBeNull();
  });
});
