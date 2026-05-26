import type { ClientService } from "@/lib/client-services";

export type QuoteFormData = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  selectedServices: ClientService[];
  urgency?: "normal" | "urgente" | "flexivel";
  budget?: string;
};

const urgencyLabelsDefault = {
  normal: "Normal (2 a 4 semanas)",
  urgente: "Urgente (preciso o quanto antes)",
  flexivel: "Flexível (sem pressa)",
};

export function formatQuoteMessage(
  data: QuoteFormData,
  urgencyLabels: Record<NonNullable<QuoteFormData["urgency"]>, string> = urgencyLabelsDefault,
): string {
  const lines: string[] = [
    "🔷 *SOLICITAÇÃO DE ORÇAMENTO | MDS Soluções*",
    "",
    `👤 *Nome:* ${data.name}`,
  ];

  if (data.company?.trim()) {
    lines.push(`🏢 *Empresa:* ${data.company.trim()}`);
  }

  lines.push(`📧 *E-mail:* ${data.email}`);

  if (data.phone?.trim()) {
    lines.push(`📱 *Telefone:* ${data.phone.trim()}`);
  }

  if (data.urgency) {
    lines.push(`⏱️ *Prazo:* ${urgencyLabels[data.urgency]}`);
  }

  if (data.budget?.trim()) {
    lines.push(`💰 *Orçamento previsto:* ${data.budget.trim()}`);
  }

  lines.push("", "📋 *Serviços selecionados:*");

  if (data.selectedServices.length === 0) {
    lines.push("Nenhum serviço específico (consulta geral)");
  } else {
    data.selectedServices.forEach((s, i) => {
      lines.push(`${i + 1}. ${s.title}`);
    });
  }

  if (data.message.trim()) {
    lines.push("", "📝 *Detalhes adicionais:*", data.message.trim());
  }

  lines.push("", "Enviado pelo site MDS Soluções em Tecnologia");

  return lines.join("\n");
}

export function formatQuoteEmailSubject(data: QuoteFormData): string {
  const count = data.selectedServices.length;
  const servicePart =
    count === 0
      ? "Consulta geral"
      : count === 1
        ? data.selectedServices[0].title
        : `${count} serviços`;
  return `[Orçamento MDS] ${servicePart} | ${data.name}`;
}

export function formatQuoteEmailBody(
  data: QuoteFormData,
  urgencyLabels?: Record<NonNullable<QuoteFormData["urgency"]>, string>,
): string {
  return formatQuoteMessage(data, urgencyLabels).replace(/\*/g, "");
}
