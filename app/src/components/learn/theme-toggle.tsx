/**
 * ThemeToggle — client island toggling dark/light via next-themes.
 *
 * `mounted` guard: before mount, the server has no theme (next-themes injects
 * the class client-side), so a placeholder of the same size is rendered to
 * avoid hydration mismatch. G6 wires `NextThemesProvider` in layout.tsx.
 *
 * YODY DS: token colors only, tap target min 44×44px, visible focus ring,
 * no emoji. Icons from lucide-react (Sun / Moon).
 */

"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // `useSyncExternalStore` is the idiomatic "is this running on the client?"
  // check — it returns false during SSR and true after hydration, with no
  // `setState` in an effect (which the react-hooks lint rule flags).
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Pre-mount placeholder — avoids hydration mismatch (server doesn't know
  // the theme; next-themes injects the class on the client only).
  if (!mounted) {
    return (
      <div
        className="min-h-[44px] min-w-[44px]"
        aria-hidden="true"
      />
    );
  }

  // `resolvedTheme` reflects the actually-applied theme ("dark"/"light"),
  // not the *set* value (`theme` could be "system" while the page renders
  // dark). The icon must track what the user sees.
  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Chuyển sang sáng" : "Chuyển sang tối"}
      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-[var(--fg-2)] outline-ring/50 hover:text-[var(--fg-1)] focus-visible:ring-[3px]"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export default ThemeToggle;