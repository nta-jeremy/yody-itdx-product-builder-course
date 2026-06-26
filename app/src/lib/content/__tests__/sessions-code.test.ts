import { describe, it, expect } from "vitest";
import { SESSION_CODE_RE, isValidSessionCode } from "../sessions";

describe("SESSION_CODE_RE — accepts sub-session code", () => {
  it("accepts parent code I4.2 (backward compat)", () => {
    expect(SESSION_CODE_RE.test("I4.2")).toBe(true);
  });
  it("accepts sub-session code I4.2.1 (new)", () => {
    expect(SESSION_CODE_RE.test("I4.2.1")).toBe(true);
  });
  it("accepts boundary I1.1.1", () => {
    expect(SESSION_CODE_RE.test("I1.1.1")).toBe(true);
  });
  it("accepts boundary I5.3.3", () => {
    expect(SESSION_CODE_RE.test("I5.3.3")).toBe(true);
  });
  it("rejects invalid: too many dots I4.2.1.1", () => {
    expect(SESSION_CODE_RE.test("I4.2.1.1")).toBe(false);
  });
  it("rejects invalid: z out of range I4.2.10", () => {
    expect(SESSION_CODE_RE.test("I4.2.10")).toBe(false);
  });
  it("rejects invalid: z=0 I4.2.0", () => {
    expect(SESSION_CODE_RE.test("I4.2.0")).toBe(false);
  });
  it("rejects path traversal: ../../../etc/passwd", () => {
    expect(SESSION_CODE_RE.test("../../../etc/passwd")).toBe(false);
  });
  it("rejects path traversal: foo.bar.baz", () => {
    expect(SESSION_CODE_RE.test("foo.bar.baz")).toBe(false);
  });
});

describe("isValidSessionCode — propagates regex update", () => {
  it("accepts sub-session code I4.2.1", () => {
    expect(isValidSessionCode("I4.2.1")).toBe(true);
  });
  it("rejects invalid I4.2.1.1", () => {
    expect(isValidSessionCode("I4.2.1.1")).toBe(false);
  });
});
