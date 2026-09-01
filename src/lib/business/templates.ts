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
      subtitle: "",
      text,
      image: "",
      video: "",
      buttonLabel: "Quero conversar",
      buttonHref: PAGE_CTA,
      align: "left",
      height: "md",
      overlay: true,
    },
  };
}

export function templateBlocks(template: BusinessTemplate, title: string): BusinessBlock[] {
  const intro = hero(title, "Pagina exclusiva deste projeto.");
  const stats: BusinessBlock = {
    id: id("block"),
    type: "stats",
    content: {
      items: [
        { value: "10+", label: "Anos de pratica" },
        { value: "Sob medida", label: "Cada entrega" },
        { value: "Direto", label: "Atendimento" },
      ],
    },
  };
  const timeline: BusinessBlock = {
    id: id("block"),
    type: "timeline",
    content: {
      title: "Como o trabalho acontece",
      items: [
        { title: "Planejamento", text: "Escopo, prazos e prioridades." },
        { title: "Desenvolvimento", text: "Construcao e validacao continua." },
        { title: "Entrega", text: "Publicacao, treino e suporte." },
      ],
    },
  };
  const cta: BusinessBlock = {
    id: id("block"),
    type: "cta",
    content: {
      title: "Quer seguir com este projeto?",
      text: "Deixe seu contato. A MDS responde por WhatsApp.",
      buttonLabel: "Quero conversar",
      buttonHref: PAGE_CTA,
    },
  };

  if (template === "minimalista") return [intro, cta];
  if (template === "corporativo") return [intro, stats, timeline, cta];
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
              items: ["Briefing", "Prototipo", "Entrega acompanhada"],
              buttonLabel: "Quero conversar",
              buttonHref: PAGE_CTA,
            },
          ],
        },
      },
      cta,
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
      cta,
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
            { title: "Projeto 1", text: "Descreva o primeiro case.", image: "", href: "" },
            { title: "Projeto 2", text: "Descreva o segundo case.", image: "", href: "" },
          ],
        },
      },
      cta,
    ];
  }
  return [intro, stats, cta];
}

export function templateDesign(template: BusinessTemplate): BusinessDesign {
  const themed = (theme: "light" | "dark", palette: string): BusinessDesign => {
    const d = applyLook(DEFAULT_DESIGN, { theme, palette });
    return { ...d, coverColor: d.background };
  };
  if (template === "minimalista") return themed("light", "grafite");
  if (template === "corporativo") return themed("dark", "oceano");
  if (template === "premium") return themed("dark", "ouro");
  if (template === "imobiliario") return themed("dark", "floresta");
  if (template === "portfolio") return themed("dark", "noite");
  return themed("dark", "mds");
}
