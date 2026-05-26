import type { Metadata } from "next";
import { getSiteContentAsync } from "@/lib/site-content";
import { Portfolio } from "@/components/portfolio";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Exemplos de projetos e entregas em sistemas web, automação e presença digital.",
};

export default async function PortfolioPage() {
  const content = await getSiteContentAsync();
  return <Portfolio content={content} />;
}
