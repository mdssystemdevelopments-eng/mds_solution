import type { SiteContent } from "@/types/site-content";

export function JsonLd({ content, siteUrl }: { content: SiteContent; siteUrl: string }) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: content.seo.organizationName,
        url: siteUrl,
        description: content.seo.jsonLdDescription,
        email: content.contact.email,
        areaServed: "BR",
        knowsAbout: content.seo.knowsAbout,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: content.seo.organizationName,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "pt-BR",
      },
    ],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
