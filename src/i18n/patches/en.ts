import type { LocalePatch } from "@/i18n/patches/types";
import { clientServiceCategoriesEn, clientServicesEn } from "@/i18n/patches/shared/client-services-en";

export const enPatch: LocalePatch = {
  seo: {
    siteTitle: "MDS Technology Solutions | Websites, systems and IT support",
    siteDescription:
      "Website and system development, automation, dashboards and IT support for businesses and individuals. Close support and solutions that actually work.",
    keywords: [
      "website development",
      "web systems",
      "automation",
      "IT support",
      "computer maintenance",
      "business support",
      "MDS Solutions",
    ],
    ogTitle: "MDS Technology Solutions",
    ogDescription:
      "Technology solutions that truly deliver, from digital products to automation and technical support, with hands-on experience.",
    organizationName: "MDS Technology Solutions",
    jsonLdDescription:
      "Website and web system development, automation, dashboards, integrations and IT support for businesses and individuals.",
    knowsAbout: [
      "Web development",
      "Process automation",
      "Computer technical support",
      "Business IT support",
    ],
  },
  contact: {
    whatsappDefaultMessage:
      "Hello! I came from the MDS Technology Solutions website and would like to talk about a service.",
  },
  nav: [
    { href: "/", label: "Home" },
    { href: "/sobre", label: "About" },
    { href: "/servicos", label: "Services" },
    { href: "/portfolio", label: "Projects" },
    { href: "/contato", label: "Contact" },
    { href: "/area-cliente", label: "Client Area" },
  ],
  hero: {
    badge: "</MDS Technology Solutions>",
    headlineBefore: "Digital engineering for",
    headlineAccent: "those building the future",
    headlineAfter: "",
    subheadline:
      "Websites, ERPs, apps and infrastructure with custom code, production deployment and ongoing support.",
    primaryCtaLabel: "Request a quote",
    secondaryCtaLabel: "Chat on WhatsApp",
    cardSummaryLabel: "Our services",
    cardBullets: [
      "Professional websites and landing pages",
      "Custom ERP systems and automation",
      "Android/iOS apps and IT support",
    ],
    cardFooterKicker: "Support",
    cardFooterText: "Fast response, transparent quotes and continuous support.",
  },
  home: {
    sectionKicker: "Navigation",
    sectionTitle: "What are you looking for?",
    sectionSubtitle: "Each topic on its own page, easier to find and read at your pace.",
    cards: [
      {
        href: "/area-cliente",
        title: "Request a quote",
        description:
          "Select the services you need, describe your project and send it via WhatsApp or email, already formatted.",
        cta: "Build quote",
      },
      {
        href: "/servicos",
        title: "Services",
        description: "Websites, ERP systems, apps, automation, dashboards, integrations and full IT support.",
        cta: "View services",
      },
      {
        href: "/portfolio",
        title: "Projects",
        description: "ERPs, apps, portals and web systems. Real delivery examples that show what we can do.",
        cta: "View projects",
      },
      {
        href: "/contato",
        title: "Direct contact",
        description: "WhatsApp, email or form. Choose the fastest channel for you.",
        cta: "Talk to me",
      },
    ],
  },
  about: {
    sectionKicker: "About",
    title: "Who is behind MDS",
    paragraphs: [
      "I started on my own, helping neighbors, friends of friends and small local businesses. At first it was simple stuff, freezing computers, unstable internet, that install nobody wanted to do on the weekend.",
      "Over time I took on a wider range of work, real maintenance, assembly, formatting without fear of losing important files, and then the first websites and automations for people who needed to leave paper and messy spreadsheets behind.",
      "What never changed was the focus on understanding what is bothering you today and fixing it in a way that makes sense for your budget and daily life, without pushing an expensive solution just because it is trendy.",
      "In 2026 I organized everything under MDS Technology Solutions to serve companies and more structured projects better, keeping the same direct way of talking to people.",
    ],
    highlight:
      "Today I combine bench experience with modern development and integration tools. Hands-on work and real technology, not just a pretty presentation.",
  },
  services: {
    sectionKicker: "Services",
    title: "What I can do for you",
    subtitle:
      "From digital products to fixing what is on your desk, everything explained clearly with scope and timeline agreed before we start.",
    digitalTitle: "Digital services",
    techTitle: "IT support",
    techIntro:
      "If your problem is hardware, a slow system or annoying malware, get in touch. I serve individuals and companies that need someone reliable day to day.",
    digital: [
      {
        title: "Professional websites",
        description:
          "Fast, good-looking sites that are easy to find on Google. Ideal for building credibility without hassle.",
        benefits: ["Layout aligned with your business", "Great mobile experience", "SEO-ready foundation"],
      },
      {
        title: "Custom web systems",
        description:
          "When spreadsheets and paper are no longer enough. Order flows, records and restricted areas built the way you work.",
        benefits: ["Less rework day to day", "Centralized secure data", "Grows with your business"],
      },
      {
        title: "Process automation",
        description:
          "Repetitive tasks become automatic routines, with email sending, tool integrations, alerts and reminders.",
        benefits: ["Team time saved", "Less human error", "Predictable processes"],
      },
      {
        title: "Dashboards and BI",
        description:
          "Clear indicators in one place, with sales, inventory and finance. What matters to decide better.",
        benefits: ["Quick business overview", "Reports on demand", "Management support"],
      },
      {
        title: "System integrations",
        description:
          "ERP, CRM, e-commerce and payment gateways. I make systems talk without you copying data by hand.",
        benefits: ["Information flowing on its own", "Less duplicate spreadsheets", "More integrated operation"],
      },
      {
        title: "Technology consulting",
        description:
          "When you do not know where to start, I help with architecture, tool choice, basic security and an implementation plan.",
        benefits: ["Lower-risk decisions", "Accessible language", "Focus on what pays off"],
      },
    ],
    tech: [
      {
        title: "Computer and laptop maintenance",
        description:
          "Slow machine, strange noise, overheating or faulty parts. Honest diagnosis and a solution that makes sense.",
        benefits: ["Stable equipment to work with", "Clear guidance on costs", "Simple explanations"],
      },
      {
        title: "Formatting and OS installation",
        description:
          "When Windows is completely stuck or you want a clean start, with drivers and essential software organized.",
        benefits: ["Clean responsive system", "Guided backup before changes", "Basic security configured"],
      },
      {
        title: "Cleaning and optimization",
        description:
          "Dust, full drive, useless programs running in the background. Sometimes a technical tune-up is all it takes.",
        benefits: ["Less freezing in daily use", "Better ventilation and temperature", "Practical usage tips"],
      },
      {
        title: "Virus and threat removal",
        description:
          "Annoying ads, browser redirects, suspicious pop-ups. Focused cleanup to make the PC safe again.",
        benefits: ["Malware removed carefully", "More predictable browsing", "Guidance to avoid repeat issues"],
      },
      {
        title: "Hardware upgrade",
        description:
          "More RAM, SSD or disk replacement. I recommend what actually improves performance in your case, without waste.",
        benefits: ["Investment matched to gain", "Compatibility checked first", "Proper installation and testing"],
      },
      {
        title: "Business IT support",
        description:
          "Small and medium businesses that need someone to maintain machines, basic network and daily routines.",
        benefits: ["Less downtime", "Direct channel for emergencies", "Priority support"],
      },
      {
        title: "Support for individuals",
        description:
          "At home or in your office, when you need someone who explains without arrogance and fixes without stalling.",
        benefits: ["No forced IT jargon", "Quote before authorizing service", "Respect for your time and equipment"],
      },
    ],
  },
  portfolio: {
    sectionKicker: "Portfolio",
    title: "Demos by segment",
    subtitle:
      "Interfaces and systems built by MDS, demo projects by area of work, with no link to real companies.",
    items: [
      {
        name: "Business ERP",
        client: "Distribution and retail segment",
        description:
          "Management system with sales, inventory, finance, invoicing and management reports. Real-time dashboard.",
        stats: { users: "Multi-user", modules: "8 modules" },
        features: ["Multi-branch", "Invoice issuance", "Integrated BI"],
      },
      {
        name: "Scheduling App",
        client: "Healthcare and clinics segment",
        description:
          "Scheduling app with automatic confirmation, simplified records and admin panel.",
        stats: { users: "iOS + Android", modules: "Schedule + Admin" },
        features: ["Notifications", "Telehealth", "LGPD"],
      },
      {
        name: "Real Estate Portal",
        client: "Real estate market segment",
        description:
          "Portal with advanced search, virtual tour, partner portal integration and lead CRM.",
        stats: { users: "High traffic", modules: "Catalog + CRM" },
        features: ["Virtual tour", "Lead CRM", "Local SEO"],
      },
      {
        name: "Inventory Control",
        client: "Logistics segment",
        description:
          "Inventory dashboard with smart alerts, barcodes, supplier integration and reports.",
        stats: { users: "Multi-warehouse", modules: "5+ warehouses" },
        features: ["Automatic alerts", "Barcode", "Open API"],
      },
      {
        name: "Restaurant Management",
        client: "Food service segment",
        description:
          "Digital menu, QR Code orders, real-time kitchen panel and table management.",
        stats: { users: "Multi-unit", modules: "Orders + Kitchen" },
        features: ["QR Code", "Kitchen display", "Reports"],
      },
      {
        name: "Educational Portal",
        client: "Education segment",
        description:
          "Online enrollment, student area, digital report card, announcements and virtual library.",
        stats: { users: "Medium scale", modules: "Full portal" },
        features: ["Online enrollment", "Digital report card", "Library"],
      },
      {
        name: "Financial BI Panel",
        client: "Finance segment",
        description:
          "Business intelligence with interactive charts, projections, automated income statement and accounting export.",
        stats: { users: "Managers", modules: "12+ indicators" },
        features: ["Automated P&L", "Projections", "Multi-company"],
      },
      {
        name: "Workshop ERP",
        client: "Automotive services segment",
        description:
          "Work orders, parts control, vehicle history, quotes and WhatsApp integration.",
        stats: { users: "Technical team", modules: "WO + Inventory" },
        features: ["Vehicle history", "PDF quote", "WhatsApp"],
      },
    ],
  },
  differentials: {
    sectionKicker: "Why hire us",
    title: "Advantages that matter for your budget and peace of mind",
    items: [
      {
        title: "Close and fast support",
        text: "Human response time, without disappearing after the quote. Priority for those with a problem blocking work.",
      },
      {
        title: "Years in practice, not just theory",
        text: "I have seen burnt-smelling laptops on the bench and sales systems freezing at peak hour. Street experience counts.",
      },
      {
        title: "Tailored solution",
        text: "I do not pack everyone into the same product. What matters is your flow, your budget and what will last.",
      },
      {
        title: "Transparency",
        text: "If replacing a part is not worth it, I say so. If a simple fix works, I do not sell an expensive package.",
      },
      {
        title: "Focus on the real problem",
        text: "Sometimes what hurts is not the first symptom you see. I like to go to the cause so it does not become endless patching.",
      },
    ],
  },
  trust: {
    sectionKicker: "Why trust us",
    title: "Transparency and commitment to results",
    subtitle:
      "No made-up testimonials. We prefer to show how we work and what you can expect when hiring MDS.",
    items: [
      {
        icon: "budget",
        title: "Detailed quote before starting",
        text: "You receive scope, timeline and price in writing. No surprises along the way.",
      },
      {
        icon: "shield",
        title: "Your data protected",
        text: "Security best practices, backups and LGPD compliance in all digital projects.",
      },
      {
        icon: "zap",
        title: "Human response time",
        text: "WhatsApp and email with fast replies. Technical urgency gets priority and we do not vanish after the quote.",
      },
      {
        icon: "support",
        title: "Post-delivery support",
        text: "Delivered project does not mean abandonment. Maintenance, adjustments and evolution as your business grows.",
      },
      {
        icon: "chat",
        title: "Clear communication, no jargon",
        text: "I explain in accessible language. You understand what is being done and why.",
      },
      {
        icon: "verified",
        title: "Proven practical experience",
        text: "Years on the bench and in development. Real projects delivered. See the portfolio.",
      },
    ],
  },
  cta: {
    title: "Need help with technology?",
    text: "Whether it is a website, a system or equipment maintenance, message me on WhatsApp and we will align the best path.",
    buttonText: "Message on WhatsApp now",
  },
  contactPage: {
    sectionKicker: "Contact",
    title: "Send a message",
    intro:
      "Explain in a few lines what you need. If it is urgent, WhatsApp is usually faster the same day.",
    whatsappSubtitle: "Direct support",
    formNamePlaceholder: "What should we call you",
    formMessagePlaceholder: "Tell us about the problem or project idea...",
    formSubmit: "Send message",
    formSubmitting: "Sending…",
    successHint:
      "Message received. If you need an urgent reply, use WhatsApp. I usually respond faster there.",
    errorHint: "Could not send right now. Try WhatsApp or direct email.",
  },
  footer: {
    tagline: "Development, automation and IT support with honest conversation and serious delivery.",
    quickLinksLabel: "Quick links",
    contactLabel: "Contact",
    socialsLabel: "Social",
  },
  ui: {
    skipToContent: "Skip to content",
    loader: { kicker: "INITIALIZING", name: "MDS SOLUTIONS", hint: "Loading interface…" },
    scrollTop: "Back to top",
    nav: {
      openMenu: "Open menu",
      closeMenu: "Close menu",
      brandAria: "MDS Technology Solutions, home",
      languageLabel: "Site language",
      chooseLanguage: "Choose language",
    },
    homeServices: {
      eyebrow: "Services",
      title: "Everything your business needs in technology",
      lead: "From website to ERP, with custom code and close support.",
      learnMore: "Learn more",
      items: [
        { title: "Web Development", desc: "Websites, landing pages and portals with performance and SEO." },
        { title: "Systems & ERP", desc: "Sales, inventory, finance management and integrations." },
        { title: "Applications", desc: "Mobile apps and PWAs connected to your business." },
        { title: "IT Support", desc: "Infrastructure, maintenance and business support." },
      ],
    },
    homeProcess: {
      eyebrow: "How we work",
      title: "From first contact to delivery",
      steps: [
        { title: "Briefing", text: "Scope, stack and timelines aligned with you." },
        { title: "Proposal", text: "Clear quote with deliverables and schedule." },
        { title: "Development", text: "Versioned code and staged deliveries." },
        { title: "Support", text: "Monitoring and continuous evolution." },
      ],
    },
    homeCta: {
      eyebrow: "Next step",
      title: "Ready to start?",
      lead: "Build your quote online or talk to our team.",
      clientArea: "Client Area",
      contact: "Contact",
    },
    homeFeatured: {
      eyebrow: "Portfolio",
      title: "Projects in production",
      lead: "Real interfaces and systems by segment.",
      viewAll: "View all",
    },
    portfolio: { filterAll: "All" },
    clientQuote: {
      eyebrow: "Client Area",
      title: "Build your quote",
      lead:
        'Choose a category to see the catalog. Select services and they appear in "Selected products" on the side.',
      catalogTitle: "Catalog",
      catalogHint: "Click a tab to show services.",
      tabAll: "All",
      tabAllServices: "All services",
      showingPrefix: "Showing:",
      itemsSuffix: "items",
      emptyCategory: "No services in this category.",
      selectedTitle: "Selected products",
      selectedEmpty: "No services yet. Open a category and select the items you want.",
      formTitle: "Your details",
      nameLabel: "Name *",
      namePlaceholder: "Your name",
      emailLabel: "Email *",
      emailPlaceholder: "you@email.com",
      phoneLabel: "Phone",
      phonePlaceholder: "+1 555 000 0000",
      companyLabel: "Company",
      companyPlaceholder: "Optional",
      urgencyLabel: "Urgency",
      urgencyNormal: "Normal (2 to 4 weeks)",
      urgencyUrgent: "Urgent",
      urgencyFlexible: "Flexible",
      budgetLabel: "Budget (optional)",
      budgetPlaceholder: "E.g. up to $1,000",
      detailsLabel: "Project details",
      detailsPlaceholder: "Describe the project...",
      sendWhatsapp: "Send via WhatsApp",
      sendEmail: "Send by email",
      validationHint: "Select at least one service and fill in a valid name and email.",
      sentWhatsapp: "WhatsApp opened!",
      sentEmail: "Email opened!",
      removeService: "Remove",
    },
    clientServiceCategories: clientServiceCategoriesEn,
    clientServices: clientServicesEn,
    categoryLabels: {
      site: "Website",
      erp: "ERP System",
      sistema: "Web System",
      app: "Application",
    },
  },
};
