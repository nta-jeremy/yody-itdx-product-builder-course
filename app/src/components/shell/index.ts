/**
 * Shell barrel — public surface for app routes.
 *
 * Server Components by default; the only client island is `PrintToolbar`
 * (not re-exported here — imported directly from ./print-toolbar where
 * needed, to keep the "use client" boundary explicit).
 */

export { SiteHeader, type NavKey, type SiteHeaderProps } from "./site-header";
export { Sidebar, type SidebarProps } from "./sidebar";
export { Footer } from "./footer";
export { PrintLayout, type PrintLayoutProps } from "./print-layout";