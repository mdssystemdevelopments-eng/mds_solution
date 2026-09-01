"use client";

import { useState } from "react";
import type { SiteContent } from "@/types/site-content";
import { ProjectCard } from "@/components/project-card";

export function Portfolio({ content }: { content: SiteContent }) {
  const p = content.portfolio;
  const labels = content.ui.categoryLabels;
  const filterAll = content.ui.portfolio.filterAll;
  const categories = ["todos", ...Array.from(new Set(p.items.map((i) => i.category)))];
  const [filter, setFilter] = useState("todos");
  const filtered = filter === "todos" ? p.items : p.items.filter((i) => i.category === filter);

  return (
    <section className="section scroll-mt-nav">
      <div className="wrap">
        <div className="page-head">
          <p className="eyebrow">{p.sectionKicker}</p>
          <h1 className="h2" style={{ marginTop: "0.5rem" }}>
            {p.title}
          </h1>
          <p className="lead">{p.subtitle}</p>
        </div>

        <div className="filter-bar" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1.25rem", padding: "0.75rem 1rem" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`filter-pill${filter === cat ? " filter-pill--active" : ""}`}
            >
              {cat === "todos" ? filterAll : labels[cat] ?? cat}
            </button>
          ))}
        </div>

        <div className="grid-2" style={{ marginTop: "1.25rem" }}>
          {filtered.map((item, index) => (
            <ProjectCard
              key={item.name}
              item={item}
              categoryLabels={labels}
              featured={filter === "todos" && index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
