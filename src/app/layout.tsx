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
              "#boot-loader,.page-loader--boot{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:#05080f}",
              ".page-loader__panel{width:min(92vw,440px);padding:1.1rem;border-radius:16px;border:1px solid rgba(0,212,255,.25);background:rgba(6,10,22,.62)}",
              ".page-loader__row{display:flex;align-items:center;gap:1.1rem;width:100%}",
              ".page-loader__logo{width:168px;height:168px;object-fit:contain;display:block}",
              ".page-loader__bar{width:100%;height:10px;margin-top:.95rem;border-radius:999px;border:1px solid rgba(0,212,255,.25);background:rgba(255,255,255,.06);overflow:hidden;position:relative}",
              ".page-loader__bar::before{content:'';position:absolute;inset:0;width:42%;background:linear-gradient(90deg,transparent,rgba(0,212,255,.95),transparent);animation:loader-bar-crit .95s ease-in-out infinite}",
              "@keyframes loader-bar-crit{0%{transform:translateX(-70%)}50%,100%{transform:translateX(120%)}}",
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
