export const BUSINESS_TYPES = [
  "apresentacao-comercial",
  "apresentacao-institucional",
  "portfolio",
  "proposta-comercial",
  "catalogo",
  "projeto-cliente",
  "landing-page",
  "personalizado",
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number];

export const BUSINESS_TEMPLATES = [
  "moderno",
  "corporativo",
  "minimalista",
  "premium",
  "imobiliario",
  "portfolio",
] as const;

export type BusinessTemplate = (typeof BUSINESS_TEMPLATES)[number];

export const BUSINESS_STATUSES = ["draft", "published", "archived"] as const;
export type BusinessStatus = (typeof BUSINESS_STATUSES)[number];

export const BUSINESS_VISIBILITIES = ["public", "unlisted", "private"] as const;
export type BusinessVisibility = (typeof BUSINESS_VISIBILITIES)[number];

export const BLOCK_TYPES = [
  "hero",
  "text",
  "image",
  "gallery",
  "video",
  "pdf",
  "cards",
  "stats",
  "testimonials",
  "timeline",
  "table",
  "pricing",
  "faq",
  "button",
  "cta",
  "contact",
  "form",
  "divider",
  "html",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export type BusinessBlock = {
  id: string;
  type: BlockType;
  hidden?: boolean;
  content: Record<string, unknown>;
};

export type BusinessDesign = {
  theme: "dark" | "light" | "custom";
  logo: string;
  favicon: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  font: string;
  radius: string;
  buttonStyle: "solid" | "outline";
  showHeader: boolean;
  showFooter: boolean;
};

export type BusinessSeo = {
  title: string;
  description: string;
  ogImage: string;
  robots: "index" | "noindex";
};

export type BusinessCompany = {
  id: string;
  name: string;
  tradeName: string;
  logo: string;
  description: string;
  site: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  linkedin: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type BusinessProject = {
  id: string;
  title: string;
  slug: string;
  description: string;
  companyId: string;
  cover: string;
  type: BusinessType;
  template: BusinessTemplate;
  status: BusinessStatus;
  visibility: BusinessVisibility;
  passwordHash: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  design: BusinessDesign;
  seo: BusinessSeo;
  blocks: BusinessBlock[];
};

export type BusinessVisit = {
  id: string;
  projectId: string;
  kind: "view" | "click" | "download" | "block";
  meta: Record<string, string>;
  createdAt: string;
};

export const DEFAULT_DESIGN: BusinessDesign = {
  theme: "dark",
  logo: "",
  favicon: "",
  primary: "#00d4ff",
  secondary: "#00a8cc",
  background: "#030508",
  text: "#ffffff",
  font: "system-ui",
  radius: "12px",
  buttonStyle: "solid",
  showHeader: true,
  showFooter: true,
};

export const TYPE_LABELS: Record<BusinessType, string> = {
  "apresentacao-comercial": "Apresentacao comercial",
  "apresentacao-institucional": "Apresentacao institucional",
  portfolio: "Portfolio",
  "proposta-comercial": "Proposta comercial",
  catalogo: "Catalogo",
  "projeto-cliente": "Projeto de cliente",
  "landing-page": "Landing page",
  personalizado: "Personalizado",
};

export const TEMPLATE_LABELS: Record<BusinessTemplate, string> = {
  moderno: "Moderno",
  corporativo: "Corporativo",
  minimalista: "Minimalista",
  premium: "Premium",
  imobiliario: "Imobiliario",
  portfolio: "Portfolio",
};

export const STATUS_LABELS: Record<BusinessStatus, string> = {
  draft: "Rascunho",
  published: "Publicado",
  archived: "Arquivado",
};

export const VISIBILITY_LABELS: Record<BusinessVisibility, string> = {
  public: "Publico",
  unlisted: "Nao listado",
  private: "Privado",
};

export const BLOCK_LABELS: Record<BlockType, string> = {
  hero: "Hero",
  text: "Texto",
  image: "Imagem",
  gallery: "Galeria",
  video: "Video",
  pdf: "PDF",
  cards: "Cards",
  stats: "Estatisticas",
  testimonials: "Depoimentos",
  timeline: "Cronograma",
  table: "Tabela",
  pricing: "Precos",
  faq: "FAQ",
  button: "Botao",
  cta: "Chamada",
  contact: "Contato",
  form: "Formulario",
  divider: "Separador",
  html: "HTML",
};
