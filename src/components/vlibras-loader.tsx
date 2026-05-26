"use client";

import dynamic from "next/dynamic";

const VLibrasWidget = dynamic(
  () => import("@/components/vlibras-widget").then((m) => m.VLibrasWidget),
  { ssr: false },
);

export function VLibrasLoader() {
  return <VLibrasWidget />;
}
