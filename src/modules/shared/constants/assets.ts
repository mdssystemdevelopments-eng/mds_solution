/** Paths públicos — única fonte de verdade para assets em /public */
export const ASSETS = {
  logos: {
    main: "/logo-mds.png",
    animWebm: "/logo-anim.webm",
    animMp4: "/logo-anim.mp4",
  },
  icons: {
    favicon: "/favicon.svg",
  },
  backgrounds: {
    homeWallpaper: "/wallpaper-cyber-eye.png",
    pages: {
      sobre: "/bg/sobre.png",
      servicos: "/bg/servicos.png",
      portfolio: "/bg/projetos.png",
      contato: "/bg/contato.png",
      areaCliente: "/bg/area-cliente.png",
    },
  },
} as const;
