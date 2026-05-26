export const digitalServices = [
  {
    title: "Sites profissionais",
    description:
      "Site rápido, bonito e fácil de achar no Google. Ideal para quem quer passar credibilidade sem complicação.",
    benefits: [
      "Layout alinhado ao seu negócio",
      "Boa experiência no celular",
      "Base pensada para SEO",
    ],
  },
  {
    title: "Sistemas web sob medida",
    description:
      "Quando planilha e papel não dão mais conta. Fluxos de pedidos, cadastros e áreas restritas, do jeito que você trabalha.",
    benefits: [
      "Menos retrabalho no dia a dia",
      "Dados centralizados e seguros",
      "Evolu conforme o negócio cresce",
    ],
  },
  {
    title: "Automação de processos",
    description:
      "Tarefas repetidas viram rotina automática, com envio de e-mails, integrações entre ferramentas, alertas e lembretes.",
    benefits: [
      "Ganho de tempo da equipe",
      "Menos erro humano",
      "Processos previsíveis",
    ],
  },
  {
    title: "Dashboards e BI",
    description:
      "Indicadores claros em um só lugar, com vendas, estoque e financeiro. O que importa para decidir melhor.",
    benefits: [
      "Visão rápida do negócio",
      "Relatórios sob demanda",
      "Apoio à gestão",
    ],
  },
  {
    title: "Integrações entre sistemas",
    description:
      "ERP, CRM, e-commerce e gateways de pagamento. Faço os sistemas conversarem sem você copiar dado na mão.",
    benefits: [
      "Informação fluindo sozinha",
      "Menos planilha duplicada",
      "Operação mais integrada",
    ],
  },
  {
    title: "Consultoria em tecnologia",
    description:
      "Quando você não sabe por onde começar, ajudo com arquitetura, escolha de ferramentas, segurança básica e plano de implementação.",
    benefits: [
      "Decisão com menos risco",
      "Linguagem acessível",
      "Foco no que dá retorno",
    ],
  },
];

export const techServices = [
  {
    title: "Manutenção de computadores e notebooks",
    description:
      "Máquina lenta, barulho estranho, superaquecimento ou peça com defeito. Diagnóstico honesto e solução que faz sentido.",
    benefits: [
      "Equipamento estável para trabalhar",
      "Orientação clara do que custa o que",
      "Atendimento com explicação simples",
    ],
  },
  {
    title: "Formatação e instalação de sistemas",
    description:
      "Quando o Windows “travou de vez” ou você quer começar limpo, com drivers e programas essenciais organizados.",
    benefits: [
      "Sistema limpo e responsivo",
      "Backup orientado antes de mexer",
      "Básico de segurança já configurado",
    ],
  },
  {
    title: "Limpeza e otimização",
    description:
      "Poeira, pasta cheia, programas inúteis rodando em segundo plano. Às vezes só falta um cuidado técnico para voltar a voar.",
    benefits: [
      "Menos travamento no uso diário",
      "Ventilação e temperatura melhores",
      "Dicas práticas de uso",
    ],
  },
  {
    title: "Remoção de vírus e ameaças",
    description:
      "Anúncio chato, navegador redirecionando, pop-up suspeito. Limpeza focada em deixar o PC seguro de novo.",
    benefits: [
      "Malware e pups removidos com critério",
      "Navegação mais previsível",
      "Orientação para não repetir o problema",
    ],
  },
  {
    title: "Upgrade de hardware",
    description:
      "Mais RAM, SSD ou troca de disco. Indico o que realmente melhora a performance no seu caso, sem gasto inútil.",
    benefits: [
      "Investimento proporcional ao ganho",
      "Compatibilidade checada antes",
      "Instalação e testes feitos direito",
    ],
  },
  {
    title: "Suporte técnico para empresas",
    description:
      "Pequenas e médias empresas que precisam de alguém para manter máquinas, rede básica e rotinas do dia a dia.",
    benefits: [
      "Menos parada na operação",
      "Canal direto para emergências",
      "Atendimento com prioridade",
    ],
  },
  {
    title: "Atendimento para pessoas físicas",
    description:
      "Você em casa ou no escritório, precisando de alguém que explique sem arrogância e resolva sem enrolação.",
    benefits: [
      "Sem “linguagem de TI” forçada",
      "Orçamento antes de autorizar serviço",
      "Respeito ao seu tempo e ao seu equipamento",
    ],
  },
];

export const portfolioItems = [
  {
    name: "ERP Empresarial",
    client: "Segmento de distribuição e varejo",
    category: "erp" as const,
    description:
      "Sistema de gestão com vendas, estoque, financeiro, NF-e e relatórios gerenciais. Dashboard em tempo real.",
    stack: ["Next.js", "PostgreSQL", "Node.js", "NF-e"],
    image: "/projects/nexus-erp.png",
    year: "2025",
    stats: { users: "Multi-usuário", modules: "8 módulos" },
    features: ["Multi-filial", "Emissão NF-e", "BI integrado"],
  },
  {
    name: "App de Agendamento",
    client: "Segmento de saúde e clínicas",
    category: "app" as const,
    description:
      "Aplicativo de agendamento com confirmação automática, prontuário simplificado e painel administrativo.",
    stack: ["React Native", "Firebase", "API REST"],
    image: "/projects/vitamed.png",
    year: "2025",
    stats: { users: "iOS + Android", modules: "Agenda + Admin" },
    features: ["Notificações", "Teleconsulta", "LGPD"],
  },
  {
    name: "Portal Imobiliário",
    client: "Segmento do mercado imobiliário",
    category: "site" as const,
    description:
      "Portal com busca avançada, tour virtual, integração com portais parceiros e CRM de leads.",
    stack: ["Next.js", "Tailwind", "Mapbox", "SEO"],
    image: "/projects/horizonte.png",
    year: "2024",
    stats: { users: "Alto tráfego", modules: "Catálogo + CRM" },
    features: ["Tour virtual", "CRM leads", "SEO local"],
  },
  {
    name: "Controle de Estoque",
    client: "Segmento de logística",
    category: "sistema" as const,
    description:
      "Dashboard de estoque com alertas inteligentes, código de barras, integração com fornecedores e relatórios.",
    stack: ["React", "Python", "PostgreSQL", "Redis"],
    image: "/projects/stockflow.png",
    year: "2025",
    stats: { users: "Multi-depósito", modules: "5+ depósitos" },
    features: ["Alertas automáticos", "Código de barras", "API aberta"],
  },
  {
    name: "Gestão para Restaurantes",
    client: "Segmento de food service",
    category: "app" as const,
    description:
      "Cardápio digital, pedidos via QR Code, painel de cozinha em tempo real e gestão de mesas.",
    stack: ["PWA", "Node.js", "WebSocket", "PostgreSQL"],
    image: "/projects/restaupro.png",
    year: "2024",
    stats: { users: "Multi-unidade", modules: "Pedidos + Cozinha" },
    features: ["QR Code", "KDS cozinha", "Relatórios"],
  },
  {
    name: "Portal Educacional",
    client: "Segmento de educação",
    category: "site" as const,
    description:
      "Matrículas online, área do aluno, boletim digital, comunicados e biblioteca virtual.",
    stack: ["Next.js", "Prisma", "PostgreSQL", "Auth"],
    image: "/projects/educonnect.png",
    year: "2025",
    stats: { users: "Escala média", modules: "Portal completo" },
    features: ["Matrícula online", "Boletim digital", "Biblioteca"],
  },
  {
    name: "Painel Financeiro BI",
    client: "Segmento de finanças",
    category: "sistema" as const,
    description:
      "Business intelligence com gráficos interativos, projeções, DRE automatizado e exportação contábil.",
    stack: ["React", "D3.js", "Python", "Power BI"],
    image: "/projects/fintrack.png",
    year: "2024",
    stats: { users: "Gestores", modules: "12+ indicadores" },
    features: ["DRE automático", "Projeções", "Multi-empresa"],
  },
  {
    name: "ERP para Oficinas",
    client: "Segmento de serviços automotivos",
    category: "erp" as const,
    description:
      "Ordens de serviço, controle de peças, histórico por veículo, orçamentos e integração WhatsApp.",
    stack: ["Vue.js", "Laravel", "MySQL", "WhatsApp API"],
    image: "/projects/autoservice.png",
    year: "2025",
    stats: { users: "Equipe técnica", modules: "OS + Estoque" },
    features: ["Histórico veículo", "Orçamento PDF", "WhatsApp"],
  },
];

export const categoryLabels: Record<string, string> = {
  site: "Site Web",
  erp: "Sistema ERP",
  sistema: "Sistema Web",
  app: "Aplicativo",
};
