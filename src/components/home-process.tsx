import Link from "next/link";
import type { SiteContent } from "@/types/site-content";

export function HomeProcess({ content }: { content: SiteContent }) {
  const p = content.ui.homeProcess;

  return (
    <section className="section">
      <div className="wrap">
        <div className="page-head">
          <p className="eyebrow">{p.eyebrow}</p>
          <h2 className="h2" style={{ marginTop: "0.5rem" }}>
            {p.title}
          </h2>
        </div>
        <div className="grid-4" style={{ marginTop: "1.25rem" }}>
          {p.steps.map((step, index) => (
            <article key={step.title} className="process-card">
              <span className="process-card__num">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="process-card__title">{step.title}</h3>
              <p className="process-card__text">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeCta({ content }: { content: SiteContent }) {
  const c = content.ui.homeCta;

  return (
    <section className="section section--tight">
      <div className="wrap">
        <div className="cta-box">
          <div>
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 className="h2" style={{ marginTop: "0.5rem" }}>
              {c.title}
            </h2>
            <p className="lead" style={{ marginTop: "0.5rem" }}>
              {c.lead}
            </p>
          </div>
          <div className="cta-box__actions">
            <Link href="/area-cliente" className="btn">
              {c.clientArea}
            </Link>
            <Link href="/contato" className="btn--ghost">
              {c.contact}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
