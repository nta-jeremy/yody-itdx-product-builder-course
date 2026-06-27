/**
 * GET /api/preread/[code]/shuffle — randomized quiz payload.
 *
 * Returns sanitized questions in a fresh random order, with per-question
 * options also shuffled, plus the permutation vectors so the client can
 * render the shuffled view AND the grader can map user picks back to the
 * original question/option indices for scoring.
 *
 * **SECURITY (B2.7):** This route NEVER serializes `correctIndex` or
 * `explanation`. It only exposes `{ question, options }` (the public
 * "SafeQuestion" shape) plus the permutation vectors. The answer key
 * stays in `getPreRead(code)` and is only consulted by `/check`.
 *
 * Response shape:
 *   {
 *     questions:    SafeQuestion[]                  // shuffled order
 *     questionOrder: number[]                       // questionOrder[i] = orig index of question i
 *     optionOrders:  number[][]                     // optionOrders[i][j] = orig index of option j in shuffled question i
 *   }
 *
 * Randomization uses `crypto.getRandomValues` for unbiased Fisher–Yates.
 */

import { NextResponse, type NextRequest } from "next/server";
import { getPreRead, isValidSessionCode } from "@/lib/content";

function randomUint32(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0]!;
}

/** Fisher–Yates shuffle producing a permutation vector: out[i] = orig index at position i. */
function shuffledOrder(length: number): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i--) {
    const j = randomUint32() % (i + 1);
    [indices[i], indices[j]] = [indices[j]!, indices[i]!];
  }
  return indices;
}

export async function GET(
  _request: NextRequest,
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

  const questionOrder = shuffledOrder(preread.questions.length);
  const optionOrders: number[][] = questionOrder.map((origQIdx) =>
    shuffledOrder(preread.questions[origQIdx]!.options.length),
  );

  const questions = questionOrder.map((origQIdx, shuffledIdx) => {
    const orig = preread.questions[origQIdx]!;
    const optOrder = optionOrders[shuffledIdx]!;
    return {
      question: orig.question,
      options: optOrder.map((origOptIdx) => orig.options[origOptIdx]!),
    };
  });

  return NextResponse.json({ questions, questionOrder, optionOrders });
}