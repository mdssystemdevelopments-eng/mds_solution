"use client";

import { usePathname } from "next/navigation";
import { getPageBackground } from "@/lib/page-backgrounds";
import { SiteAmbientBackground } from "@/components/site-ambient-background";
import { SiteImageBackground } from "@/components/site-image-background";
import { useOptionalSiteContent } from "@/components/locale-provider";

export function SiteBackdrop() {
  const pathname = usePathname();
  const content = useOptionalSiteContent();
  const image = getPageBackground(pathname, content?.media);

  if (!image) {
    return <SiteAmbientBackground />;
  }

  return <SiteImageBackground src={image} />;
}
