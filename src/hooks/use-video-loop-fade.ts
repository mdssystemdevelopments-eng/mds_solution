import { type RefObject, useEffect } from "react";

/** Fade máximo no início/fim de cada ciclo (segundos) */
export const LOOP_FADE_SEC = 1.35;
/** Opacidade no “corte” do loop — mais baixa esconde melhor o salto fim→início */
export const LOOP_MIN_OPACITY = 0.72;
/** Fração da duração usada no fade (até LOOP_FADE_SEC) */
const FADE_DURATION_RATIO = 0.09;
const SEAM_SEEK_SEC = 0.035;

function cosineEase(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return 0.5 - 0.5 * Math.cos(x * Math.PI);
}

export function getLoopFadeSeconds(duration: number, fadeSec = LOOP_FADE_SEC): number {
  if (!Number.isFinite(duration) || duration <= 0) return fadeSec;
  return Math.min(fadeSec, duration * FADE_DURATION_RATIO, 2.8);
}

/** Opacidade 0–1 conforme o tempo atual do vídeo */
export function opacityAtLoopTime(
  current: number,
  duration: number,
  fadeSec = LOOP_FADE_SEC,
  minOpacity = LOOP_MIN_OPACITY,
): number {
  if (!Number.isFinite(duration) || duration <= 0) return 1;
  const fade = getLoopFadeSeconds(duration, fadeSec);
  let edge = 1;
  if (current < fade) {
    edge = cosineEase(current / fade);
  } else if (current > duration - fade) {
    edge = cosineEase((duration - current) / fade);
  }
  return minOpacity + (1 - minOpacity) * edge;
}

type LoopFadeOptions = {
  /** Reinicia o vídeo no ponto mais escuro do fade (loop mais imperceptível) */
  manualLoop?: boolean;
  minOpacity?: number;
};

export function useVideoLoopFade(
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled = true,
  fadeSec = LOOP_FADE_SEC,
  options?: LoopFadeOptions,
) {
  const manualLoop = options?.manualLoop ?? true;
  const minOpacity = options?.minOpacity ?? LOOP_MIN_OPACITY;

  useEffect(() => {
    if (!enabled) return;
    const v = videoRef.current;
    if (!v) return;

    if (manualLoop) {
      v.loop = false;
    }

    const apply = () => {
      const d = v.duration;
      if (!d || !Number.isFinite(d)) return;

      let t = v.currentTime;

      if (manualLoop && t >= d - SEAM_SEEK_SEC) {
        const fade = getLoopFadeSeconds(d, fadeSec);
        const edge = cosineEase((d - t) / fade);
        const opacity = minOpacity + (1 - minOpacity) * edge;
        if (opacity <= minOpacity + 0.08 || t >= d - 0.02) {
          v.currentTime = 0.001;
          t = 0.001;
          if (v.paused) void v.play().catch(() => {});
        }
      }

      v.style.opacity = String(opacityAtLoopTime(t, d, fadeSec, minOpacity));
    };

    const onMeta = () => apply();

    const onEnded = () => {
      if (!manualLoop) return;
      v.currentTime = 0.001;
      void v.play().catch(() => {});
      apply();
    };

    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("durationchange", onMeta);
    v.addEventListener("timeupdate", apply);
    v.addEventListener("seeking", apply);
    v.addEventListener("ended", onEnded);

    if (v.readyState >= 1) onMeta();

    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("durationchange", onMeta);
      v.removeEventListener("timeupdate", apply);
      v.removeEventListener("seeking", apply);
      v.removeEventListener("ended", onEnded);
      v.style.opacity = "";
      if (manualLoop) v.loop = true;
    };
  }, [enabled, fadeSec, manualLoop, minOpacity, videoRef]);
}
