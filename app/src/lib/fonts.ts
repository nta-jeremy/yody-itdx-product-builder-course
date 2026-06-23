import localFont from "next/font/local";
import { Montserrat, Playfair_Display, JetBrains_Mono } from "next/font/google";

export const beVietnamPro = localFont({
  src: [
    { path: "../../public/fonts/BeVietnamPro-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/BeVietnamPro-Italic.ttf", weight: "400", style: "italic" },
    { path: "../../public/fonts/BeVietnamPro-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/BeVietnamPro-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/BeVietnamPro-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-body-loaded",
  display: "swap",
});

export const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const fontVariables = [
  beVietnamPro.variable,
  montserrat.variable,
  playfairDisplay.variable,
  jetbrainsMono.variable,
].join(" ");