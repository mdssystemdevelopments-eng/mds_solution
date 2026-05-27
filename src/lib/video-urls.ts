/** URLs dos vídeos — use env na Vercel se os arquivos em /public não subirem no deploy. */

import { ASSETS } from "@/modules/shared/constants/assets";

const v = (key: string, fallback: string) =>
  process.env[key]?.trim() || fallback;

export const LOGO_VIDEO_MP4 = v("NEXT_PUBLIC_LOGO_VIDEO_MP4", ASSETS.logos.animMp4);
export const LOGO_VIDEO_WEBM = v("NEXT_PUBLIC_LOGO_VIDEO_WEBM", ASSETS.logos.animWebm);
