import type { SiteContent } from "@/types/site-content";
import { digitalServices, portfolioItems, techServices } from "@/lib/content";
import { defaultUiContent } from "@/lib/default-ui";

export const defaultSiteContent: SiteContent = {
  seo: {
    siteTitle: "MDS Soluções em Tecnologia | Sites, sistemas e assistência técnica",
    siteDescription:
      "Desenvolvimento de sites e sistemas, automação, dashboards e assistência técnica para empresas e pessoas. Atendimento próximo e soluções que resolvem de verdade.",
    keywords: [
      "desenvolvimento de sites",
      "sistemas web",
      "automação",
      "assistência técnica",
      "manutenção de computador",
      "suporte empresas",
      "MDS Soluções",
    ],
    ogTitle: "MDS Soluções em Tecnologia",
    ogDescription:
      "Soluções em tecnologia que realmente resolvem, do digital à automação e ao suporte técnico, com experiência prática.",
    organizationName: "MDS Soluções em Tecnologia",
    jsonLdDescription:
      "Desenvolvimento de sites e sistemas web, automação, dashboards, integrações e assistência técnica para empresas e pessoas.",
    knowsAbout: [
      "Desenvolvimento web",
      "Automação de processos",
      "Assistência técnica em informática",
      "Suporte técnico empresarial",
    ],
  },
  contact: {
    whatsappNumber: "5517996604289",
    whatsappDefaultMessage:
      "Olá! Vim pelo site da MDS Soluções em Tecnologia e gostaria de conversar sobre um serviço.",
    email: "mdssystem@outlook.com.br",
  },
  nav: [
    { href: "/", label: "Início" },
    { href: "/sobre", label: "Sobre" },
    { href: "/servicos", label: "Serviços" },
    { href: "/portfolio", label: "Projetos" },
    { href: "/contato", label: "Contato" },
    { href: "/area-cliente", label: "Área do Cliente" },
  ],
  hero: {
    badge: "</MDS Soluções em Tecnologia>",
    headlineBefore: "Engenharia digital para",
    headlineAccent: "quem constrói o futuro",
    headlineAfter: "",
    subheadline:
      "Sites, ERPs, apps e infraestrutura com código sob medida, deploy em produção e suporte contínuo.",
    primaryCtaLabel: "Solicitar orçamento",
    primaryCtaHref: "/area-cliente",
    secondaryCtaLabel: "Falar no WhatsApp",
    cardSummaryLabel: "Nossos serviços",
    cardYear: "2026",
    cardBullets: [
      "Sites e landing pages profissionais",
      "Sistemas ERP e automação sob medida",
      "Apps Android/iOS e assistência técnica",
    ],
    cardFooterKicker: "Atendimento",
    cardFooterText: "Resposta rápida, orçamento transparente e suporte contínuo.",
    stats: [
      { value: "29+", label: "Projetos entregues" },
      { value: "91+", label: "Serviços" },
      { value: "100%", label: "Atendimento direto" },
      { value: "24h", label: "Resposta WhatsApp" },
    ],
  },
  media: {
    logo: "/logo-mds.png",
    favicon: "/favicon.svg",
    homeWallpaper: "/wallpaper-cyber-eye.png",
    backgrounds: {
      sobre: "/bg/sobre.png",
      servicos: "/bg/servicos.png",
      portfolio: "/bg/projetos.png",
      contato: "/bg/contato.png",
      areaCliente: "/bg/area-cliente.png",
    },
  },
  home: {
    sectionKicker: "Navegação",
    sectionTitle: "O que você procura?",
    sectionSubtitle: "Cada assunto numa página, mais fácil de achar e de ler com calma.",
    cards: [
      {
        href: "/area-cliente",
        title: "Solicitar orçamento",
        description: "Selecione os serviços que precisa, descreva seu projeto e envie direto pelo WhatsApp ou e-mail, já formatado.",
        cta: "Montar orçamento",
      },
      {
        href: "/servicos",
        title: "Serviços",
        description: "Sites, sistemas ERP, apps, automação, dashboards, integrações e assistência técnica completa.",
        cta: "Ver serviços",
      },
      {
        href: "/portfolio",
        title: "Projetos",
        description: "ERP, apps, portais e sistemas web. Exemplos reais de entregas que demonstram nossa capacidade.",
        cta: "Ver projetos",
      },
      {
        href: "/contato",
        title: "Contato direto",
        description: "WhatsApp, e-mail ou formulário. Escolha o canal mais rápido para você.",
        cta: "Falar comigo",
      },
    ],
  },
  about: {
    sectionKicker: "Sobre",
    title: "Quem está por trás da MDS",
    paragraphs: [
      "Comecei atendendo por conta própria, vizinho, amigo de amigo, pequeno comércio da região. No começo era coisa simples, computador travando, internet instável, aquela instalação que ninguém queria fazer no fim de semana.",
      "Com o tempo fui pegando um leque maior de serviço, manutenção de verdade, montagem, formatação sem medo de perder arquivo importante, e depois os primeiros sites e automações para quem precisava sair do papel e da planilha maluca.",
      "O que não mudou foi o foco em entender o que está te atrapalhando hoje e resolver de um jeito que faça sentido no bolso e no dia a dia, sem empurrar solução cara só porque é moda.",
      "Em 2026 organizei tudo sob o nome MDS Soluções em Tecnologia para atender melhor empresas e projetos mais estruturados, mantendo o mesmo jeito direto de conversar com gente.",
    ],
    highlight:
      "Hoje junto experiência de quem já viu de tudo um pouco na bancada com as ferramentas atuais de desenvolvimento e integração. Mão na massa e tecnologia de verdade, não só apresentação bonita.",
  },
  services: {
    sectionKicker: "Serviços",
    title: "O que posso fazer por você",
    subtitle:
      "Do digital ao conserto na sua mesa, tudo explicado com clareza e com escopo e prazo combinados antes de começar.",
    digitalEmoji: "",
    digitalTitle: "Serviços digitais",
    techEmoji: "",
    techTitle: "Assistência técnica",
    techIntro:
      "Se o seu problema é hardware, sistema lento ou vírus chato, chama. Atendo pessoa física e também empresas que precisam de alguém estável para o dia a dia.",
    digital: digitalServices,
    tech: techServices,
    request: {
      cta: "Solicitar serviço",
      title: "Solicitar este serviço",
      lead: "Informe seus dados e o que precisa. Depois disso a mensagem é enviada.",
      nameLabel: "Nome",
      emailLabel: "E-mail",
      phoneLabel: "Telefone",
      detailsLabel: "Detalhes do pedido",
      detailsPlaceholder: "Descreva o que precisa neste serviço, prazo e contexto.",
      submit: "Enviar pelo WhatsApp",
      cancel: "Cancelar",
      validation: "Preencha o nome e o e-mail ou o telefone.",
    },
  },
  portfolio: {
    sectionKicker: "Portfólio",
    title: "Demonstrações por segmento",
    subtitle:
      "Interfaces e sistemas desenvolvidos pela MDS, projetos demonstrativos por área de atuação, sem vínculo com empresas reais.",
    items: portfolioItems,
  },
  differentials: {
    sectionKicker: "Por que contratar",
    title: "Diferenciais que fazem diferença no seu bolso e na sua paz",
    items: [
      {
        title: "Atendimento próximo e rápido",
        text: "Resposta em tempo humano, sem sumir depois do orçamento. Prioridade para quem está com problema travando o trabalho.",
      },
      {
        title: "Anos na prática, não só em teoria",
        text: "Já vi notebook na banca cheirando queimado e sistema de venda travando na hora do pico. Experiência de rua conta.",
      },
      {
        title: "Solução sob medida",
        text: "Não empacoto todo mundo no mesmo produto. O que importa é o seu fluxo, seu orçamento e o que vai durar.",
      },
      {
        title: "Transparência",
        text: "Se não vale a pena trocar peça, eu falo. Se dá para resolver com ajuste simples, não vendo pacote caro.",
      },
      {
        title: "Foco no problema de verdade",
        text: "Às vezes o que dói não é o sintoma que você vê primeiro. Eu gosto de ir na causa para não virar remendo infinito.",
      },
    ],
  },
  trust: {
    sectionKicker: "Por que confiar",
    title: "Transparência e compromisso com resultado",
    subtitle:
      "Sem depoimentos inventados. Preferimos mostrar como trabalhamos e o que você pode esperar ao contratar a MDS.",
    items: [
      {
        icon: "budget",
        title: "Orçamento detalhado antes de começar",
        text: "Você recebe escopo, prazo e valor definidos por escrito. Sem surpresas no meio do caminho.",
      },
      {
        icon: "shield",
        title: "Seus dados protegidos",
        text: "Boas práticas de segurança, backups e conformidade com LGPD em todos os projetos digitais.",
      },
      {
        icon: "zap",
        title: "Resposta em tempo humano",
        text: "WhatsApp e e-mail com retorno rápido. Urgência técnica tem prioridade e não some depois do orçamento.",
      },
      {
        icon: "support",
        title: "Suporte pós-entrega",
        text: "Projeto entregue não significa abandono. Manutenção, ajustes e evolução conforme seu negócio cresce.",
      },
      {
        icon: "chat",
        title: "Comunicação clara, sem jargão",
        text: "Explico em linguagem acessível. Você entende o que está sendo feito e por quê.",
      },
      {
        icon: "verified",
        title: "Experiência prática comprovada",
        text: "Anos na bancada e no desenvolvimento. Projetos reais entregues. Veja no portfólio.",
      },
    ],
  },
  cta: {
    title: "Precisa de ajuda com tecnologia?",
    text: "Seja um site, um sistema ou manutenção no equipamento, me chama no WhatsApp que a gente alinha o melhor caminho.",
    buttonText: "Chamar no WhatsApp agora",
  },
  contactPage: {
    sectionKicker: "Contato",
    title: "Manda uma mensagem",
    intro:
      "Explica em poucas linhas o que precisa. Se for urgente, o WhatsApp costuma ser mais rápido no mesmo dia.",
    whatsappTitle: "WhatsApp",
    whatsappSubtitle: "Atendimento direto",
    emailCardLabel: "E-mail",
    formNameLabel: "Nome",
    formNamePlaceholder: "Como você quer ser chamado",
    formEmailLabel: "E-mail",
    formEmailPlaceholder: "seu@email.com",
    formMessageLabel: "Mensagem",
    formMessagePlaceholder: "Conte o problema ou a ideia do projeto...",
    formSubmit: "Enviar mensagem",
    formSubmitting: "Enviando…",
    successHint:
      "Mensagem registrada. Se precisar de resposta urgente, use o WhatsApp. Costumo responder mais rápido por lá.",
    errorHint: "Não foi possível enviar agora. Tente o WhatsApp ou o e-mail direto.",
  },
  footer: {
    brand: "MDS Soluções em Tecnologia",
    tagline: "Desenvolvimento, automação e assistência técnica com conversa franca e entrega séria.",
    copyrightYear: "2025",
    copyrightName: "MDS Soluções em Tecnologia",
    quickLinksLabel: "Links rápidos",
    contactLabel: "Contato",
    socialsLabel: "Redes",
    whatsappLabel: "WhatsApp",
    socials: [
      { href: "https://www.linkedin.com", label: "LinkedIn" },
      { href: "https://www.instagram.com", label: "Instagram" },
    ],
  },
  trustBadges: {
    title: "Segurança do site",
    items: [
      {
        title: "Conexão protegida",
        text: "Tráfego do site sob HTTPS quando publicado em domínio com certificado válido.",
      },
      {
        title: "LGPD",
        text: "Dados do formulário usados só para responder o pedido. Sem venda de lista.",
      },
      {
        title: "Painel restrito",
        text: "Área administrativa exige login. Sem acesso público a edição de conteúdo.",
      },
      {
        title: "Envio consciente",
        text: "Solicitação de serviço só segue depois que você confirma os dados no formulário.",
      },
    ],
  },
  ui: defaultUiContent,
};
