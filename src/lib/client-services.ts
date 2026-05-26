export type ClientServiceCategory = "web" | "sistema" | "app" | "tecnico" | "consultoria";

export type ClientService = {
  id: string;
  title: string;
  description: string;
  category: ClientServiceCategory;
  priceHint?: string;
};

export const clientServiceCategories: Record<
  ClientServiceCategory,
  { label: string; emoji: string }
> = {
  web: { label: "Sites & Web", emoji: "🌐" },
  sistema: { label: "Sistemas & ERP", emoji: "⚙️" },
  app: { label: "Aplicativos", emoji: "📱" },
  tecnico: { label: "Assistência Técnica", emoji: "🛠️" },
  consultoria: { label: "Consultoria", emoji: "💡" },
};

export const allClientServices: ClientService[] = [
  // Sites & Web
  {
    id: "site-institucional",
    title: "Site institucional",
    description: "Presença profissional com páginas sobre, serviços, contato e SEO básico.",
    category: "web",
    priceHint: "A partir de R$ 1.500",
  },
  {
    id: "landing-page",
    title: "Landing page de conversão",
    description: "Página focada em captar leads, campanhas e lançamentos.",
    category: "web",
    priceHint: "A partir de R$ 800",
  },
  {
    id: "ecommerce",
    title: "Loja virtual / E-commerce",
    description: "Catálogo, carrinho, pagamento e gestão de pedidos online.",
    category: "web",
    priceHint: "Sob consulta",
  },
  {
    id: "blog-portal",
    title: "Blog ou portal de conteúdo",
    description: "Publicação de artigos, categorias, busca e área administrativa.",
    category: "web",
  },
  {
    id: "site-responsivo",
    title: "Redesign / site responsivo",
    description: "Modernização de site existente com foco em mobile e performance.",
    category: "web",
  },
  {
    id: "seo-local",
    title: "SEO local e Google Meu Negócio",
    description: "Otimização para aparecer nas buscas da sua região.",
    category: "web",
  },
  // Sistemas & ERP
  {
    id: "erp-completo",
    title: "ERP completo sob medida",
    description: "Gestão de vendas, estoque, financeiro, NF-e e relatórios integrados.",
    category: "sistema",
    priceHint: "Sob consulta",
  },
  {
    id: "crm-vendas",
    title: "CRM de vendas e clientes",
    description: "Funil comercial, histórico de contatos, propostas e follow-up.",
    category: "sistema",
  },
  {
    id: "sistema-agendamento",
    title: "Sistema de agendamento online",
    description: "Calendário, confirmações, lembretes e painel administrativo.",
    category: "sistema",
  },
  {
    id: "controle-estoque",
    title: "Controle de estoque e inventário",
    description: "Entrada/saída, alertas de reposição, código de barras e relatórios.",
    category: "sistema",
  },
  {
    id: "dashboard-bi",
    title: "Dashboard / BI gerencial",
    description: "Indicadores em tempo real, gráficos e exportação de relatórios.",
    category: "sistema",
  },
  {
    id: "automacao-processos",
    title: "Automação de processos",
    description: "Fluxos automáticos, integrações e eliminação de tarefas manuais.",
    category: "sistema",
  },
  {
    id: "integracao-sistemas",
    title: "Integração entre sistemas",
    description: "Conectar ERP, CRM, e-commerce, gateways e APIs externas.",
    category: "sistema",
  },
  {
    id: "portal-rh",
    title: "Portal RH / gestão de equipe",
    description: "Ponto, férias, documentos, holerites e comunicação interna.",
    category: "sistema",
  },
  // Apps
  {
    id: "app-android-ios",
    title: "Aplicativo Android / iOS",
    description: "App nativo ou híbrido publicado nas lojas oficiais.",
    category: "app",
    priceHint: "Sob consulta",
  },
  {
    id: "app-pwa",
    title: "PWA (app web instalável)",
    description: "Funciona como app no celular sem precisar de loja.",
    category: "app",
  },
  {
    id: "app-delivery",
    title: "App de delivery / pedidos",
    description: "Cardápio digital, pedidos em tempo real e painel do estabelecimento.",
    category: "app",
  },
  {
    id: "app-field-service",
    title: "App para equipe de campo",
    description: "Ordens de serviço, check-in, fotos e sincronização offline.",
    category: "app",
  },
  // Assistência técnica
  {
    id: "manutencao-pc",
    title: "Manutenção de computadores",
    description: "Diagnóstico, limpeza, troca de peças e otimização.",
    category: "tecnico",
  },
  {
    id: "formatacao",
    title: "Formatação e instalação",
    description: "Windows limpo, drivers, programas essenciais e backup orientado.",
    category: "tecnico",
  },
  {
    id: "remocao-virus",
    title: "Remoção de vírus e malware",
    description: "Limpeza completa e orientação de segurança.",
    category: "tecnico",
  },
  {
    id: "upgrade-hardware",
    title: "Upgrade de hardware (SSD, RAM)",
    description: "Análise de compatibilidade, instalação e testes.",
    category: "tecnico",
  },
  {
    id: "suporte-empresas",
    title: "Suporte técnico empresarial",
    description: "Contrato mensal para manutenção preventiva e suporte remoto.",
    category: "tecnico",
  },
  {
    id: "rede-infra",
    title: "Rede e infraestrutura básica",
    description: "Configuração de roteadores, impressoras em rede e compartilhamento.",
    category: "tecnico",
  },
  // Consultoria
  {
    id: "consultoria-ti",
    title: "Consultoria em tecnologia",
    description: "Arquitetura, escolha de ferramentas e planejamento de projetos.",
    category: "consultoria",
  },
  {
    id: "auditoria-sistemas",
    title: "Auditoria de sistemas existentes",
    description: "Análise de performance, segurança e oportunidades de melhoria.",
    category: "consultoria",
  },
  {
    id: "migracao-dados",
    title: "Migração de dados",
    description: "Transferência segura entre sistemas, planilhas ou bancos de dados.",
    category: "consultoria",
  },
];
