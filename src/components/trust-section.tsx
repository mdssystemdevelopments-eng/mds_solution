import type { SiteContent } from "@/types/site-content";
import { TrustIcon } from "@/components/trust-icon";

export function TrustSection({ content }: { content: SiteContent }) {
  const t = content.trust;

  return (
    <section className="section">
      <div className="wrap">
        <div className="page-head">
          <p className="eyebrow">{t.sectionKicker}</p>
          <h2 className="h2 page-head__title">{t.title}</h2>
          <p className="lead">{t.subtitle}</p>
        </div>
        <div className="grid-3 page-block">
          {t.items.map((item) => (
            <article key={item.title} className="service-card trust-card">
              <TrustIcon name={item.icon} />
              <h3 className="service-card__title trust-card__title">{item.title}</h3>
              <p className="service-card__text">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
