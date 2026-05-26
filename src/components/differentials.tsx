import type { SiteContent } from "@/types/site-content";

export function Differentials({ content }: { content: SiteContent }) {
  const d = content.differentials;

  return (
    <section className="section">
      <div className="wrap">
        <div className="page-head">
          <p className="eyebrow">{d.sectionKicker}</p>
          <h2 className="h2" style={{ marginTop: "0.5rem" }}>
            {d.title}
          </h2>
        </div>
        <div className="grid-3" style={{ marginTop: "1.25rem" }}>
          {d.items.map((item, i) => (
            <article key={item.title} className="service-card">
              <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="service-card__title" style={{ marginTop: "0.5rem" }}>
                {item.title}
              </h3>
              <p className="service-card__text">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
