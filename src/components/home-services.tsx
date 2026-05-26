import Link from "next/link";
import type { SiteContent } from "@/types/site-content";

export function HomeServices({ content }: { content: SiteContent }) {
  const s = content.ui.homeServices;

  return (
    <section className="section">
      <div className="wrap">
        <div className="page-head">
          <p className="eyebrow">{s.eyebrow}</p>
          <h2 className="h2" style={{ marginTop: "0.5rem" }}>
            {s.title}
          </h2>
          <p className="lead">{s.lead}</p>
        </div>
        <div className="grid-4" style={{ marginTop: "1.25rem" }}>
          {s.items.map((item) => (
            <article key={item.title} className="service-card">
              <h3 className="service-card__title">{item.title}</h3>
              <p className="service-card__text">{item.desc}</p>
              <Link href={item.href ?? "/servicos"} className="btn--ghost">
                {s.learnMore}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
