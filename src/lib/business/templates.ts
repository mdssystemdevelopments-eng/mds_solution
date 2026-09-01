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
      buttonLabel: "Falar com a MDS",
      buttonHref: "/contato",
      align: "left",
      height: "md",
      overlay: true,
    },
  };
}

export function templateBlocks(template: BusinessTemplate, title: string): BusinessBlock[] {
  const intro = hero(title, "Apresentacao preparada pela MDS Solucoes em Tecnologia.");
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
      text: "Fale com a MDS para ajustar escopo, prazo e investimento.",
      buttonLabel: "Entrar em contato",
      buttonHref: "/contato",
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
              buttonLabel: "Solicitar proposta",
              buttonHref: "/contato",
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
  if (template === "minimalista") {
    return { ...DEFAULT_DESIGN, theme: "light", background: "#f4f6f8", text: "#121418", primary: "#0b6b8a" };
  }
  if (template === "corporativo") {
    return { ...DEFAULT_DESIGN, primary: "#3dd6ff", background: "#071018" };
  }
  if (template === "premium") {
    return { ...DEFAULT_DESIGN, primary: "#d4b36a", secondary: "#a4843f" };
  }
  if (template === "imobiliario") {
    return { ...DEFAULT_DESIGN, primary: "#7dd3c7", background: "#08110f" };
  }
  return { ...DEFAULT_DESIGN };
}
