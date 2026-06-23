import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yody.vn"),
  title: {
    default: "Yody Product Builder",
    template: "%s · Yody Product Builder",
  },
  description: "Product builder application powered by the YODY Design System",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Yody Product Builder",
    title: "Yody Product Builder",
    description: "Product builder application powered by the YODY Design System",
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
    <html lang="vi" className={`${fontVariables} h-full antialiased`}>
      <body data-surface="app" className="min-h-full flex flex-col bg-background text-foreground">
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}