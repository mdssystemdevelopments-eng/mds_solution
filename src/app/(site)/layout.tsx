import type { Metadata, Viewport } from "next";
import { getLocaleMeta, localeToHtmlLang } from "@/i18n/config";
import { getRequestLocale } from "@/i18n/get-locale";
import { getSiteContentForLocale } from "@/lib/site-content";
import { SiteShell } from "@/components/site-shell";
import { BootLoader } from "@/components/boot-loader";
import { JsonLd } from "@/components/json-ld";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mdssolution.com.br";

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#030508" }],
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = await getSiteContentForLocale(locale);
  const ogLocale = locale.replace("-", "_");
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: c.seo.siteTitle,
      template: `%s | ${c.seo.organizationName}`,
    },
    description: c.seo.siteDescription,
    keywords: c.seo.keywords,
    authors: [{ name: c.seo.organizationName }],
    openGraph: {
      type: "website",
      locale: ogLocale,
      url: siteUrl,
      siteName: c.seo.organizationName,
      title: c.seo.ogTitle,
      description: c.seo.ogDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: c.seo.ogTitle,
      description: c.seo.ogDescription,
    },
    robots: { index: true, follow: true },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const locale = await getRequestLocale();
  const content = await getSiteContentForLocale(locale);
  const meta = getLocaleMeta(locale);

  return (
    <div className="site-root is-booting" lang={localeToHtmlLang(locale)} dir={meta.dir}>
      <style
        dangerouslySetInnerHTML={{
          __html: `.site-root.is-booting .site,.site-root.is-booting .video-bg,.site-root.is-booting .hero__logo-media,.site-root.is-booting .hero__logo-video,.site-root.is-booting .hero__preview--logo{opacity:0!important;visibility:hidden!important;pointer-events:none!important}`,
        }}
      />
      <BootLoader />
      <JsonLd content={content} siteUrl={siteUrl} />
      <SiteShell locale={locale} content={content}>
        {children}
      </SiteShell>
    </div>
  );
}
