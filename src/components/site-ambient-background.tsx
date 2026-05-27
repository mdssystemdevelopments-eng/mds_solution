"use client";

import { useEffect, useRef, useState } from "react";
import { useVideoLoopFade } from "@/hooks/use-video-loop-fade";
import { WALLPAPER_VIDEO } from "@/lib/video-urls";

const POSTER = "/wallpaper-cyber-eye.png";

export function SiteAmbientBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const src = WALLPAPER_VIDEO;

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
