"use client";

import type { BusinessBlock, BusinessCompany, BusinessDesign, BusinessProject } from "@/lib/business/types";
import { arr, str } from "@/lib/business/blocks";
import { useState } from "react";

function track(projectId: string, kind: "click" | "download", label: string) {
  void fetch("/api/business/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId, kind, meta: { label } }),
  });
}

function BlockView({ block, projectId }: { block: BusinessBlock; projectId: string }) {
  const c = block.content;
  if (block.hidden) return null;

  if (block.type === "hero") {
    return (
      <section className={`bp-hero bp-hero--${str(c, "height", "md")} bp-hero--${str(c, "align", "left")}`}>
        {str(c, "image") ? <img src={str(c, "image")} alt="" className="bp-hero__bg" /> : null}
        {c.overlay ? <div className="bp-hero__overlay" /> : null}
        <div className="bp-wrap bp-hero__copy">
          {str(c, "subtitle") ? <p className="bp-kicker">{str(c, "subtitle")}</p> : null}
          <h1>{str(c, "title")}</h1>
          {str(c, "text") ? <p>{str(c, "text")}</p> : null}
          {str(c, "buttonLabel") ? (
            <a href={str(c, "buttonHref") || "#"} className="bp-btn" onClick={() => track(projectId, "click", str(c, "buttonLabel"))}>
              {str(c, "buttonLabel")}
            </a>
          ) : null}
        </div>
      </section>
    );
  }

  if (block.type === "text") {
    return (
      <section className="bp-wrap bp-section">
        {str(c, "title") ? <h2>{str(c, "title")}</h2> : null}
        <div className="bp-rich" dangerouslySetInnerHTML={{ __html: str(c, "html") }} />
      </section>
    );
  }

  if (block.type === "image") {
    const img = (
      <figure className={`bp-figure bp-figure--${str(c, "width", "full")}`}>
        {str(c, "src") ? <img src={str(c, "src")} alt={str(c, "alt")} /> : null}
        {str(c, "caption") ? <figcaption>{str(c, "caption")}</figcaption> : null}
      </figure>
    );
    return (
      <section className="bp-wrap bp-section">
        {str(c, "href") ? <a href={str(c, "href")}>{img}</a> : img}
      </section>
    );
  }

  if (block.type === "gallery") {
    return <GalleryBlock content={c} />;
  }

  if (block.type === "video") {
    const url = str(c, "url");
    const embed = toEmbed(url);
    return (
      <section className="bp-wrap bp-section">
        {str(c, "title") ? <h2>{str(c, "title")}</h2> : null}
        {str(c, "text") ? <p>{str(c, "text")}</p> : null}
        {embed ? (
          <div className="bp-video"><iframe src={embed} title={str(c, "title") || "Video"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
        ) : str(c, "thumb") ? (
          <img src={str(c, "thumb")} alt="" />
        ) : null}
      </section>
    );
  }

  if (block.type === "pdf") {
    return (
      <section className="bp-wrap bp-section bp-pdf">
        <h2>{str(c, "title", "Documento")}</h2>
        {str(c, "src") ? (
          <div className="bp-actions">
            <a className="bp-btn" href={str(c, "src")} target="_blank" rel="noreferrer" onClick={() => track(projectId, "click", "abrir-pdf")}>Abrir</a>
            <a className="bp-btn bp-btn--ghost" href={str(c, "src")} download onClick={() => track(projectId, "download", str(c, "title"))}>{str(c, "label", "Baixar PDF")}</a>
          </div>
        ) : null}
      </section>
    );
  }

  if (block.type === "cards") {
    return (
      <section className="bp-wrap bp-section">
        <div className="bp-cards">
          {arr(c, "items").map((item, i) => (
            <article key={i} className="bp-card">
              {str(item, "image") ? <img src={str(item, "image")} alt="" /> : null}
              <h3>{str(item, "title")}</h3>
              <p>{str(item, "text")}</p>
              {str(item, "href") ? <a href={str(item, "href")}>Ver</a> : null}
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === "stats") {
    return (
      <section className="bp-wrap bp-section bp-stats">
        {arr(c, "items").map((item, i) => (
          <div key={i}><strong>{str(item, "value")}</strong><span>{str(item, "label")}</span></div>
        ))}
      </section>
    );
  }

  if (block.type === "testimonials") {
    return (
      <section className="bp-wrap bp-section">
        <div className="bp-cards">
          {arr(c, "items").map((item, i) => (
            <blockquote key={i} className="bp-card">
              <p>{str(item, "text")}</p>
              <footer>{str(item, "name")} · {str(item, "role")}</footer>
            </blockquote>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === "timeline") {
    return (
      <section className="bp-wrap bp-section">
        {str(c, "title") ? <h2>{str(c, "title")}</h2> : null}
        <ol className="bp-time">
          {arr(c, "items").map((item, i) => (
            <li key={i}><span>{String(i + 1).padStart(2, "0")}</span><div><h3>{str(item, "title")}</h3><p>{str(item, "text")}</p></div></li>
          ))}
        </ol>
      </section>
    );
  }

  if (block.type === "table") {
    const headers = Array.isArray(c.headers) ? c.headers.map(String) : [];
    const rows = Array.isArray(c.rows) ? (c.rows as unknown[][]).map((row) => (Array.isArray(row) ? row.map(String) : [])) : [];
    return (
      <section className="bp-wrap bp-section">
        <div className="bp-table-wrap">
          <table>
            <thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </section>
    );
  }

  if (block.type === "pricing") {
    return (
      <section className="bp-wrap bp-section">
        {str(c, "title") ? <h2>{str(c, "title")}</h2> : null}
        <div className="bp-cards">
          {arr(c, "plans").map((plan, i) => (
            <article key={i} className="bp-card">
              <h3>{str(plan, "name")}</h3>
              <p className="bp-price">{str(plan, "price")}</p>
              <p>{str(plan, "text")}</p>
              <ul>{(Array.isArray(plan.items) ? plan.items : []).map((item, idx) => <li key={idx}>{String(item)}</li>)}</ul>
              {str(plan, "buttonLabel") ? <a className="bp-btn" href={str(plan, "buttonHref") || "#"}>{str(plan, "buttonLabel")}</a> : null}
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === "faq") {
    return (
      <section className="bp-wrap bp-section">
        {arr(c, "items").map((item, i) => (
          <details key={i} className="bp-faq"><summary>{str(item, "q")}</summary><p>{str(item, "a")}</p></details>
        ))}
      </section>
    );
  }

  if (block.type === "button") {
    return (
      <section className="bp-wrap bp-section">
        <a className="bp-btn" href={str(c, "href") || "#"} onClick={() => track(projectId, "click", str(c, "label"))}>{str(c, "label")}</a>
      </section>
    );
  }

  if (block.type === "cta") {
    return (
      <section className="bp-cta">
        <div className="bp-wrap">
          <h2>{str(c, "title")}</h2>
          <p>{str(c, "text")}</p>
          <a className="bp-btn" href={str(c, "buttonHref") || "#"} onClick={() => track(projectId, "click", str(c, "buttonLabel"))}>{str(c, "buttonLabel")}</a>
        </div>
      </section>
    );
  }

  if (block.type === "contact") {
    return (
      <section className="bp-wrap bp-section">
        <h2>Contato</h2>
        <ul className="bp-contact">
          {str(c, "phone") ? <li>Telefone: {str(c, "phone")}</li> : null}
          {str(c, "whatsapp") ? <li>WhatsApp: {str(c, "whatsapp")}</li> : null}
          {str(c, "email") ? <li>E-mail: {str(c, "email")}</li> : null}
          {str(c, "address") ? <li>{str(c, "address")}</li> : null}
        </ul>
        {str(c, "buttonLabel") ? <a className="bp-btn" href={str(c, "buttonHref") || "#"}>{str(c, "buttonLabel")}</a> : null}
      </section>
    );
  }

  if (block.type === "form") {
    return (
      <section className="bp-wrap bp-section">
        <h2>{str(c, "title")}</h2>
        <p>{str(c, "text")}</p>
        <p className="bp-note">Use o WhatsApp ou o e-mail da MDS para enviar o pedido.</p>
      </section>
    );
  }

  if (block.type === "divider") return <hr className="bp-hr" />;

  if (block.type === "html") {
    return <section className="bp-wrap bp-section" dangerouslySetInnerHTML={{ __html: str(c, "html") }} />;
  }

  return null;
}

function GalleryBlock({ content }: { content: Record<string, unknown> }) {
  const images = Array.isArray(content.images) ? content.images.map(String).filter(Boolean) : [];
  const [open, setOpen] = useState<number | null>(null);
  const cols = numSafe(content.columns, 3);
  return (
    <section className="bp-wrap bp-section">
      <div className={`bp-gallery bp-gallery--${String(content.layout || "grid")}`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {images.map((src, i) => (
          <button key={`${src}-${i}`} type="button" onClick={() => setOpen(i)}>
            <img src={src} alt="" />
          </button>
        ))}
      </div>
      {open !== null && images[open] ? (
        <div className="bp-lite" onClick={() => setOpen(null)}>
          <img src={images[open]} alt="" />
        </div>
      ) : null}
    </section>
  );
}

function numSafe(value: unknown, fallback: number) {
  return typeof value === "number" && value > 0 ? Math.min(6, value) : fallback;
}

function toEmbed(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu")) {
      const id = u.hostname === "youtu.be" ? u.pathname.slice(1) : u.searchParams.get("v");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : "";
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : "";
    }
  } catch {
    return "";
  }
  return "";
}

export function BusinessPublicView({
  project,
  company,
}: {
  project: BusinessProject;
  company?: BusinessCompany | null;
}) {
  const d: BusinessDesign = project.design;
  return (
    <div
      className={`bp-root bp-root--${d.theme}`}
      style={{
        ["--bp-bg" as string]: d.background,
        ["--bp-text" as string]: d.text,
        ["--bp-primary" as string]: d.primary,
        ["--bp-secondary" as string]: d.secondary,
        ["--bp-radius" as string]: d.radius,
        fontFamily: d.font || "system-ui, sans-serif",
      }}
    >
      {d.showHeader ? (
        <header className="bp-top">
          <div className="bp-wrap bp-top__in">
            {d.logo ? <img src={d.logo} alt="" className="bp-logo" /> : <strong>{company?.name || project.title}</strong>}
            <span>{company?.tradeName || company?.name || "MDS Solution"}</span>
          </div>
        </header>
      ) : null}
      {project.blocks.map((block) => (
        <BlockView key={block.id} block={block} projectId={project.id} />
      ))}
      {d.showFooter ? (
        <footer className="bp-foot">
          <div className="bp-wrap">{company?.name || project.title} · MDS Solucoes em Tecnologia</div>
        </footer>
      ) : null}
    </div>
  );
}
