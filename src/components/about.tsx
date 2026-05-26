import type { SiteContent } from "@/types/site-content";

export function About({ content }: { content: SiteContent }) {
  const a = content.about;

  return (
    <section className="section scroll-mt-nav">
      <div className="wrap">
        <div className="page-head">
          <p className="eyebrow">{a.sectionKicker}</p>
          <h1 className="h2 page-head__title">{a.title}</h1>
        </div>
        <div className="panel prose-block page-block" style={{ maxWidth: "42rem" }}>
          {a.paragraphs.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
          <blockquote>{a.highlight}</blockquote>
        </div>
      </div>
    </section>
  );
}
