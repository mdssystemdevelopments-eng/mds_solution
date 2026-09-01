import Image from "next/image";
import type { PortfolioItem } from "@/types/site-content";

export function ProjectCard({
  item,
  categoryLabels,
}: {
  item: PortfolioItem;
  categoryLabels: Record<string, string>;
}) {
  return (
    <article className="project-card">
      <div className="project-card__img-wrap">
        <Image
          src={item.image}
          alt={item.name}
          width={1200}
          height={750}
          className="project-card__img"
        />
        <span className="project-card__badge">{categoryLabels[item.category]}</span>
      </div>
      <div className="project-card__body">
        <p className="project-card__meta">
          <span className="text-accent">{item.stats.users}</span>
        </p>
        <h3 className="project-card__title">{item.name}</h3>
        <p className="project-card__client">{item.client}</p>
        <p className="project-card__desc">{item.description}</p>
        {item.stack.length > 0 ? (
          <p className="project-card__stack">Stack: {item.stack.join(" · ")}</p>
        ) : null}
      </div>
    </article>
  );
}
