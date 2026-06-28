import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { SiteHeader } from "@/components/shell";
import { Footer } from "@/components/shell";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yody.vn"),
  title: {
    default: "Yody Product Builder",
    template: "%s · Yody Product Builder",
  },
  description: "Program Intern Product Builder — tài liệu đào tạo nội bộ, 14 buổi học + cẩm nang giảng kèm.",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Yody Product Builder",
    title: "Yody Product Builder",
    description: "Program Intern Product Builder — tài liệu đào tạo nội bộ, 14 buổi học + cẩm nang giảng kèm.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0f24" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${fontVariables} h-full antialiased`}>
      <body suppressHydrationWarning data-surface="app" className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}