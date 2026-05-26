import type { Metadata } from "next";
import { getSiteContentAsync } from "@/lib/site-content";
import { Services } from "@/components/services";

export const metadata: Metadata = {
  title: "Serviços",
  description: "Serviços digitais e assistência técnica com escopo claro e linguagem acessível.",
};

export default async function ServicosPage() {
  const content = await getSiteContentAsync();
  return <Services content={content} />;
}
