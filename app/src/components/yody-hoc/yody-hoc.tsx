"use client";

import { useCallback, useRef, useState } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { HomeScreen } from "./home-screen";
import { ListScreen } from "./list-screen";
import { ReadScreen } from "./read-screen";
import { IntroScreen } from "./intro-screen";
import { CopyToast } from "./copy-toast";
import type { Page } from "./data";

export function YodyHoc() {
  const [page, setPage] = useState<Page>("home");
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nav = useCallback((next: Page) => {
    setPage(next);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);

  const onCopied = useCallback(() => {
    setToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 1600);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-warm font-[family-name:var(--font-body)] text-fg-1">
      <SiteHeader page={page} onNav={nav} />

      {page === "home" && <HomeScreen onNav={nav} />}
      {page === "list" && <ListScreen onNav={nav} />}
      {page === "read" && <ReadScreen onNav={nav} onCopied={onCopied} />}
      {page === "intro" && <IntroScreen onNav={nav} />}

      <SiteFooter />
      <CopyToast show={toast} />
    </div>
  );
}