"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { useVideoLoopFade } from "@/hooks/use-video-loop-fade";

const LOGO_LOOP_DURATION_S = 5.03;

export function HeroLogoVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  useVideoLoopFade(videoRef, pageReady && !reduceMotion && !failed);

  useEffect(() => {
    const root = document.querySelector(".site-root");
    if (!root) {
      setPageReady(true);
      return;
    }
    if (!root.classList.contains("is-booting")) {
      setPageReady(true);
      return;
    }
    const obs = new MutationObserver(() => {
      if (!root.classList.contains("is-booting")) {
        setPageReady(true);
        obs.disconnect();
      }
    });
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useLayoutEffect(() => {
    const v = videoRef.current;
    const root = containerRef.current;
    if (!v || !root) return;

    const syncBlend = () => {
      const src = v.currentSrc || "";
      const useBlend = src.includes(".mp4") && !src.includes(".webm");
      root.classList.toggle("hero__logo-media--blend", useBlend);
    };

    syncBlend();
    v.addEventListener("loadeddata", syncBlend);
    if (v.readyState >= 2) syncBlend();

    return () => v.removeEventListener("loadeddata", syncBlend);
  }, [failed, reduceMotion]);

  if (!pageReady) {
    return <div className="hero__logo-media hero__logo-media--placeholder" aria-hidden />;
  }

  if (reduceMotion || failed) {
    return (
      <div
        ref={containerRef}
        className="hero__logo-media hero__logo-media--static-fade"
        style={{ ["--logo-loop-duration" as string]: `${LOGO_LOOP_DURATION_S}s` }}
      >
        <BrandLogo variant="hero" priority />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="hero__logo-media">
      <video
        ref={videoRef}
        className="hero__logo-video hero__logo-video--loop-fade"
        width={800}
        height={992}
        autoPlay
        loop
        muted
        playsInline
        preload={pageReady ? "auto" : "none"}
        aria-label="MDS Soluções em Tecnologia, logo animada"
        onError={() => setFailed(true)}
        suppressHydrationWarning
      >
        <source src="/logo-anim.webm?v=3" type="video/webm" />
        <source src="/logo-anim.mp4?v=3" type="video/mp4" />
      </video>
    </div>
  );
}
