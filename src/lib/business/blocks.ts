import { PAGE_CTA } from "@/lib/business/cta";
import { newBusinessId } from "@/lib/business/helpers";
import type { BusinessBlock, BlockType } from "@/lib/business/types";

export function createBlock(type: BlockType): BusinessBlock {
  const id = newBusinessId("block");
  const content: Record<string, unknown> = {
    hero: {
      title: "Titulo",
      subtitle: "",
      text: "",
      image: "",
      video: "",
      buttonLabel: "Quero conversar",
      buttonHref: PAGE_CTA,
      align: "left",
      height: "md",
      overlay: true,
    },
    text: { title: "", html: "" },
    image: { src: "", alt: "", caption: "", href: "", width: "full" },
    gallery: { layout: "grid", columns: 3, images: [] },
    video: { url: "", title: "", text: "", thumb: "" },
    pdf: { src: "", title: "Documento", label: "Baixar PDF" },
    cards: { items: [{ title: "Item", text: "", image: "", href: "" }] },
    stats: { items: [{ value: "01", label: "Indicador" }] },
    testimonials: { items: [{ name: "Cliente", role: "", text: "Depoimento." }] },
    timeline: { title: "Etapas", items: [{ title: "Etapa", text: "" }] },
    table: { headers: ["Item", "Detalhe"], rows: [["", ""]] },
    pricing: {
      title: "Investimento",
      plans: [{ name: "Escopo", price: "Sob consulta", text: "", items: [], buttonLabel: "Quero conversar", buttonHref: PAGE_CTA }],
    },
    faq: { items: [{ q: "Pergunta", a: "" }] },
    button: { label: "Quero conversar", href: PAGE_CTA },
    cta: { title: "Quer seguir com este projeto?", text: "Deixe seu contato. A MDS responde por WhatsApp.", buttonLabel: "Quero conversar", buttonHref: PAGE_CTA },
    contact: { phone: "", whatsapp: "", email: "", address: "", buttonLabel: "Quero conversar", buttonHref: PAGE_CTA },
    form: { title: "Deixe seu contato", text: "A MDS responde por WhatsApp." },
    divider: { style: "line" },
    html: { html: "" },
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
