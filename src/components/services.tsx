"use client";

import { useEffect, useId, useRef, useState } from "react";
import { whatsappHref } from "@/lib/whatsapp";
import { defaultSiteContent } from "@/lib/default-site-content";
import type { ServiceItem, SiteContent } from "@/types/site-content";

function ServiceCard({
  item,
  cta,
  onRequest,
}: {
  item: ServiceItem;
  cta: string;
  onRequest: () => void;
}) {
  return (
    <article className="service-card panel glass">
      <h3 className="service-card__title">{item.title}</h3>
      <p className="service-card__text">{item.description}</p>
      <ul className="service-card__list">
        {item.benefits.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <button type="button" className="btn--ghost" onClick={onRequest}>
        {cta}
      </button>
    </article>
  );
}

export function Services({ content }: { content: SiteContent }) {
  const s = content.services;
  const request = s.request ?? defaultSiteContent.services.request;
  const wa = content.contact.whatsappNumber;
  const [active, setActive] = useState<{ item: ServiceItem; group: string } | null>(null);

  return (
    <section className="section scroll-mt-nav">
      <div className="wrap">
        <div className="page-head">
          <p className="eyebrow">{s.sectionKicker}</p>
          <h1 className="h2" style={{ marginTop: "0.5rem" }}>
            {s.title}
          </h1>
          <p className="lead">{s.subtitle}</p>
        </div>

        <div className="services-page">
          <section className="services-block" aria-labelledby="services-digital-heading">
            <div className="services-block__head panel glass">
              <h2 id="services-digital-heading" className="services-block__title">
                {s.digitalTitle}
              </h2>
            </div>
            <div className="grid-2 services-block__grid">
              {s.digital.map((item) => (
                <ServiceCard
                  key={item.title}
                  item={item}
                  cta={request.cta}
                  onRequest={() => setActive({ item, group: s.digitalTitle })}
                />
              ))}
            </div>
          </section>

          <section className="services-block" aria-labelledby="services-tech-heading">
            <div className="services-block__head panel glass">
              <h2 id="services-tech-heading" className="services-block__title">
                {s.techTitle}
              </h2>
              <p className="services-block__intro">{s.techIntro}</p>
            </div>
            <div className="grid-2 services-block__grid">
              {s.tech.map((item) => (
                <ServiceCard
                  key={item.title}
                  item={item}
                  cta={request.cta}
                  onRequest={() => setActive({ item, group: s.techTitle })}
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      {active ? (
        <ServiceRequestModal
          item={active.item}
          group={active.group}
          phone={wa}
          copy={request}
          onClose={() => setActive(null)}
        />
      ) : null}
    </section>
  );
}

function ServiceRequestModal({
  item,
  group,
  phone,
  copy,
  onClose,
}: {
  item: ServiceItem;
  group: string;
  phone: string;
  copy: SiteContent["services"]["request"];
  onClose: () => void;
}) {
  const titleId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nameRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    const contact = email.trim() || phoneInput.trim();
    if (!trimmedName || !contact) {
      setError(copy.validation);
      return;
    }

    const message = [
      `Olá, quero solicitar o serviço: ${item.title}`,
      `Grupo: ${group}`,
      `Nome: ${trimmedName}`,
      email.trim() ? `E-mail: ${email.trim()}` : "",
      phoneInput.trim() ? `Telefone: ${phoneInput.trim()}` : "",
      details.trim() ? `Detalhes: ${details.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(whatsappHref(phone, message), "_blank", "noopener,noreferrer");
    onClose();
  }

  return (
    <div className="service-modal" role="presentation" onClick={onClose}>
      <form
        className="service-modal__panel panel glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        onSubmit={submit}
      >
        <p className="eyebrow">{group}</p>
        <h3 id={titleId} className="service-modal__title">
          {copy.title}
        </h3>
        <p className="service-modal__text">
          {item.title}. {copy.lead}
        </p>

        <div className="service-request">
          <label>
            <span>{copy.nameLabel}</span>
            <input ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            <span>{copy.emailLabel}</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            <span>{copy.phoneLabel}</span>
            <input value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} />
          </label>
          <label>
            <span>{copy.detailsLabel}</span>
            <textarea
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={copy.detailsPlaceholder}
            />
          </label>
        </div>

        {error ? <p className="service-request__error">{error}</p> : null}

        <div className="service-request__actions">
          <button type="submit" className="btn">
            {copy.submit}
          </button>
          <button type="button" className="btn--ghost" onClick={onClose}>
            {copy.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}
