import Image from "next/image";
import { ASSETS } from "@/modules/shared/constants/assets";

type Props = {
  variant: "nav" | "hero" | "footer";
  className?: string;
  priority?: boolean;
};

/** Logo oficial — arquivo em /public/logo-mds.png */
const LOGO_SRC = ASSETS.logos.main;

const dim = {
  nav: { width: 220, height: 64, className: "brand-logo brand-logo--nav" },
  hero: { width: 800, height: 992, className: "brand-logo brand-logo--hero" },
  footer: { width: 56, height: 56, className: "brand-logo brand-logo--footer" },
};

export function BrandLogo({ variant, className = "", priority }: Props) {
  const d = dim[variant];
  return (
    <Image
      src={LOGO_SRC}
      alt="MDS Soluções em Tecnologia"
      width={d.width}
      height={d.height}
      className={`${d.className} ${className}`.trim()}
      priority={priority ?? variant === "nav"}
      unoptimized
    />
  );
}
