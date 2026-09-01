import type { SiteUiContent } from "@/types/site-content";
import { allClientServices, clientServiceCategories } from "@/lib/client-services";
import { categoryLabels } from "@/lib/content";

export const defaultUiContent: SiteUiContent = {
  skipToContent: "Pular para o conteúdo",
  loader: {
    kicker: "INICIALIZANDO",
    name: "MDS SOLUÇÕES",
    hint: "Carregando interface…",
  },
  scrollTop: "Voltar ao topo",
  nav: {
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    brandAria: "MDS Soluções em Tecnologia, início",
    languageLabel: "Idioma do site",
    chooseLanguage: "Escolher idioma",
  },
  homeServices: {
    eyebrow: "Serviços",
    title: "Tudo que sua empresa precisa em tecnologia",
    lead: "Do site ao ERP, com código sob medida e suporte próximo.",
    learnMore: "Saiba mais",
    close: "Fechar",
    items: [
      {
        title: "Desenvolvimento Web",
        desc: "Sites, landing pages e portais com performance e SEO.",
        details:
          "Criamos sites institucionais, landing pages e portais sob medida para o seu negócio. O foco é um visual profissional, carregamento rápido e boa posição no Google, no celular e no computador.",
        points: [
          "Layout alinhado à identidade da empresa",
          "Performance e experiência no celular",
          "Base técnica pensada para SEO",
          "Formulários, WhatsApp e integrações",
        ],
      },
      {
        title: "Sistemas & ERP",
        desc: "Gestão de vendas, estoque, financeiro e integrações.",
        details:
          "Quando planilha e papel não dão mais conta, montamos um sistema com os fluxos reais da sua operação: vendas, estoque, financeiro, cadastros e área restrita, do jeito que você trabalha.",
        points: [
          "Gestão de vendas, estoque e financeiro",
          "Dados centralizados e com acesso controlado",
          "Integração com ERP, CRM e pagamentos",
          "Menos retrabalho e menos erro manual",
        ],
      },
      {
        title: "Aplicativos",
        desc: "Apps mobile e PWAs conectados ao seu negócio.",
        details:
          "Desenvolvemos aplicativos mobile e PWAs para clientes, equipe ou operação interna. O app conversa com o seu sistema, com login, notificações e fluxos pensados para o dia a dia.",
        points: [
          "App nativo ou PWA, conforme o caso",
          "Conectado ao sistema e aos dados da empresa",
          "Login, notificações e área do usuário",
          "Publicação e evolução contínua",
        ],
      },
      {
        title: "Assistência Técnica",
        desc: "Infraestrutura, manutenção e suporte empresarial.",
        details:
          "Cuidamos da parte física e da operação do dia a dia: computadores lentos, rede instável, vírus, formatação e suporte para empresas que precisam de alguém estável para não parar o trabalho.",
        points: [
          "Manutenção de computadores e notebooks",
          "Formatação, limpeza e otimização",
          "Remoção de vírus e ameaças",
          "Suporte técnico para empresas",
        ],
      },
    ],
  },
  homeProcess: {
    eyebrow: "Como trabalhamos",
    title: "Do primeiro contato à entrega",
    steps: [
      { title: "Briefing", text: "Escopo, stack e prazos alinhados com você." },
      { title: "Proposta", text: "Orçamento claro com entregas e cronograma." },
      { title: "Desenvolvimento", text: "Código versionado e entregas por etapa." },
      { title: "Suporte", text: "Monitoramento e evolução contínua." },
    ],
  },
  homeCta: {
    eyebrow: "Próximo passo",
    title: "Pronto para começar?",
    lead: "Monte seu orçamento online ou fale com nosso time.",
    clientArea: "Área do Cliente",
    contact: "Contato",
  },
  homeFeatured: {
    eyebrow: "Portfólio",
    title: "Projetos em produção",
    lead: "Interfaces e sistemas reais por segmento.",
    viewAll: "Ver todos",
  },
  portfolio: {
    filterAll: "Todos",
  },
  clientQuote: {
    eyebrow: "Área do Cliente",
    title: "Monte seu orçamento",
    lead:
      'Escolha uma categoria para ver o catálogo. Marque os serviços e eles aparecem em "Produtos selecionados" ao lado.',
    catalogTitle: "Catálogo",
    catalogHint: "Clique em uma aba para exibir os serviços.",
    tabAll: "Todos",
    tabAllServices: "Todos os serviços",
    showingPrefix: "Exibindo:",
    itemsSuffix: "itens",
    emptyCategory: "Nenhum serviço nesta categoria.",
    selectedTitle: "Produtos selecionados",
    selectedEmpty: "Nenhum serviço ainda. Abra uma categoria e marque os itens desejados.",
    formTitle: "Seus dados",
    nameLabel: "Nome *",
    namePlaceholder: "Seu nome",
    emailLabel: "E-mail *",
    emailPlaceholder: "seu@email.com",
    phoneLabel: "Telefone",
    phonePlaceholder: "(17) 99999-9999",
    companyLabel: "Empresa",
    companyPlaceholder: "Opcional",
    urgencyLabel: "Urgência",
    urgencyNormal: "Normal (2 a 4 semanas)",
    urgencyUrgent: "Urgente",
    urgencyFlexible: "Flexível",
    budgetLabel: "Orçamento (opcional)",
    budgetPlaceholder: "Ex: até R$ 5.000",
    detailsLabel: "Detalhes do projeto",
    detailsPlaceholder: "Descreva o projeto...",
    sendWhatsapp: "Enviar pelo WhatsApp",
    sendEmail: "Enviar por e-mail",
    validationHint: "Selecione ao menos um serviço e preencha nome e e-mail válido.",
    sentWhatsapp: "WhatsApp aberto!",
    sentEmail: "E-mail aberto!",
    removeService: "Remover",
  },
  clientServiceCategories,
  clientServices: allClientServices,
  categoryLabels,
};
