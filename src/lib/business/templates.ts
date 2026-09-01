import { applyLook } from "./palettes";
import { PAGE_CTA } from "./cta";
import type { BusinessBlock, BusinessDesign, BusinessTemplate } from "./types";
import { DEFAULT_DESIGN } from "./types";

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function hero(title: string, text: string): BusinessBlock {
  return {
    id: id("block"),
    type: "hero",
    content: {
      title,
      subtitle: "MDS Solucoes em Tecnologia",
      text,
      image: "",
      video: "",
      buttonLabel: "Falar no WhatsApp",
      buttonHref: PAGE_CTA,
      align: "left",
      height: "lg",
      overlay: true,
    },
  };
}

function stats(): BusinessBlock {
  return {
    id: id("block"),
    type: "stats",
    content: {
      title: "",
      items: [
        { value: "Escopo", label: "Fechado com voce antes de comecar" },
        { value: "Codigo", label: "Proprio, sem tema de prateleira" },
        { value: "Contato", label: "Direto com quem desenvolve" },
      ],
    },
  };
}

function timeline(): BusinessBlock {
  return {
    id: id("block"),
    type: "timeline",
    content: {
      title: "Como o trabalho acontece",
      items: [
        { title: "Levantamento", text: "Briefing, mapa do site e definicao de tom." },
        { title: "Desenvolvimento", text: "Design em codigo, painel e duas rodadas de ajuste." },
        { title: "Publicacao", text: "Ar, treinamento e suporte nos primeiros 30 dias." },
      ],
    },
  };
}

function cta(): BusinessBlock {
  return {
    id: id("block"),
    type: "cta",
    content: {
      title: "Se o escopo estiver certo, seguimos",
      text: "Deixe nome e WhatsApp nesta pagina. A MDS responde por la.",
      buttonLabel: "Falar no WhatsApp",
      buttonHref: PAGE_CTA,
    },
  };
}

export function templateBlocks(template: BusinessTemplate, title: string): BusinessBlock[] {
  const intro = hero(title, "Documento de apresentacao deste projeto. Escopo, metodo e proximo passo.");

  if (template === "minimalista") return [intro, cta()];

  if (template === "premium") {
    return [
      intro,
      {
        id: id("block"),
        type: "pricing",
        content: {
          title: "Investimento",
          plans: [
            {
              name: "Escopo base",
              price: "Sob consulta",
              text: "Diagnostico e proposta fechada antes de qualquer cobranca.",
              items: ["Briefing", "Prototipo", "Acompanhamento da entrega"],
              buttonLabel: "Falar no WhatsApp",
              buttonHref: PAGE_CTA,
            },
          ],
        },
      },
      cta(),
    ];
  }

  if (template === "imobiliario") {
    return [
      intro,
      {
        id: id("block"),
        type: "gallery",
        content: { layout: "grid", columns: 3, images: [] },
      },
      cta(),
    ];
  }

  if (template === "portfolio") {
    return [
      intro,
      {
        id: id("block"),
        type: "cards",
        content: {
          items: [
            { title: "Case 1", text: "Descreva o primeiro trabalho.", image: "", href: "" },
            { title: "Case 2", text: "Descreva o segundo trabalho.", image: "", href: "" },
          ],
        },
      },
      cta(),
    ];
  }

  return [
    intro,
    stats(),
    {
      id: id("block"),
      type: "text",
      content: {
        title: "Leitura do projeto",
        html: "<p>Use este bloco para o contexto do cliente, o problema e o que a MDS vai construir. Troque este texto.</p>",
      },
    },
    timeline(),
    {
      id: id("block"),
      type: "cards",
      content: {
        items: [
          { title: "Painel", text: "Edicao de conteudo sem depender de tema pronto.", image: "", href: "" },
          { title: "Codigo", text: "Fonte organizado e documentado na entrega.", image: "", href: "" },
          { title: "Suporte", text: "Trinta dias depois da publicacao.", image: "", href: "" },
        ],
      },
    },
    cta(),
  ];
}

export function templateDesign(template: BusinessTemplate): BusinessDesign {
  const themed = (theme: "light" | "dark", palette: string): BusinessDesign => {
    const d = applyLook(DEFAULT_DESIGN, { theme, palette });
    return { ...d, coverColor: "#101010", radius: "2px" };
  };
  if (template === "minimalista") return themed("light", "grafite");
  if (template === "corporativo") return themed("light", "mds");
  if (template === "premium") return themed("dark", "ouro");
  if (template === "imobiliario") return themed("dark", "floresta");
  if (template === "portfolio") return themed("dark", "noite");
  return themed("light", "mds");
}
