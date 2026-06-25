/**
 * ReadingProgress — client island: a fixed 2px top bar that scales 0→100%
 * with the page scroll. Pure scroll listener (passive), no throttle needed
 * for a 2px bar. `prefers-reduced-motion` is honored globally (globals.css).
 *
 * YODY DS: token color only (`var(--iris)`), no raw hex, no emoji.
 */

"use client";

import * as React from "react";

export function ReadingProgress() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed left-0 top-0 z-30 h-[2px] w-full bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-[var(--iris)]"
        style={{ width: `${progress}%`, transitionDuration: "var(--dur)", transitionTimingFunction: "var(--ease-out)" }}
      />
    </div>
  );
}

export default ReadingProgress;