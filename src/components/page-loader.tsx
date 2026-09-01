"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LoaderPanel } from "@/components/loader-panel";
import { waitForPageReady } from "@/lib/wait-for-page-ready";

type Phase = "hidden" | "show" | "hide";

function getSiteRoot() {
  return document.querySelector<HTMLElement>(".site-root");
}

function getBootEl() {
  return document.getElementById("boot-loader");
}

/** Remove boot só depois do fade; site só aparece quando o overlay sumir */
async function hideBootLoader() {
  const boot = getBootEl();
  if (!boot) {
    getSiteRoot()?.classList.remove("is-booting");
    return;
  }

  boot.classList.add("page-loader--hide");
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      boot.remove();
      getSiteRoot()?.classList.remove("is-booting");
      resolve();
    }, 320);
  });
}

export function PageLoader() {
  const pathname = usePathname();

  const [routePhase, setRoutePhase] = useState<Phase>("hidden");
  const lastPathRef = useRef<string>("");
  const isFirstRouteRef = useRef(true);

  useEffect(() => {
    let cancelled = false;

    const failsafe = window.setTimeout(() => {
      if (!cancelled) void hideBootLoader();
    }, 2800);

    const run = async () => {
      await waitForPageReady({
        minMs: 400,
        maxMs: 2500,
        includeWindowLoad: false,
        waitVideos: false,
        waitImages: true,
      });

      if (cancelled) return;
      window.clearTimeout(failsafe);
      await hideBootLoader();
    };

    void run();
    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
    };
  }, []);

  useEffect(() => {
    if (isFirstRouteRef.current) {
      isFirstRouteRef.current = false;
      lastPathRef.current = pathname;
      return;
    }
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;

    let cancelled = false;

    const run = async () => {
      getSiteRoot()?.classList.add("is-booting");
      setRoutePhase("show");

      await waitForPageReady({
        minMs: 350,
        maxMs: 2500,
        includeWindowLoad: false,
        waitVideos: false,
        waitImages: true,
      });

      if (cancelled) return;

      setRoutePhase("hide");
      await new Promise<void>((r) => setTimeout(r, 280));
      if (cancelled) return;

      getSiteRoot()?.classList.remove("is-booting");
      setRoutePhase("hidden");
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

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
