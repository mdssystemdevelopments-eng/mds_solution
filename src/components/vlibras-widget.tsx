"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    VLibras?: { Widget: new (url: string) => void };
  }
}

function initVLibras() {
  if (typeof window !== "undefined" && window.VLibras) {
    new window.VLibras.Widget("https://vlibras.gov.br/app");
  }
}

/**
 * VLibras — widget oficial (carregado só no cliente para evitar erros de hidratação).
 */
export function VLibrasWidget() {
  useEffect(() => {
    initVLibras();
  }, []);

  return (
    <>
      <Script
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive"
        onLoad={initVLibras}
      />
      <div id="vlibras-root" className="vlibras-mount" aria-hidden suppressHydrationWarning />
    </>
  );
}
