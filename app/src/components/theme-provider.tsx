/**
 * ThemeProvider — client wrapper around next-themes `ThemeProvider`.
 *
 * `attribute="class"` injects `.dark` on `<html>` (matches the Tailwind v4
 * `@custom-variant dark (&:is(.dark *))` and the foundation-token `.dark`
 * overrides in colors_and_type.css). `defaultTheme="system"` respects
 * `prefers-color-scheme` on first load; `disableTransitionOnChange`
 * prevents the color flash when toggling. layout.tsx adds
 * `suppressHydrationWarning` on `<html>` since next-themes mutates the class
 * client-side (expected mismatch, not a logic error).
 *
 * YODY DS: no visual surface — pure provider.
 */

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export default ThemeProvider;