/** URLs dos vídeos — use env na Vercel se os arquivos em /public não subirem no deploy. */

const v = (key: string, fallback: string) =>
  process.env[key]?.trim() || fallback;

export const LOGO_VIDEO_MP4 = v("NEXT_PUBLIC_LOGO_VIDEO_MP4", "/logo-anim.mp4");
export const LOGO_VIDEO_WEBM = v("NEXT_PUBLIC_LOGO_VIDEO_WEBM", "/logo-anim.webm");
export const WALLPAPER_VIDEO = v("NEXT_PUBLIC_WALLPAPER_VIDEO_URL", "/wallpaper.mp4");
