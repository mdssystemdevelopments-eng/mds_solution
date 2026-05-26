"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LoaderPanel } from "@/components/loader-panel";

type Phase = "hidden" | "show" | "hide";

function now() {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function getSiteRoot() {
  return document.querySelector<HTMLElement>(".site-root");
}

function getBootEl() {
  return document.getElementById("boot-loader");
}

async function waitForStability(maxMs: number) {
  const start = now();
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fonts = (document as any).fonts;
    if (fonts?.ready) {
      await Promise.race([fonts.ready, new Promise((r) => setTimeout(r, 350))]);
    }
  } catch {
    /* ignore */
  }

  await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

  const elapsed = now() - start;
  if (elapsed < maxMs) {
    await new Promise((r) => setTimeout(r, maxMs - elapsed));
  }
}

function hideBootLoader() {
  const boot = getBootEl();
  if (!boot) return;
  boot.classList.add("page-loader--hide");
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      getSiteRoot()?.classList.remove("is-booting");
      boot.remove();
      resolve();
    }, 280);
  });
}

export function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /** Primeira carga: só controla o #boot-loader (sem 2º overlay) */
  const [routePhase, setRoutePhase] = useState<Phase>("hidden");
  const shownAtRef = useRef<number>(now());
  const lastKeyRef = useRef<string>("");
  const isFirstRouteRef = useRef(true);

  useEffect(() => {
    const minShowMs = 450;
    let cancelled = false;

    const run = async () => {
      shownAtRef.current = now();
      await waitForStability(1200);

      const remaining = Math.max(0, minShowMs - (now() - shownAtRef.current));
      if (remaining) await new Promise((r) => setTimeout(r, remaining));
      if (cancelled) return;

      await hideBootLoader();
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const key = `${pathname}?${searchParams?.toString() ?? ""}`;
    if (isFirstRouteRef.current) {
      isFirstRouteRef.current = false;
      lastKeyRef.current = key;
      return;
    }
    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;

    const minShowMs = 200;
    let cancelled = false;

    const run = async () => {
      getSiteRoot()?.classList.add("is-booting");
      shownAtRef.current = now();
      setRoutePhase("show");

      await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
      const remaining = Math.max(0, minShowMs - (now() - shownAtRef.current));
      if (remaining) await new Promise((r) => setTimeout(r, remaining));
      if (cancelled) return;

      setRoutePhase("hide");
      setTimeout(() => {
        if (cancelled) return;
        getSiteRoot()?.classList.remove("is-booting");
        setRoutePhase("hidden");
      }, 220);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [pathname, searchParams]);

  if (routePhase === "hidden") return null;

  return (
    <div
      className={`page-loader page-loader--route${routePhase === "hide" ? " page-loader--hide" : ""}`}
      aria-live="polite"
      aria-busy={routePhase === "show"}
    >
      <LoaderPanel />
    </div>
  );
}
