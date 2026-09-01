import { ASSETS } from "@/modules/shared/constants/assets";
import type { SiteContent } from "@/types/site-content";

export function getPageBackground(pathname: string, media?: SiteContent["media"]): string | null {
  if (pathname === "/" || pathname === "") return null;
  const backgrounds = media?.backgrounds ?? {
    sobre: ASSETS.backgrounds.pages.sobre,
    servicos: ASSETS.backgrounds.pages.servicos,
    portfolio: ASSETS.backgrounds.pages.portfolio,
    contato: ASSETS.backgrounds.pages.contato,
    areaCliente: ASSETS.backgrounds.pages.areaCliente,
  };
  const map: Record<string, string> = {
    "/sobre": backgrounds.sobre,
    "/servicos": backgrounds.servicos,
    "/portfolio": backgrounds.portfolio,
    "/contato": backgrounds.contato,
    "/area-cliente": backgrounds.areaCliente,
    "/depoimentos": backgrounds.sobre,
  };
  return map[pathname] ?? backgrounds.sobre;
}
