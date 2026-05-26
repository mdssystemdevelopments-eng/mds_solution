import type { SiteContent } from "@/types/site-content";

export type AdminSectionId =
  | keyof SiteContent
  | "ui.homeServices"
  | "ui.homeProcess"
  | "ui.homeCta"
  | "ui.homeFeatured";

export type AdminPageDef = {
  id: string;
  label: string;
  previewPath: string;
  description: string;
  sections: { id: AdminSectionId; label: string; hint: string }[];
};

export const ADMIN_PAGES: AdminPageDef[] = [
  {
    id: "global",
    label: "Global",
    previewPath: "/",
    description: "Menu, SEO, contatos e rodapé — aparecem em todo o site.",
    sections: [
      { id: "seo", label: "SEO", hint: "Título, descrição e palavras-chave para Google." },
      { id: "nav", label: "Menu", hint: "Links do cabeçalho." },
      { id: "contact", label: "WhatsApp & E-mail", hint: "Contatos usados nos botões flutuantes." },
      { id: "footer", label: "Rodapé", hint: "Marca, links e redes sociais." },
    ],
  },
  {
    id: "home",
    label: "Página Início",
    previewPath: "/",
    description: "Capa, cards, serviços em destaque e chamadas da home.",
    sections: [
      { id: "hero", label: "Capa (Hero)", hint: "Título principal, botões e card lateral." },
      { id: "home", label: "Cards de navegação", hint: "Containers com link, título, texto e botão." },
      { id: "ui.homeServices", label: "Bloco serviços", hint: "Cards de serviços na home." },
      { id: "ui.homeProcess", label: "Como funciona", hint: "Passos do processo." },
      { id: "ui.homeFeatured", label: "Projetos em destaque", hint: "Título e link para portfólio." },
      { id: "ui.homeCta", label: "Chamada final", hint: "Faixa de CTA antes do rodapé." },
      { id: "cta", label: "Banner CTA", hint: "Banner de WhatsApp." },
    ],
  },
  {
    id: "sobre",
    label: "Página Sobre",
    previewPath: "/sobre",
    description: "Textos institucionais da página Sobre.",
    sections: [
      { id: "about", label: "Conteúdo Sobre", hint: "Título, parágrafos e destaque." },
      { id: "differentials", label: "Diferenciais", hint: "Cards com título e texto." },
      { id: "trust", label: "Confiança", hint: "Cards de credibilidade." },
    ],
  },
  {
    id: "servicos",
    label: "Página Serviços",
    previewPath: "/servicos",
    description: "Listas de serviços digitais e assistência técnica.",
    sections: [{ id: "services", label: "Serviços", hint: "Títulos, emojis e listas de serviços." }],
  },
  {
    id: "portfolio",
    label: "Página Projetos",
    previewPath: "/portfolio",
    description: "Projetos e cases do portfólio.",
    sections: [{ id: "portfolio", label: "Portfólio", hint: "Cards de projetos com imagem e stack." }],
  },
  {
    id: "contato",
    label: "Página Contato",
    previewPath: "/contato",
    description: "Textos do formulário e da página de contato.",
    sections: [{ id: "contactPage", label: "Formulário & textos", hint: "Labels, placeholders e mensagens." }],
  },
];

export function getAdminPage(id: string): AdminPageDef | undefined {
  return ADMIN_PAGES.find((p) => p.id === id);
}
