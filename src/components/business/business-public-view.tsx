"use client";

import { useEffect, useRef, useState } from "react";
import type { BusinessBlock, BusinessCompany, BusinessDesign, BusinessProject } from "@/lib/business/types";
import { arr, str } from "@/lib/business/blocks";
import { mediaSrc, sanitizeHtml } from "@/lib/business/helpers";
import { lookTheme } from "@/lib/business/palettes";
import { PAGE_CTA } from "@/lib/business/cta";
import { LeadAction, LeadProvider } from "@/components/business/business-lead";

function IsolatedHtml({ html, preview }: { html: string; preview?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const root = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    root.innerHTML = [
      "<style>:host{display:block;color:var(--bp-text);font:inherit}p,h1,h2,h3,h4,li{margin:0 0 .7em}img,video,iframe{max-width:100%;height:auto}*{box-sizing:border-box;max-width:100%}</style>",
      sanitizeHtml(html, 20000, preview),
    ].join("");
  }, [html, preview]);
  return <div ref={ref} className="bp-html" />;
}

function EmptyNote({ preview, text }: { preview?: boolean; text: string }) {
  if (!preview) return null;
  return <p className="bp-empty">{text}</p>;
}

function BlockView({
  block,
  preview,
  cover,
}: {
  block: BusinessBlock;
  preview?: boolean;
  cover?: string;
}) {
  const c = block.content;
  if (block.hidden) return null;

  if (block.type === "hero") {
    const image = mediaSrc(str(c, "image") || cover || "");
    return (
      <section className={`bp-hero bp-hero--${str(c, "height", "md")} bp-hero--${str(c, "align", "left")}`}>
        {image ? <img src={image} alt="" className="bp-hero__bg" /> : null}
        {c.overlay !== false ? <div className="bp-hero__overlay" /> : null}
        <div className="bp-wrap bp-hero__copy">
          {str(c, "subtitle") ? <p className="bp-kicker">{str(c, "subtitle")}</p> : null}
          {str(c, "title") ? <h1>{str(c, "title")}</h1> : null}
          {str(c, "text") ? <p>{str(c, "text")}</p> : null}
          {str(c, "buttonLabel") ? (
            <LeadAction className="bp-btn" href={str(c, "buttonHref") || PAGE_CTA} label={str(c, "buttonLabel")}>
              {str(c, "buttonLabel")}
            </LeadAction>
          ) : null}
        </div>
      </section>
    );
  }

  if (block.type === "text") {
    const html = str(c, "html");
    const plain = html.replace(/<[^>]+>/g, "").trim();
    if (!plain && !str(c, "title")) return <EmptyNote preview={preview} text="Bloco de texto vazio." />;
    return (
      <section className="bp-wrap bp-section">
        {str(c, "title") ? <h2>{str(c, "title")}</h2> : null}
        {plain ? <IsolatedHtml html={html} preview={preview} /> : null}
      </section>
    );
  }

  if (block.type === "image") {
    const src = mediaSrc(str(c, "src"));
    if (!src) return <EmptyNote preview={preview} text="Envie uma imagem neste bloco." />;
    const img = (
      <figure className="bp-figure">
        <img src={src} alt={str(c, "alt")} />
        {str(c, "caption") ? <figcaption>{str(c, "caption")}</figcaption> : null}
      </figure>
    );
    return (
      <section className="bp-wrap bp-section">
        {str(c, "href") && !str(c, "href").startsWith("#") ? <a href={str(c, "href")}>{img}</a> : img}
      </section>
    );
  }

  if (block.type === "gallery") {
    return <GalleryBlock content={c} preview={preview} />;
  }

  if (block.type === "video") {
    const embed = toEmbed(str(c, "url"));
    const thumb = mediaSrc(str(c, "thumb"));
    if (!embed && !thumb) return <EmptyNote preview={preview} text="Cole a URL do video neste bloco." />;
    return (
      <section className="bp-wrap bp-section">
        {str(c, "title") ? <h2>{str(c, "title")}</h2> : null}
        {str(c, "text") ? <p>{str(c, "text")}</p> : null}
        {embed ? (
          <div className="bp-video">
            <iframe src={embed} title={str(c, "title") || "Video"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        ) : (
          <img src={thumb} alt="" />
        )}
      </section>
    );
  }

  if (block.type === "pdf") {
    const src = str(c, "src");
    if (!src) return <EmptyNote preview={preview} text="Envie um PDF neste bloco." />;
    return (
      <section className="bp-wrap bp-section bp-pdf">
        <div>
          <h2>{str(c, "title", "Documento")}</h2>
          <div className="bp-actions">
            <a className="bp-btn" href={src} target="_blank" rel="noreferrer">
              Abrir
            </a>
            <a className="bp-btn bp-btn--ghost" href={src} download>
              {str(c, "label", "Baixar PDF")}
            </a>
          </div>
        </div>
      </section>
    );
  }

  if (block.type === "cards") {
    const items = arr(c, "items").filter((item) => str(item, "title") || str(item, "text") || mediaSrc(str(item, "image")));
    if (!items.length) return <EmptyNote preview={preview} text="Adicione itens neste bloco de cards." />;
    return (
      <section className="bp-wrap bp-section">
        <div className="bp-cards">
          {items.map((item, i) => (
            <article key={i} className="bp-card">
              {mediaSrc(str(item, "image")) ? <img src={mediaSrc(str(item, "image"))} alt="" /> : null}
              {str(item, "title") ? <h3>{str(item, "title")}</h3> : null}
              {str(item, "text") ? <p>{str(item, "text")}</p> : null}
              {str(item, "href") ? (
                <LeadAction className="bp-card__link" href={str(item, "href")} label={str(item, "title") || "card"}>
                  Ver
                </LeadAction>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === "stats") {
    const items = arr(c, "items").filter((item) => str(item, "value") || str(item, "label"));
    if (!items.length) return <EmptyNote preview={preview} text="Adicione indicadores neste bloco." />;
    return (
      <section className="bp-wrap bp-section">
        <div className="bp-stats">
          {items.map((item, i) => (
            <div key={i} className="bp-stat">
              <strong>{str(item, "value")}</strong>
              <span>{str(item, "label")}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === "testimonials") {
    const items = arr(c, "items").filter((item) => str(item, "text") || str(item, "name"));
    if (!items.length) return <EmptyNote preview={preview} text="Adicione depoimentos neste bloco." />;
    return (
      <section className="bp-wrap bp-section">
        <div className="bp-cards">
          {items.map((item, i) => (
            <blockquote key={i} className="bp-card">
              {str(item, "text") ? <p>{str(item, "text")}</p> : null}
              <footer>
                {str(item, "name")}
                {str(item, "role") ? ` · ${str(item, "role")}` : ""}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === "timeline") {
    const items = arr(c, "items").filter((item) => str(item, "title") || str(item, "text"));
    if (!items.length) return <EmptyNote preview={preview} text="Adicione etapas neste bloco." />;
    return (
      <section className="bp-wrap bp-section">
        {str(c, "title") ? <h2>{str(c, "title")}</h2> : null}
        <ol className="bp-time">
          {items.map((item, i) => (
            <li key={i}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                {str(item, "title") ? <h3>{str(item, "title")}</h3> : null}
                {str(item, "text") ? <p>{str(item, "text")}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  if (block.type === "table") {
    const headers = Array.isArray(c.headers) ? c.headers.map(String) : [];
    const rows = Array.isArray(c.rows) ? (c.rows as unknown[][]).map((row) => (Array.isArray(row) ? row.map(String) : [])) : [];
    if (!headers.length && !rows.length) return <EmptyNote preview={preview} text="Preencha a tabela neste bloco." />;
    return (
      <section className="bp-wrap bp-section">
        <div className="bp-table-wrap">
          <table>
            {headers.length ? (
              <thead>
                <tr>
                  {headers.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  if (block.type === "pricing") {
    const plans = arr(c, "plans").filter((plan) => str(plan, "name") || str(plan, "price"));
    if (!plans.length) return <EmptyNote preview={preview} text="Adicione planos neste bloco." />;
    return (
      <section className="bp-wrap bp-section">
        {str(c, "title") ? <h2>{str(c, "title")}</h2> : null}
        <div className="bp-cards">
          {plans.map((plan, i) => (
            <article key={i} className="bp-card bp-card--plan">
              {str(plan, "name") ? <h3>{str(plan, "name")}</h3> : null}
              {str(plan, "price") ? <p className="bp-price">{str(plan, "price")}</p> : null}
              {str(plan, "text") ? <p>{str(plan, "text")}</p> : null}
              {Array.isArray(plan.items) && plan.items.length ? (
                <ul className="bp-plan-list">
                  {plan.items.map((item, idx) => (
                    <li key={idx}>{String(item)}</li>
                  ))}
                </ul>
              ) : null}
              {str(plan, "buttonLabel") ? (
                <LeadAction className="bp-btn" href={str(plan, "buttonHref") || PAGE_CTA} label={str(plan, "buttonLabel")}>
                  {str(plan, "buttonLabel")}
                </LeadAction>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === "faq") {
    const items = arr(c, "items").filter((item) => str(item, "q") || str(item, "a"));
    if (!items.length) return <EmptyNote preview={preview} text="Adicione perguntas neste bloco." />;
    return (
      <section className="bp-wrap bp-section">
        {items.map((item, i) => (
          <details key={i} className="bp-faq">
            <summary>{str(item, "q")}</summary>
            {str(item, "a") ? <p>{str(item, "a")}</p> : null}
          </details>
        ))}
      </section>
    );
  }

  if (block.type === "button") {
    if (!str(c, "label")) return <EmptyNote preview={preview} text="Defina o texto do botao." />;
    return (
      <section className="bp-wrap bp-section bp-section--center">
        <LeadAction className="bp-btn" href={str(c, "href") || PAGE_CTA} label={str(c, "label")}>
          {str(c, "label")}
        </LeadAction>
      </section>
    );
  }

  if (block.type === "cta") {
    return (
      <section className="bp-cta">
        <div className="bp-wrap">
          {str(c, "title") ? <h2>{str(c, "title")}</h2> : null}
          {str(c, "text") ? <p>{str(c, "text")}</p> : null}
          <LeadAction className="bp-btn" href={str(c, "buttonHref") || PAGE_CTA} label={str(c, "buttonLabel") || "Quero conversar"}>
            {str(c, "buttonLabel") || "Quero conversar"}
          </LeadAction>
        </div>
      </section>
    );
  }

  if (block.type === "contact") {
    const hasInfo = str(c, "phone") || str(c, "whatsapp") || str(c, "email") || str(c, "address");
    return (
      <section className="bp-wrap bp-section">
        <h2>Contato</h2>
        {hasInfo ? (
          <ul className="bp-contact">
            {str(c, "phone") ? <li>{str(c, "phone")}</li> : null}
            {str(c, "whatsapp") ? <li>{str(c, "whatsapp")}</li> : null}
            {str(c, "email") ? <li>{str(c, "email")}</li> : null}
            {str(c, "address") ? <li>{str(c, "address")}</li> : null}
          </ul>
        ) : null}
        <LeadAction className="bp-btn" href={str(c, "buttonHref") || PAGE_CTA} label={str(c, "buttonLabel") || "Quero conversar"}>
          {str(c, "buttonLabel") || "Quero conversar"}
        </LeadAction>
      </section>
    );
  }

  if (block.type === "form") {
    return (
      <section className="bp-wrap bp-section bp-form-block">
        {str(c, "title") ? <h2>{str(c, "title")}</h2> : <h2>Deixe seu contato</h2>}
        {str(c, "text") ? <p>{str(c, "text")}</p> : <p>A MDS responde por WhatsApp.</p>}
        <LeadAction className="bp-btn" href={PAGE_CTA} label="formulario">
          Quero conversar
        </LeadAction>
      </section>
    );
  }

  if (block.type === "divider") return <hr className="bp-hr" />;

  if (block.type === "html") {
    const html = str(c, "html");
    const plain = html.replace(/<[^>]+>/g, "").trim();
    if (!plain) return <EmptyNote preview={preview} text="Cole o HTML neste bloco." />;
    return (
      <section className="bp-wrap bp-section">
        <IsolatedHtml html={html} preview={preview} />
      </section>
    );
  }

  return null;
}

function GalleryBlock({ content, preview }: { content: Record<string, unknown>; preview?: boolean }) {
  const images = Array.isArray(content.images) ? content.images.map(mediaSrc).filter(Boolean) : [];
  const [open, setOpen] = useState<number | null>(null);
  const cols = numSafe(content.columns, 3);
  if (!images.length) return <EmptyNote preview={preview} text="Envie as fotos deste bloco." />;
  return (
    <section className="bp-wrap bp-section">
      <div className="bp-gallery" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {images.map((src, i) => (
          <button key={`${src}-${i}`} type="button" onClick={() => setOpen(i)}>
            <img src={src} alt="" />
          </button>
        ))}
      </div>
      {open !== null && images[open] ? (
        <div className="bp-lite site-overlay" onClick={() => setOpen(null)}>
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
  preview = false,
}: {
  project: BusinessProject;
  company?: BusinessCompany | null;
  preview?: boolean;
}) {
  const d: BusinessDesign = project.design;
  const theme = lookTheme(d.theme);
  return (
    <LeadProvider project={project} company={company} preview={preview}>
      <div
        className={`bp-root bp-root--${theme}`}
        style={{
          ["--bp-bg" as string]: d.background,
          ["--bp-text" as string]: d.text,
          ["--bp-primary" as string]: d.primary,
          ["--bp-secondary" as string]: d.secondary,
          ["--bp-on-primary" as string]: d.onPrimary || (theme === "light" ? "#ffffff" : "#031018"),
          ["--bp-radius" as string]: d.radius,
          fontFamily: d.font || "system-ui, sans-serif",
        }}
      >
        {d.showHeader ? (
          <header className="bp-top">
            <div className="bp-wrap bp-top__in">
              {mediaSrc(d.logo) ? <img src={mediaSrc(d.logo)} alt="" className="bp-logo" /> : <strong>{company?.name || project.title}</strong>}
              {company?.tradeName || company?.name ? <span>{company.tradeName || company.name}</span> : null}
            </div>
          </header>
        ) : null}
        {mediaSrc(project.cover) && !project.blocks.some((block) => block.type === "hero") ? (
          <div className="bp-cover">
            <img src={mediaSrc(project.cover)} alt="" />
          </div>
        ) : null}
        {project.blocks.map((block) => (
          <BlockView key={block.id} block={block} preview={preview} cover={project.cover} />
        ))}
        {d.showFooter ? (
          <footer className="bp-foot">
            <div className="bp-wrap bp-foot__in">
              <span>{company?.name || project.title}</span>
              <LeadAction className="bp-foot__cta" href={PAGE_CTA} label="rodape">
                Quero conversar
              </LeadAction>
            </div>
          </footer>
        ) : null}
      </div>
    </LeadProvider>
  );
}
