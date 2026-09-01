"use client";

import { createContext, useContext, useState } from "react";
import { PAGE_CTA, isPageCta, projectWhatsapp } from "@/lib/business/cta";
import { whatsappHref } from "@/lib/whatsapp";
import type { BusinessCompany, BusinessProject } from "@/lib/business/types";

type LeadContextValue = {
  preview?: boolean;
  projectId: string;
  open: () => void;
};

const LeadContext = createContext<LeadContextValue | null>(null);

export function useLead() {
  return useContext(LeadContext);
}

export function LeadProvider({
  project,
  company,
  preview,
  children,
}: {
  project: BusinessProject;
  company?: BusinessCompany | null;
  preview?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const phone = projectWhatsapp(project.design.whatsapp, company?.whatsapp);

  return (
    <LeadContext.Provider value={{ preview, projectId: project.id, open: () => setOpen(true) }}>
      {children}
      {open ? (
        <LeadPanel
          project={project}
          phone={phone}
          preview={preview}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </LeadContext.Provider>
  );
}

export function LeadAction({
  href,
  className,
  children,
  label,
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
  label: string;
}) {
  const lead = useLead();
  const target = href || PAGE_CTA;

  if (lead && isPageCta(target)) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => {
          if (!lead.preview) {
            void fetch("/api/business/track", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ projectId: lead.projectId, kind: "click", meta: { label } }),
            });
          }
          lead.open();
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <a className={className} href={target} target={target.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
      {children}
    </a>
  );
}

function LeadPanel({
  project,
  phone,
  preview,
  onClose,
}: {
  project: BusinessProject;
  phone: string;
  preview?: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [wa, setWa] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (preview) {
      setDone(true);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/business/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          name,
          phone: whatsapp,
          message,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Nao foi possivel enviar.");
        return;
      }
      setWa(typeof json.whatsappUrl === "string" ? json.whatsappUrl : whatsappHref(phone, leadText(project.title, name, whatsapp, message)));
      setDone(true);
    } catch {
      setError("Nao foi possivel enviar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bp-lead site-overlay" role="dialog" aria-modal="true" aria-labelledby="bp-lead-title">
      <button type="button" className="bp-lead__bg" aria-label="Fechar" onClick={onClose} />
      <div className="bp-lead__card">
        {done ? (
          <>
            <h2 id="bp-lead-title">Recebemos o seu contato</h2>
            <p>A MDS responde por WhatsApp. Pode fechar esta janela.</p>
            {wa ? (
              <a className="bp-btn" href={wa} target="_blank" rel="noreferrer">
                Abrir WhatsApp
              </a>
            ) : null}
            <button type="button" className="bp-btn bp-btn--ghost" onClick={onClose}>
              Fechar
            </button>
          </>
        ) : (
          <form onSubmit={(e) => void submit(e)}>
            <h2 id="bp-lead-title">Falar sobre este projeto</h2>
            <p>{project.title}</p>
            <label>
              Nome
              <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
            </label>
            <label>
              WhatsApp
              <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required autoComplete="tel" />
            </label>
            <label>
              Mensagem
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} required />
            </label>
            {error ? <p className="bp-lead__error">{error}</p> : null}
            <button type="submit" className="bp-btn" disabled={busy}>
              {busy ? "Enviando..." : "Enviar"}
            </button>
            <button type="button" className="bp-btn bp-btn--ghost" onClick={onClose}>
              Cancelar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function leadText(title: string, name: string, phone: string, message: string) {
  return `Projeto: ${title}\nNome: ${name}\nWhatsApp: ${phone}\n${message}`;
}
