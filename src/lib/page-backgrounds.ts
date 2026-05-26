/** Fundo fixo por rota (imagens em /public/bg). Home usa vídeo. */
export const PAGE_BACKGROUNDS: Record<string, string> = {
  "/sobre": "/bg/sobre.png",
  "/servicos": "/bg/servicos.png",
  "/portfolio": "/bg/projetos.png",
  "/contato": "/bg/contato.png",
  "/area-cliente": "/bg/area-cliente.png",
  "/depoimentos": "/bg/sobre.png",
};

export function getPageBackground(pathname: string): string | null {
  if (pathname === "/" || pathname === "") return null;
  return PAGE_BACKGROUNDS[pathname] ?? PAGE_BACKGROUNDS["/sobre"];
}
