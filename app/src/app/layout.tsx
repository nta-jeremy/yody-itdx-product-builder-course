import type { Metadata } from "next";
import { beVietnamPro } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yody Product Builder",
  description: "Product builder application powered by the YODY Design System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body data-surface="app" className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}