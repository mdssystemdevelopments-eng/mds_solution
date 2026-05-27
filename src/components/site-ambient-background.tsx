import { ASSETS } from "@/modules/shared/constants/assets";

const HOME_WALLPAPER = ASSETS.backgrounds.homeWallpaper;

export function SiteAmbientBackground() {
  return (
    <div className="video-bg" aria-hidden suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="video-bg__image"
        src={HOME_WALLPAPER}
        alt=""
        fetchPriority="high"
        decoding="async"
        suppressHydrationWarning
      />
      <div className="video-bg__shade" />
    </div>
  );
}
