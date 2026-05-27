"use client";

import { useEffect } from "react";

type Props = {
  text: string;
  stepMs?: number;
};

export function BrowserTitleMarquee({ text, stepMs = 260 }: Props) {
  useEffect(() => {
    const clean = (text || "").trim();
    if (!clean) return;

    const gap = "   \u2022   ";
    const source = `${clean}${gap}`;
    const windowSize = source.length;
    let offset = 0;

    const apply = () => {
      const doubled = `${source}${source}`;
      document.title = doubled.slice(offset, offset + windowSize);
      offset = (offset + 1) % source.length;
    };

    apply();
    const timer = window.setInterval(apply, stepMs);
    return () => {
      window.clearInterval(timer);
      document.title = clean;
    };
  }, [text, stepMs]);

  return null;
}
