"use client";

import { usePathname } from "next/navigation";
import { getPageBackground } from "@/lib/page-backgrounds";
import { SiteAmbientBackground } from "@/components/site-ambient-background";
import { SiteImageBackground } from "@/components/site-image-background";

export function SiteBackdrop() {
  const pathname = usePathname();
  const image = getPageBackground(pathname);

  if (!image) {
    return <SiteAmbientBackground />;
  }

  return <SiteImageBackground src={image} />;
}
