"use client";

import { useEffect, useRef } from "react";
import { useVideoLoopFade } from "@/hooks/use-video-loop-fade";

const VIDEO = "/wallpaper.mp4";

export function SiteAmbientBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useVideoLoopFade(videoRef, true, 0.85);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    void video.play().catch(() => {});
  }, []);

  return (
    <div className="video-bg" aria-hidden suppressHydrationWarning>
      <video
        ref={videoRef}
        className="video-bg__el video-bg__el--loop-fade"
        src={VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        suppressHydrationWarning
      />
      <div className="video-bg__shade" />
    </div>
  );
}
