import { deepMerge } from "@/lib/deep-merge";
import { enPatch } from "@/i18n/patches/en";
import type { LocalePatch } from "@/i18n/patches/types";

export const esPatch: LocalePatch = deepMerge(enPatch as Record<string, unknown>, {
  seo: {
    siteTitle: "MDS Soluciones en Tecnología | Sitios, sistemas y soporte técnico",
    siteDescription:
      "Desarrollo de sitios y sistemas, automatización, dashboards y soporte técnico para empresas y personas. Atención cercana y soluciones que funcionan de verdad.",
    ogTitle: "MDS Soluciones en Tecnología",
    ogDescription:
      "Soluciones tecnológicas que realmente resuelven, del digital a la automatización y al soporte técnico, con experiencia práctica.",
    organizationName: "MDS Soluciones en Tecnología",
  },
  contact: {
    whatsappDefaultMessage:
      "¡Hola! Llegué desde el sitio de MDS Soluciones en Tecnología y me gustaría hablar sobre un servicio.",
  },
  nav: [
    { href: "/", label: "Inicio" },
    { href: "/sobre", label: "Sobre" },
    { href: "/servicos", label: "Servicios" },
    { href: "/portfolio", label: "Proyectos" },
    { href: "/contato", label: "Contacto" },
    { href: "/area-cliente", label: "Área del Cliente" },
  ],
  hero: {
    badge: "</MDS Soluciones en Tecnología>",
    headlineBefore: "Ingeniería digital para",
    headlineAccent: "quienes construyen el futuro",
    subheadline:
      "Sitios, ERPs, apps e infraestructura con código a medida, despliegue en producción y soporte continuo.",
    primaryCtaLabel: "Solicitar presupuesto",
    secondaryCtaLabel: "Hablar por WhatsApp",
    cardSummaryLabel: "Nuestros servicios",
    cardBullets: [
      "Sitios y landing pages profesionales",
      "Sistemas ERP y automatización a medida",
      "Apps Android/iOS y soporte técnico",
    ],
    cardFooterKicker: "Atención",
    cardFooterText: "Respuesta rápida, presupuesto transparente y soporte continuo.",
  },
  home: {
    sectionKicker: "Navegación",
    sectionTitle: "¿Qué estás buscando?",
    sectionSubtitle: "Cada tema en su página, más fácil de encontrar y leer con calma.",
    cards: [
      {
        href: "/area-cliente",
        title: "Solicitar presupuesto",
        description:
          "Selecciona los servicios que necesitas, describe tu proyecto y envíalo por WhatsApp o correo, ya formateado.",
        cta: "Armar presupuesto",
      },
      {
        href: "/servicos",
        title: "Servicios",
        description: "Sitios, ERP, apps, automatización, dashboards, integraciones y soporte técnico completo.",
        cta: "Ver servicios",
      },
      {
        href: "/portfolio",
        title: "Proyectos",
        description: "ERPs, apps, portales y sistemas web. Ejemplos reales que muestran nuestra capacidad.",
        cta: "Ver proyectos",
      },
      {
        href: "/contato",
        title: "Contacto directo",
        description: "WhatsApp, correo o formulario. Elige el canal más rápido para ti.",
        cta: "Hablar conmigo",
      },
    ],
  },
  about: {
    sectionKicker: "Sobre",
    title: "Quién está detrás de MDS",
    paragraphs: [
      "Empecé por cuenta propia, atendiendo vecinos, amigos de amigos y pequeños comercios de la zona. Al principio eran cosas simples, computadora trabada, internet inestable, esa instalación que nadie quería hacer el fin de semana.",
      "Con el tiempo fui ampliando el abanico de servicios, mantenimiento de verdad, montaje, formateo sin miedo a perder archivos importantes, y después los primeros sitios y automatizaciones para quien necesitaba salir del papel y la planilla caótica.",
      "Lo que no cambió fue el foco en entender qué te está complicando hoy y resolverlo de forma que tenga sentido para tu bolsillo y tu día a día, sin empujar una solución cara solo porque está de moda.",
      "En 2026 organicé todo bajo MDS Soluciones en Tecnología para atender mejor empresas y proyectos más estructurados, manteniendo la misma forma directa de hablar con la gente.",
    ],
    highlight:
      "Hoy uno experiencia de quien ya vio de todo un poco en el banco de trabajo con las herramientas actuales de desarrollo e integración. Manos a la obra y tecnología de verdad, no solo presentación bonita.",
  },
  services: {
    sectionKicker: "Servicios",
    title: "Qué puedo hacer por ti",
    subtitle:
      "De lo digital a la reparación en tu mesa, todo explicado con claridad y con alcance y plazo acordados antes de empezar.",
    digitalTitle: "Servicios digitales",
    techTitle: "Soporte técnico",
    techIntro:
      "Si tu problema es hardware, sistema lento o virus molesto, escríbeme. Atiendo personas y empresas que necesitan alguien confiable día a día.",
  },
  portfolio: {
    sectionKicker: "Portafolio",
    title: "Demostraciones por segmento",
    subtitle:
      "Interfaces y sistemas desarrollados por MDS, proyectos demostrativos por área, sin vínculo con empresas reales.",
  },
  cta: {
    title: "¿Necesitas ayuda con tecnología?",
    text: "Sea un sitio, un sistema o mantenimiento del equipo, escríbeme por WhatsApp y alineamos el mejor camino.",
    buttonText: "Escribir por WhatsApp ahora",
  },
  contactPage: {
    sectionKicker: "Contacto",
    title: "Envía un mensaje",
    intro:
      "Explica en pocas líneas qué necesitas. Si es urgente, WhatsApp suele ser más rápido el mismo día.",
    whatsappSubtitle: "Atención directa",
    formNamePlaceholder: "Cómo quieres que te llamemos",
    formMessagePlaceholder: "Cuenta el problema o la idea del proyecto...",
    formSubmit: "Enviar mensaje",
    formSubmitting: "Enviando…",
    successHint:
      "Mensaje registrado. Si necesitas respuesta urgente, usa WhatsApp. Suelo responder más rápido por ahí.",
    errorHint: "No fue posible enviar ahora. Prueba WhatsApp o el correo directo.",
  },
  footer: {
    tagline: "Desarrollo, automatización y soporte técnico con conversación franca y entrega seria.",
    quickLinksLabel: "Enlaces rápidos",
    contactLabel: "Contacto",
    socialsLabel: "Redes",
  },
  ui: {
    skipToContent: "Ir al contenido",
    loader: { kicker: "INICIALIZANDO", name: "MDS SOLUCIONES", hint: "Cargando interfaz…" },
    scrollTop: "Volver arriba",
    nav: {
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      brandAria: "MDS Soluciones en Tecnología, inicio",
      languageLabel: "Idioma del sitio",
      chooseLanguage: "Elegir idioma",
    },
    homeServices: {
      eyebrow: "Servicios",
      title: "Todo lo que tu empresa necesita en tecnología",
      lead: "Del sitio al ERP, con código a medida y soporte cercano.",
      learnMore: "Saber más",
      close: "Cerrar",
      items: [
        {
          title: "Desarrollo Web",
          desc: "Sitios, landing pages y portales con rendimiento y SEO.",
          details: "Creamos sitios institucionales, landing pages y portales a medida. El foco es un visual profesional, carga rápida y buena presencia en Google, en celular y computadora.",
          points: ["Diseño alineado a tu marca", "Rendimiento y experiencia móvil", "Base técnica pensada para SEO", "Formularios, WhatsApp e integraciones"],
        },
        {
          title: "Sistemas y ERP",
          desc: "Gestión de ventas, stock, finanzas e integraciones.",
          details: "Cuando la planilla ya no alcanza, armamos un sistema con los flujos reales de tu operación: ventas, stock, finanzas, registros y área restringida.",
          points: ["Gestión de ventas, stock y finanzas", "Datos centralizados con acceso controlado", "Integración con ERP, CRM y pagos", "Menos retrabajo y menos error manual"],
        },
        {
          title: "Aplicaciones",
          desc: "Apps móviles y PWA conectadas a tu negocio.",
          details: "Desarrollamos apps móviles y PWA para clientes, equipo u operación interna, conectadas a tu sistema con login, notificaciones y flujos del día a día.",
          points: ["App nativa o PWA, según el caso", "Conectada a los datos de la empresa", "Login, notificaciones y área de usuario", "Publicación y evolución continua"],
        },
        {
          title: "Soporte Técnico",
          desc: "Infraestructura, mantenimiento y soporte empresarial.",
          details: "Cuidamos el hardware y la operación diaria: computadoras lentas, red inestable, virus, formateo y soporte para empresas que necesitan a alguien estable.",
          points: ["Mantenimiento de computadoras y notebooks", "Formateo, limpieza y optimización", "Eliminación de virus y amenazas", "Soporte técnico para empresas"],
        },
      ],
    },
    homeProcess: {
      eyebrow: "Cómo trabajamos",
      title: "Del primer contacto a la entrega",
      steps: [
        { title: "Briefing", text: "Alcance, stack y plazos alineados contigo." },
        { title: "Propuesta", text: "Presupuesto claro con entregas y cronograma." },
        { title: "Desarrollo", text: "Código versionado y entregas por etapas." },
        { title: "Soporte", text: "Monitoreo y evolución continua." },
      ],
    },
    homeCta: {
      eyebrow: "Siguiente paso",
      title: "¿Listo para empezar?",
      lead: "Arma tu presupuesto online o habla con nuestro equipo.",
      clientArea: "Área del Cliente",
      contact: "Contacto",
    },
    homeFeatured: {
      eyebrow: "Portafolio",
      title: "Proyectos en producción",
      lead: "Interfaces y sistemas reales por segmento.",
      viewAll: "Ver todos",
    },
    portfolio: { filterAll: "Todos" },
    clientQuote: {
      eyebrow: "Área del Cliente",
      title: "Arma tu presupuesto",
      lead:
        "Elige una categoría para ver el catálogo. Marca los servicios y aparecerán en « Productos seleccionados ».",
      catalogTitle: "Catálogo",
      catalogHint: "Haz clic en una pestaña para mostrar los servicios.",
      tabAll: "Todos",
      tabAllServices: "Todos los servicios",
      showingPrefix: "Mostrando:",
      itemsSuffix: "elementos",
      emptyCategory: "Ningún servicio en esta categoría.",
      selectedTitle: "Productos seleccionados",
      selectedEmpty: "Aún no hay servicios. Abre una categoría y marca los elementos deseados.",
      formTitle: "Tus datos",
      nameLabel: "Nombre *",
      namePlaceholder: "Tu nombre",
      emailLabel: "Correo *",
      emailPlaceholder: "tu@email.com",
      phoneLabel: "Teléfono",
      phonePlaceholder: "+34 600 000 000",
      companyLabel: "Empresa",
      companyPlaceholder: "Opcional",
      urgencyLabel: "Urgencia",
      urgencyNormal: "Normal (2 a 4 semanas)",
      urgencyUrgent: "Urgente",
      urgencyFlexible: "Flexible",
      budgetLabel: "Presupuesto (opcional)",
      budgetPlaceholder: "Ej.: hasta $5.000",
      detailsLabel: "Detalles del proyecto",
      detailsPlaceholder: "Describe el proyecto...",
      sendWhatsapp: "Enviar por WhatsApp",
      sendEmail: "Enviar por correo",
      validationHint: "Selecciona al menos un servicio y completa nombre y correo válidos.",
      sentWhatsapp: "¡WhatsApp abierto!",
      sentEmail: "¡Correo abierto!",
      removeService: "Quitar",
    },
    clientServiceCategories: {
      web: { label: "Sitios y Web", emoji: "🌐" },
      sistema: { label: "Sistemas y ERP", emoji: "⚙️" },
      app: { label: "Aplicaciones", emoji: "📱" },
      tecnico: { label: "Soporte Técnico", emoji: "🛠️" },
      consultoria: { label: "Consultoría", emoji: "💡" },
    },
    categoryLabels: {
      site: "Sitio Web",
      erp: "Sistema ERP",
      sistema: "Sistema Web",
      app: "Aplicación",
    },
  },
}) as LocalePatch;
