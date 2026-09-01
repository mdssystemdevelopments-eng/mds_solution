import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TrustBadges } from "@/components/trust-badges";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SiteBackdrop } from "@/components/site-backdrop";
import { PageLoader } from "@/components/page-loader";
import { LocaleProvider } from "@/components/locale-provider";
import type { Locale } from "@/i18n/config";
import type { SiteContent } from "@/types/site-content";

export function SiteShell({
  locale,
  content,
  children,
}: {
  locale: Locale;
  content: SiteContent;
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider locale={locale} content={content}>
      <Suspense fallback={null}>
        <PageLoader />
      </Suspense>
      <SiteBackdrop />
      <div className="site">
        <a href="#conteudo" className="sr-only">
          {content.ui.skipToContent}
        </a>
        <Navbar />
        <main id="conteudo">{children}</main>
        <TrustBadges />
        <Footer content={content} />
        <WhatsAppFloat
          whatsappNumber={content.contact.whatsappNumber}
          defaultMessage={content.contact.whatsappDefaultMessage}
        />
        <ScrollToTop label={content.ui.scrollTop} />
      </div>
    </LocaleProvider>
  );
}
