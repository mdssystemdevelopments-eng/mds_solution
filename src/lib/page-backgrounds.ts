import { ASSETS } from "@/modules/shared/constants/assets";

/** Fundo fixo por rota (imagens em /public/bg). Home usa wallpaper principal. */
export const PAGE_BACKGROUNDS: Record<string, string> = {
  "/sobre": ASSETS.backgrounds.pages.sobre,
  "/servicos": ASSETS.backgrounds.pages.servicos,
  "/portfolio": ASSETS.backgrounds.pages.portfolio,
  "/contato": ASSETS.backgrounds.pages.contato,
  "/area-cliente": ASSETS.backgrounds.pages.areaCliente,
  "/depoimentos": ASSETS.backgrounds.pages.sobre,
};

export function getPageBackground(pathname: string): string | null {
  if (pathname === "/" || pathname === "") return null;
  return PAGE_BACKGROUNDS[pathname] ?? PAGE_BACKGROUNDS["/sobre"];
}
