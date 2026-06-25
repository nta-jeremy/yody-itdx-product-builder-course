/**
 * ReadingTime — Server Component rendering the reading-time estimate.
 * Pure presentational: receives the minutes from the content layer and
 * emits the text + clock icon. No client state, no fetch.
 *
 * YODY DS: token colors only, no emoji. Icon from lucide-react (Clock).
 */

import { Clock } from "lucide-react";

export interface ReadingTimeProps {
  /** Reading-time estimate in minutes (from `LearnerContent.readingMinutes`). */
  minutes: number;
}

export function ReadingTime({ minutes }: ReadingTimeProps) {
  return (
    <span className="inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--fg-3)]">
      <Clock size={12} /> ~{minutes} phút đọc
    </span>
  );
}

export default ReadingTime;