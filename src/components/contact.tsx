"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api-fetch";
import { whatsappHref } from "@/lib/whatsapp";
import type { SiteContent } from "@/types/site-content";

export function Contact({ content }: { content: SiteContent }) {
  const p = content.contactPage;
  const c = content.contact;
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setFeedback("");
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      body: (form.elements.namedItem("body") as HTMLTextAreaElement).value,
    };
    try {
      const res = await apiFetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro");
      setStatus("ok");
      setFeedback(json.message || p.successHint);
      form.reset();
    } catch {
      setStatus("error");
      setFeedback(p.errorHint);
    }
  }

  return (
    <section className="section scroll-mt-nav">
      <div className="wrap">
        <div className="page-head">
          <p className="eyebrow">{p.sectionKicker}</p>
          <h1 className="h2" style={{ marginTop: "0.5rem" }}>
            {p.title}
          </h1>
          <p className="lead">{p.intro}</p>
        </div>

        <div className="contact-grid" style={{ marginTop: "1.25rem" }}>
          <div className="panel" style={{ padding: "1.25rem" }}>
            <p className="eyebrow">Canais diretos</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
              <a
                href={whatsappHref(c.whatsappNumber, c.whatsappDefaultMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item"
              >
                <span className="contact-item__icon">WA</span>
                <span>
                  <strong style={{ display: "block" }}>{p.whatsappTitle}</strong>
                  <span style={{ fontSize: "0.8rem" }}>{p.whatsappSubtitle}</span>
                </span>
              </a>
              <a href={`mailto:${c.email}`} className="contact-item">
                <span className="contact-item__icon">@</span>
                <span>
                  <strong style={{ display: "block" }}>{p.emailCardLabel}</strong>
                  <span style={{ fontSize: "0.8rem" }}>{c.email}</span>
                </span>
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="panel form-stack" style={{ padding: "1.25rem" }}>
            <label className="field">
              <span className="field__label">{p.formNameLabel}</span>
              <input name="name" required autoComplete="name" className="input" placeholder={p.formNamePlaceholder} />
            </label>
            <label className="field">
              <span className="field__label">{p.formEmailLabel}</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="input"
                placeholder={p.formEmailPlaceholder}
              />
            </label>
            <label className="field">
              <span className="field__label">{p.formMessageLabel}</span>
              <textarea
                name="body"
                required
                rows={5}
                className="input"
                placeholder={p.formMessagePlaceholder}
              />
            </label>
            {feedback && (
              <p className={status === "ok" ? "text-ok" : ""} style={{ fontSize: "0.875rem" }} role="status">
                {feedback}
              </p>
            )}
            <button type="submit" disabled={status === "loading"} className="btn" style={{ width: "100%" }}>
              {status === "loading" ? p.formSubmitting : p.formSubmit}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
