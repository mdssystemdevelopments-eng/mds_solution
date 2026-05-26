import type { Metadata } from "next";
import { getSiteContentAsync } from "@/lib/site-content";
import { About } from "@/components/about";
import { Differentials } from "@/components/differentials";
import { TrustSection } from "@/components/trust-section";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a história e o jeito MDS de trabalhar com tecnologia.",
};

export default async function SobrePage() {
  const content = await getSiteContentAsync();
  return (
    <>
      <About content={content} />
      <Differentials content={content} />
      <TrustSection content={content} />
    </>
  );
}
