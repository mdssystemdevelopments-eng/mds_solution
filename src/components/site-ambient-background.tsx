"use client";

import { useEffect, useRef, useState } from "react";
import { useVideoLoopFade } from "@/hooks/use-video-loop-fade";

const DEFAULT_VIDEO = "/wallpaper.mp4";
const POSTER = "/wallpaper-cyber-eye.png";

function wallpaperSrc(): string {
  const fromEnv = process.env.NEXT_PUBLIC_WALLPAPER_VIDEO_URL?.trim();
  return fromEnv || DEFAULT_VIDEO;
}

export function SiteAmbientBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const src = wallpaperSrc();

  useVideoLoopFade(videoRef, !failed, 0.85);

  useEffect(() => {
    if (failed) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");

    const tryPlay = () => {
      void video.play().catch(() => {});
    };

    tryPlay();
    video.addEventListener("canplay", tryPlay);
    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      video.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [failed, src]);

  return (
    <div
      className="video-bg"
      aria-hidden
      style={{ backgroundImage: `url(${POSTER})` }}
      suppressHydrationWarning
    >
      {!failed && (
        <video
          ref={videoRef}
          key={src}
          className="video-bg__el video-bg__el--loop-fade"
          src={src}
          poster={POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setFailed(true)}
          suppressHydrationWarning
        />
      )}
      <div className="video-bg__shade" />
    </div>
  );
}
