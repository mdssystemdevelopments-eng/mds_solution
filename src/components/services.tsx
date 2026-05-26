import { whatsappHref } from "@/lib/whatsapp";
import type { SiteContent, ServiceItem } from "@/types/site-content";

function msg(title: string, cat: string) {
  return `Olá! Quero saber mais sobre ${cat}: ${title}`;
}

export function Services({ content }: { content: SiteContent }) {
  const s = content.services;
  const wa = content.contact.whatsappNumber;

  return (
    <section className="section scroll-mt-nav">
      <div className="wrap">
        <div className="page-head">
          <p className="eyebrow">{s.sectionKicker}</p>
          <h1 className="h2" style={{ marginTop: "0.5rem" }}>
            {s.title}
          </h1>
          <p className="lead">{s.subtitle}</p>
        </div>

        <div className="services-page">
          <section className="services-block" aria-labelledby="services-digital-heading">
            <div className="services-block__head panel glass">
              <h2 id="services-digital-heading" className="services-block__title">
                {s.digitalTitle}
              </h2>
            </div>
            <div className="grid-2 services-block__grid">
              {s.digital.map((item) => (
                <ServiceCard
                  key={item.title}
                  item={item}
                  href={whatsappHref(wa, msg(item.title, "Serviço digital"))}
                />
              ))}
            </div>
          </section>

          <section className="services-block" aria-labelledby="services-tech-heading">
            <div className="services-block__head panel glass">
              <h2 id="services-tech-heading" className="services-block__title">
                {s.techTitle}
              </h2>
              <p className="services-block__intro">{s.techIntro}</p>
            </div>
            <div className="grid-2 services-block__grid">
              {s.tech.map((item) => (
                <ServiceCard
                  key={item.title}
                  item={item}
                  href={whatsappHref(wa, msg(item.title, "Assistência técnica"))}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ item, href }: { item: ServiceItem; href: string }) {
  return (
    <article className="service-card panel glass">
      <h3 className="service-card__title">{item.title}</h3>
      <p className="service-card__text">{item.description}</p>
      <ul className="service-card__list">
        {item.benefits.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <a href={href} target="_blank" rel="noopener noreferrer" className="btn--ghost">
        Solicitar serviço
      </a>
    </article>
  );
}
