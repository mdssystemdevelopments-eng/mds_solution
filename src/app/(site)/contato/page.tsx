import type { Metadata } from "next";
import { getSiteContentAsync } from "@/lib/site-content";
import { Contact } from "@/components/contact";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale por WhatsApp, e-mail ou formulário. Resposta o mais rápido possível.",
};

export default async function ContatoPage() {
  const content = await getSiteContentAsync();
  return <Contact content={content} />;
}
