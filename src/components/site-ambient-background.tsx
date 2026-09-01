"use client";

import { ASSETS } from "@/modules/shared/constants/assets";
import { useOptionalSiteContent } from "@/components/locale-provider";

export function SiteAmbientBackground() {
  const content = useOptionalSiteContent();
  const src = content?.media?.homeWallpaper || ASSETS.backgrounds.homeWallpaper;

  return (
    <div className="video-bg" aria-hidden suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="video-bg__image"
        src={src}
        alt=""
        fetchPriority="high"
        decoding="async"
        suppressHydrationWarning
      />
      <div className="video-bg__shade" />
    </div>
  );
}
