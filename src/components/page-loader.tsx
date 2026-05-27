"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();

  const [routePhase, setRoutePhase] = useState<Phase>("hidden");
  const lastKeyRef = useRef<string>("");
  const isFirstRouteRef = useRef(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      await waitForPageReady({
        minMs: 600,
        maxMs: 30000,
        includeWindowLoad: true,
        waitVideos: true,
        waitImages: true,
      });

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

    let cancelled = false;

    const run = async () => {
      getSiteRoot()?.classList.add("is-booting");
      setRoutePhase("show");

      await waitForPageReady({
        minMs: 500,
        maxMs: 20000,
        includeWindowLoad: false,
        waitVideos: pathname === "/" || pathname === "",
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
