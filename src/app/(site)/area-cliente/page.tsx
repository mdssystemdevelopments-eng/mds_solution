import type { Metadata } from "next";
import { getSiteContentAsync } from "@/lib/site-content";
import { ClientQuoteBuilder } from "@/components/client-quote-builder";

export const metadata: Metadata = {
  title: "Área do Cliente | Solicitar Orçamento",
  description:
    "Selecione os serviços que precisa, descreva seu projeto e envie sua solicitação de orçamento formatada pelo WhatsApp ou e-mail.",
};

export default async function AreaClientePage() {
  const content = await getSiteContentAsync();
  return <ClientQuoteBuilder content={content} />;
}