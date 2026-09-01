import { newBusinessId } from "@/lib/business/helpers";
import type { BusinessBlock, BlockType } from "@/lib/business/types";

export function createBlock(type: BlockType): BusinessBlock {
  const id = newBusinessId("block");
  const content: Record<string, unknown> = {
    hero: {
      title: "Titulo da apresentacao",
      subtitle: "",
      text: "Descreva o objetivo desta pagina.",
      image: "",
      video: "",
      buttonLabel: "Falar com a MDS",
      buttonHref: "/contato",
      align: "left",
      height: "md",
      overlay: true,
    },
    text: { title: "", html: "<p>Escreva o texto aqui.</p>" },
    image: { src: "", alt: "", caption: "", href: "", width: "full" },
    gallery: { layout: "grid", columns: 3, images: [] },
    video: { url: "", title: "", text: "", thumb: "" },
    pdf: { src: "", title: "Documento", label: "Baixar PDF" },
    cards: { items: [{ title: "Card", text: "Descricao", image: "", href: "" }] },
    stats: { items: [{ value: "10+", label: "Indicador" }] },
    testimonials: { items: [{ name: "Cliente", role: "Empresa", text: "Depoimento." }] },
    timeline: { title: "Cronograma", items: [{ title: "Etapa", text: "Descricao" }] },
    table: { headers: ["Item", "Detalhe"], rows: [["Exemplo", "Valor"]] },
    pricing: {
      title: "Planos",
      plans: [{ name: "Plano", price: "Sob consulta", text: "", items: ["Entrega"], buttonLabel: "Contratar", buttonHref: "/contato" }],
    },
    faq: { items: [{ q: "Pergunta", a: "Resposta" }] },
    button: { label: "Acao", href: "/contato" },
    cta: { title: "Vamos conversar?", text: "Fale com a MDS.", buttonLabel: "Contato", buttonHref: "/contato" },
    contact: { phone: "", whatsapp: "", email: "", address: "", buttonLabel: "WhatsApp", buttonHref: "" },
    form: { title: "Envie uma mensagem", text: "Retornamos pelo WhatsApp ou e-mail." },
    divider: { style: "line" },
    html: { html: "<p>HTML permitido sem scripts.</p>" },
  };
  return { id, type, hidden: false, content: (content[type] ?? {}) as Record<string, unknown> };
}

export function str(content: Record<string, unknown>, key: string, fallback = ""): string {
  const value = content[key];
  return typeof value === "string" ? value : fallback;
}

export function num(content: Record<string, unknown>, key: string, fallback = 0): number {
  const value = content[key];
  return typeof value === "number" ? value : fallback;
}

export function arr(content: Record<string, unknown>, key: string): Record<string, unknown>[] {
  const value = content[key];
  return Array.isArray(value) ? value.filter((item) => item && typeof item === "object") as Record<string, unknown>[] : [];
}
