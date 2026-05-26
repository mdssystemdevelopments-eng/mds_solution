import { type RefObject, useEffect } from "react";

/** Segundos de fade no início e no fim de cada loop */
export const LOOP_FADE_SEC = 0.55;
/** Opacidade mínima no “corte” do loop (sutil) */
export const LOOP_MIN_OPACITY = 0.9;

function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/** Opacidade 0–1 conforme o tempo atual do vídeo */
export function opacityAtLoopTime(
  current: number,
  duration: number,
  fadeSec = LOOP_FADE_SEC
): number {
  if (!Number.isFinite(duration) || duration <= 0) return 1;
  const fade = Math.min(fadeSec, duration * 0.22);
  let edge = 1;
  if (current < fade) edge = smoothstep(current / fade);
  else if (current > duration - fade) edge = smoothstep((duration - current) / fade);
  return LOOP_MIN_OPACITY + (1 - LOOP_MIN_OPACITY) * edge;
}

export function useVideoLoopFade(
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled = true,
  fadeSec = LOOP_FADE_SEC
) {
  useEffect(() => {
    if (!enabled) return;
    const v = videoRef.current;
    if (!v) return;

    const apply = () => {
      if (!v.duration) return;
      v.style.opacity = String(opacityAtLoopTime(v.currentTime, v.duration, fadeSec));
    };

    const onMeta = () => {
      apply();
    };

    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("timeupdate", apply);
    v.addEventListener("seeking", apply);

    if (v.readyState >= 1) onMeta();

    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("timeupdate", apply);
      v.removeEventListener("seeking", apply);
      v.style.opacity = "";
    };
  }, [enabled, fadeSec, videoRef]);
}
