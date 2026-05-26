"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const SHOW_AFTER_PX = 120;

function getScrollY() {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function ScrollToTop({ label }: { label: string }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const onScroll = () => setVisible(getScrollY() > SHOW_AFTER_PX);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll);
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <button
      type="button"
      className={`scroll-top${visible ? " scroll-top--visible" : ""}`}
      aria-label={label}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={scrollToTop}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeWidth={2} d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>,
    document.body,
  );
}
