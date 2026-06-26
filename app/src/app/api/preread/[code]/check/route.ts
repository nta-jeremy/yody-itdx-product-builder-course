/**
 * POST /api/preread/[code]/check — server-side quiz grader.
 *
 * **SECURITY:** This route is the ONLY place that holds `correctIndex`.
 * The client `PreReadQuiz` component receives sanitized `{ question,
 * options }` only — never the answer key. Answers are POSTed here,
 * graded server-side using `getPreRead(code).questions[i].correctIndex`,
 * and the response returns ONLY:
 *   - `correct`: count of correct answers (number)
 *   - `explanations`: per-question strings (correct or "Đáp án đúng: X. ...")
 *
 * No `correctIndex` is ever serialized in the response. See plan Phase 5
 * §Security + §B2.7.
 */

import { NextResponse, type NextRequest } from "next/server";
import { getPreRead, isValidSessionCode } from "@/lib/content";

const PASS_THRESHOLD = 2;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  if (!isValidSessionCode(code)) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  const preread = await getPreRead(code);
  if (!preread) {
    return NextResponse.json(
      { error: "Pre-read not found" },
      { status: 404 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const answers = Array.isArray((body as { answers?: unknown })?.answers)
    ? ((body as { answers: unknown[] }).answers as unknown[])
    : [];

  const correct = preread.questions.reduce((sum, q, idx) => {
    const userAns = answers[idx];
    return sum + (userAns === q.correctIndex ? 1 : 0);
  }, 0);

  const explanations = preread.questions.map((q, idx) => {
    const userAns = answers[idx];
    const correctLetter = String.fromCharCode(65 + q.correctIndex);
    if (userAns === q.correctIndex) {
      return `Đúng! ${q.explanation}`;
    }
    return `Đáp án đúng: ${correctLetter}. ${q.explanation}`;
  });

  return NextResponse.json({ correct, explanations, pass: correct >= PASS_THRESHOLD });
}
