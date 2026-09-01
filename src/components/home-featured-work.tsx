import Link from "next/link";
import type { SiteContent } from "@/types/site-content";
import { ProjectCard } from "@/components/project-card";

export function HomeFeaturedWork({ content }: { content: SiteContent }) {
  const items = content.portfolio.items.slice(0, 6);
  const f = content.ui.homeFeatured;

  return (
    <section className="section">
      <div className="wrap">
        <div
          className="page-head glass"
          style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem" }}
        >
          <div>
            <p className="eyebrow">{f.eyebrow}</p>
            <h2 className="h2" style={{ marginTop: "0.5rem" }}>
              {f.title}
            </h2>
            <p className="lead" style={{ marginTop: "0.5rem", maxWidth: "28rem" }}>
              {f.lead}
            </p>
          </div>
          <Link href="/portfolio" className="btn--ghost">
            {f.viewAll}
          </Link>
        </div>
        <div className="grid-3" style={{ marginTop: "1.25rem" }}>
          {items.map((item, index) => (
            <ProjectCard
              key={item.name}
              item={item}
              categoryLabels={content.ui.categoryLabels}
              featured={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
