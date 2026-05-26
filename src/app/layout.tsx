import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppToaster } from "@/components/toaster";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MDS Soluções em Tecnologia",
  description: "Desenvolvimento web, sistemas ERP, aplicativos e assistência técnica.",
  other: { google: "notranslate" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark notranslate" translate="no" suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".page-loader--boot,#boot-loader{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:#05080f}",
          }}
        />
        <link rel="preload" href="/wallpaper.mp4" as="video" type="video/mp4" />
      </head>
      <body className={`${inter.variable} ${jakarta.variable} ${jetbrains.variable} min-h-screen font-sans notranslate`} translate="no">
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
