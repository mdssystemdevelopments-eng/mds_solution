"use client";

import Image from "next/image";
import { ASSETS } from "@/modules/shared/constants/assets";
import { useOptionalSiteContent } from "@/components/locale-provider";

type Props = {
  variant: "nav" | "hero" | "footer";
  className?: string;
  priority?: boolean;
};

const dim = {
  nav: { width: 220, height: 64, className: "brand-logo brand-logo--nav" },
  hero: { width: 800, height: 992, className: "brand-logo brand-logo--hero" },
  footer: { width: 56, height: 56, className: "brand-logo brand-logo--footer" },
};

export function BrandLogo({ variant, className = "", priority }: Props) {
  const content = useOptionalSiteContent();
  const src = content?.media?.logo || ASSETS.logos.main;
  const d = dim[variant];
  return (
    <Image
      src={src}
      alt={content?.seo.organizationName || "MDS Soluções em Tecnologia"}
      width={d.width}
      height={d.height}
      className={`${d.className} ${className}`.trim()}
      priority={priority ?? variant === "nav"}
      unoptimized
    />
  );
}
