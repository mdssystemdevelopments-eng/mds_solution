export type ServiceItem = {
  title: string;
  description: string;
  benefits: string[];
};

export type PortfolioItem = {
  name: string;
  client: string;
  category: "site" | "erp" | "sistema" | "app";
  description: string;
  image: string;
  images?: string[];
  stack: string[];
  year: string;
  stats: { users: string; modules: string };
  features: string[];
};

export type NavItem = { href: string; label: string };

export type TrustItem = { icon: string; title: string; text: string };

export type DifferentialItem = { title: string; text: string };

export type HomeCard = { href: string; title: string; description: string; cta: string };

export type ClientServiceCategoryKey = "web" | "sistema" | "app" | "tecnico" | "consultoria";

export type ClientServiceEntry = {
  id: string;
  title: string;
  description: string;
  category: ClientServiceCategoryKey;
  priceHint?: string;
};

export type SiteUiContent = {
  skipToContent: string;
  loader: { kicker: string; name: string; hint: string };
  scrollTop: string;
  nav: {
    openMenu: string;
    closeMenu: string;
    brandAria: string;
    languageLabel: string;
    chooseLanguage: string;
  };
  homeServices: {
    eyebrow: string;
    title: string;
    lead: string;
    learnMore: string;
    close: string;
    items: { title: string; desc: string; details?: string; points?: string[]; href?: string }[];
  };
  homeProcess: {
    eyebrow: string;
    title: string;
    steps: { title: string; text: string }[];
  };
  homeCta: {
    eyebrow: string;
    title: string;
    lead: string;
    clientArea: string;
    contact: string;
  };
  homeFeatured: {
    eyebrow: string;
    title: string;
    lead: string;
    viewAll: string;
  };
  portfolio: { filterAll: string };
  clientQuote: {
    eyebrow: string;
    title: string;
    lead: string;
    catalogTitle: string;
    catalogHint: string;
    tabAll: string;
    tabAllServices: string;
    showingPrefix: string;
    itemsSuffix: string;
    emptyCategory: string;
    selectedTitle: string;
    selectedEmpty: string;
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    urgencyLabel: string;
    urgencyNormal: string;
    urgencyUrgent: string;
    urgencyFlexible: string;
    budgetLabel: string;
    budgetPlaceholder: string;
    detailsLabel: string;
    detailsPlaceholder: string;
    sendWhatsapp: string;
    sendEmail: string;
    validationHint: string;
    sentWhatsapp: string;
    sentEmail: string;
    removeService: string;
  };
  clientServiceCategories: Record<ClientServiceCategoryKey, { label: string; emoji: string }>;
  clientServices: ClientServiceEntry[];
  categoryLabels: Record<string, string>;
};

export type SiteContent = {
  seo: {
    siteTitle: string;
    siteDescription: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
    organizationName: string;
    jsonLdDescription: string;
    knowsAbout: string[];
  };
  contact: {
    whatsappNumber: string;
    whatsappDefaultMessage: string;
    email: string;
  };
  nav: NavItem[];
  media: {
    logo: string;
    favicon: string;
    homeWallpaper: string;
    backgrounds: {
      sobre: string;
      servicos: string;
      portfolio: string;
      contato: string;
      areaCliente: string;
    };
  };
  hero: {
    badge: string;
    headlineBefore: string;
    headlineAccent: string;
    headlineAfter: string;
    subheadline: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    cardSummaryLabel: string;
    cardYear: string;
    cardBullets: string[];
    cardFooterKicker: string;
    cardFooterText: string;
    stats: { value: string; label: string }[];
  };
  home: {
    sectionKicker: string;
    sectionTitle: string;
    sectionSubtitle: string;
    cards: HomeCard[];
  };
  about: {
    sectionKicker: string;
    title: string;
    paragraphs: string[];
    highlight: string;
  };
  services: {
    sectionKicker: string;
    title: string;
    subtitle: string;
    digitalEmoji: string;
    digitalTitle: string;
    techEmoji: string;
    techTitle: string;
    techIntro: string;
    digital: ServiceItem[];
    tech: ServiceItem[];
    request: {
      cta: string;
      title: string;
      lead: string;
      nameLabel: string;
      emailLabel: string;
      phoneLabel: string;
      detailsLabel: string;
      detailsPlaceholder: string;
      submit: string;
      cancel: string;
      validation: string;
    };
  };
  portfolio: {
    sectionKicker: string;
    title: string;
    subtitle: string;
    items: PortfolioItem[];
  };
  differentials: {
    sectionKicker: string;
    title: string;
    items: DifferentialItem[];
  };
  trust: {
    sectionKicker: string;
    title: string;
    subtitle: string;
    items: TrustItem[];
  };
  cta: {
    title: string;
    text: string;
    buttonText: string;
  };
  contactPage: {
    sectionKicker: string;
    title: string;
    intro: string;
    whatsappTitle: string;
    whatsappSubtitle: string;
    emailCardLabel: string;
    formNameLabel: string;
    formNamePlaceholder: string;
    formEmailLabel: string;
    formEmailPlaceholder: string;
    formMessageLabel: string;
    formMessagePlaceholder: string;
    formSubmit: string;
    formSubmitting: string;
    successHint: string;
    errorHint: string;
  };
  footer: {
    brand: string;
    tagline: string;
    copyrightYear: string;
    copyrightName: string;
    quickLinksLabel: string;
    contactLabel: string;
    socialsLabel: string;
    whatsappLabel: string;
    socials: { href: string; label: string }[];
  };
  trustBadges: {
    title: string;
    items: { title: string; text: string }[];
  };
  ui: SiteUiContent;
};
