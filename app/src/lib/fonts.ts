import localFont from "next/font/local";

export const beVietnamPro = localFont({
  src: [
    { path: "../../public/fonts/BeVietnamPro-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/BeVietnamPro-Italic.ttf", weight: "400", style: "italic" },
    { path: "../../public/fonts/BeVietnamPro-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/BeVietnamPro-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/BeVietnamPro-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});