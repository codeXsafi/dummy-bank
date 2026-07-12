/*
 * app/layout.tsx — the app's root layout, wrapping every route.
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { ThemeSync } from "@/components/theme/ThemeSync";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dummy Bank",
  description: "Dummy Bank — assessment build",
};

const THEME_BOOTSTRAP_SCRIPT = `
  try {
    var theme = localStorage.getItem("dummy-bank-theme");
    if (theme === "bb" || theme === "pb") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  } catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="bb"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {THEME_BOOTSTRAP_SCRIPT}
        </Script>
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
