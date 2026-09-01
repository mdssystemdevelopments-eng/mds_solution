import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppToaster } from "@/components/toaster";
import { BrowserTitleMarquee } from "@/components/browser-title-marquee";
import { ASSETS } from "@/modules/shared/constants/assets";

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
  icons: {
    icon: [
      { url: ASSETS.icons.favicon, type: "image/svg+xml", sizes: "any" },
      { url: ASSETS.logos.main, type: "image/png", sizes: "192x192" },
    ],
    shortcut: ASSETS.icons.favicon,
    apple: ASSETS.logos.main,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark notranslate" translate="no" suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: [
              ".site-root.is-booting .site,.site-root.is-booting .video-bg,",
              ".site-root.is-booting .hero__logo-media,.site-root.is-booting .hero__logo-video,",
              ".site-root.is-booting .hero__preview--logo{opacity:0!important;visibility:hidden!important;pointer-events:none!important}",
              "#boot-loader,.page-loader--boot{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#030508}",
              ".mds-loader{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;width:100%}",
              ".mds-loader__bars{display:flex;gap:6px;align-items:flex-end;justify-content:center;height:54px;width:100%}",
              ".mds-loader__bar{width:6px;background:#00c2ff;border-radius:2px;transform-origin:bottom;animation:mds-bar-pulse 1.1s ease-in-out infinite}",
              ".mds-loader__text{margin:0;font-size:13px;letter-spacing:2px;color:#8892a0;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;text-align:center;width:100%}",
              ".mds-loader__dot{display:inline-block;animation:mds-dot-fade 1.4s infinite}",
              "@keyframes mds-bar-pulse{0%,100%{transform:scaleY(.4);opacity:.5}50%{transform:scaleY(1);opacity:1}}",
              "@keyframes mds-dot-fade{0%,20%{opacity:0}40%{opacity:1}100%{opacity:0}}",
            ].join(""),
          }}
        />
        <link rel="preload" href={ASSETS.backgrounds.homeWallpaper} as="image" />
        <link rel="preload" href={ASSETS.logos.animWebm} as="video" type="video/webm" />
        <link rel="preload" href={ASSETS.logos.animMp4} as="video" type="video/mp4" />
      </head>
      <body className={`${inter.variable} ${jakarta.variable} ${jetbrains.variable} min-h-screen font-sans notranslate`} translate="no">
        <BrowserTitleMarquee text="MDS Soluções em Tecnologia" />
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
