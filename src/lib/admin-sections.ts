import type { SiteContent } from "@/types/site-content";

export const ADMIN_SECTIONS: { key: keyof SiteContent; label: string; hint?: string }[] = [
  { key: "seo", label: "SEO & redes sociais", hint: "título do site, descrição, Open Graph." },
  { key: "contact", label: "Contato rápido", hint: "WhatsApp e e-mail usados em botões." },
  { key: "nav", label: "Menu", hint: "links do cabeçalho." },
  { key: "hero", label: "Hero (início)", hint: "título principal e CTAs da capa." },
  { key: "home", label: "Seção inicial", hint: "cards abaixo do hero na home." },
  { key: "about", label: "Sobre", hint: "texto da página institucional." },
  { key: "services", label: "Serviços", hint: "blocos Digitação e tecnologia." },
  { key: "portfolio", label: "Portfólio", hint: "projetos e stacks." },
  { key: "differentials", label: "Diferenciais", hint: "blocos Por que a MDS." },
  { key: "trust", label: "Confiança", hint: "blocos Por que confiar (sem depoimentos fictícios)." },
  { key: "cta", label: "Banner CTA", hint: "faixa de chamada antes do rodapé." },
  { key: "contactPage", label: "Página Contato", hint: "textos do formulário e da página." },
  { key: "footer", label: "Rodapé", hint: "marca, links e redes." },
];
