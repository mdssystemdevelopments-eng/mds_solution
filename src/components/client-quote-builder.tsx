"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  formatQuoteEmailBody,
  formatQuoteEmailSubject,
  formatQuoteMessage,
  type QuoteFormData,
} from "@/lib/quote-formatter";
import { whatsappHref } from "@/lib/whatsapp";
import type { ClientServiceCategoryKey, ClientServiceEntry, SiteContent } from "@/types/site-content";

type Props = { content: SiteContent };

export function ClientQuoteBuilder({ content }: Props) {
  const reduce = useReducedMotion();
  const q = content.ui.clientQuote;
  const allClientServices = content.ui.clientServices;
  const clientServiceCategories = content.ui.clientServiceCategories;
  const categories = Object.keys(clientServiceCategories) as ClientServiceCategoryKey[];

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [urgency, setUrgency] = useState<QuoteFormData["urgency"]>("normal");
  const [budget, setBudget] = useState("");
  const [activeCategory, setActiveCategory] = useState<ClientServiceCategoryKey | "all" | null>(null);
  const [sentVia, setSentVia] = useState<"whatsapp" | "email" | null>(null);

  const wa = content.contact.whatsappNumber;
  const contactEmail = content.contact.email;

  const urgencyLabels = {
    normal: q.urgencyNormal,
    urgente: q.urgencyUrgent,
    flexivel: q.urgencyFlexible,
  };

  const selectedServices = useMemo(
    () => allClientServices.filter((s) => selectedIds.has(s.id)),
    [allClientServices, selectedIds],
  );

  const catalogOpen = activeCategory !== null;

  const filteredServices = useMemo(() => {
    if (!catalogOpen) return [];
    if (activeCategory === "all") return allClientServices;
    return allClientServices.filter((s) => s.category === activeCategory);
  }, [activeCategory, allClientServices, catalogOpen]);

  const activeLabel = !catalogOpen
    ? null
    : activeCategory === "all"
      ? q.tabAllServices
      : clientServiceCategories[activeCategory].label;

  const formData: QuoteFormData = {
    name,
    email,
    phone,
    company,
    message,
    selectedServices: selectedServices as QuoteFormData["selectedServices"],
    urgency,
    budget,
  };

  const isValid = name.trim().length >= 2 && email.includes("@") && selectedServices.length > 0;

  function toggleService(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function removeService(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function handleWhatsApp() {
    if (!isValid) return;
    window.open(
      whatsappHref(wa, formatQuoteMessage(formData, urgencyLabels)),
      "_blank",
      "noopener,noreferrer",
    );
    setSentVia("whatsapp");
  }

  function handleEmail() {
    if (!isValid) return;
    const subject = encodeURIComponent(formatQuoteEmailSubject(formData));
    const body = encodeURIComponent(formatQuoteEmailBody(formData, urgencyLabels));
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    setSentVia("email");
  }

  return (
    <section className="section scroll-mt-nav">
      <div className="wrap">
        <div className="page-head">
          <p className="eyebrow">{q.eyebrow}</p>
          <h1 className="h2 page-head__title">{q.title}</h1>
          <p className="lead">{q.lead}</p>
        </div>

        <div className="quote-layout">
          <div className="quote-catalog">
            <div className="panel quote-catalog__head">
              <h2 className="quote-catalog__title">{q.catalogTitle}</h2>
              <p className="quote-catalog__hint">{q.catalogHint}</p>

              <div className="quote-tabs" role="tablist" aria-label={q.catalogTitle}>
                <CategoryTab
                  active={activeCategory === "all"}
                  onClick={() => setActiveCategory("all")}
                  label={q.tabAll}
                />
                {categories.map((cat) => (
                  <CategoryTab
                    key={cat}
                    active={activeCategory === cat}
                    onClick={() => setActiveCategory(cat)}
                    label={clientServiceCategories[cat].label}
                  />
                ))}
              </div>

              {catalogOpen && activeLabel && (
                <p className="quote-catalog__active" aria-live="polite">
                  {q.showingPrefix} <span className="text-accent">{activeLabel}</span>
                  <span className="quote-catalog__count">
                    {" "}
                    ({filteredServices.length} {q.itemsSuffix})
                  </span>
                </p>
              )}
            </div>

            <AnimatePresence>
              {catalogOpen && activeLabel && (
                <motion.div
                  className="quote-list-reveal"
                  role="tabpanel"
                  aria-label={activeLabel}
                  initial={reduce ? false : { opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="panel quote-list">
                    <div className="quote-list__scroll">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeCategory ?? "none"}
                          className="quote-list__inner"
                          initial={reduce ? false : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={reduce ? undefined : { opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {filteredServices.length === 0 ? (
                            <p className="quote-list__empty">{q.emptyCategory}</p>
                          ) : (
                            filteredServices.map((service, i) => (
                              <motion.label
                                key={service.id}
                                className={`quote-item${selectedIds.has(service.id) ? " quote-item--on" : ""}`}
                                initial={reduce ? false : { opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  delay: reduce ? 0 : Math.min(i * 0.025, 0.2),
                                  duration: 0.25,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedIds.has(service.id)}
                                  onChange={() => toggleService(service.id)}
                                />
                                <span className="quote-item__body">
                                  <strong className="quote-item__title">{service.title}</strong>
                                  <span className="quote-item__desc">{service.description}</span>
                                  {service.priceHint && (
                                    <span className="quote-item__price">{service.priceHint}</span>
                                  )}
                                </span>
                              </motion.label>
                            ))
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="quote-sidebar">
            <div className="panel quote-selected">
              <div className="quote-selected__head">
                <h2 className="quote-selected__title">{q.selectedTitle}</h2>
                <span className="quote-selected__count">{selectedServices.length}</span>
              </div>

              {selectedServices.length === 0 ? (
                <p className="quote-selected__empty">{q.selectedEmpty}</p>
              ) : (
                <ul className="quote-selected__list">
                  <AnimatePresence mode="popLayout">
                    {selectedServices.map((service) => (
                      <SelectedChip
                        key={service.id}
                        service={service}
                        categoryLabel={clientServiceCategories[service.category].label}
                        removeLabel={q.removeService}
                        onRemove={() => removeService(service.id)}
                        reduce={!!reduce}
                      />
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            <div className="panel quote-form form-stack">
              <h2 className="quote-form__title">{q.formTitle}</h2>

              <Field label={q.nameLabel} value={name} onChange={setName} placeholder={q.namePlaceholder} />
              <Field
                label={q.emailLabel}
                value={email}
                onChange={setEmail}
                placeholder={q.emailPlaceholder}
                type="email"
              />
              <Field label={q.phoneLabel} value={phone} onChange={setPhone} placeholder={q.phonePlaceholder} />
              <Field
                label={q.companyLabel}
                value={company}
                onChange={setCompany}
                placeholder={q.companyPlaceholder}
              />

              <label className="field">
                <span className="field__label">{q.urgencyLabel}</span>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as QuoteFormData["urgency"])}
                  className="input"
                >
                  <option value="normal">{q.urgencyNormal}</option>
                  <option value="urgente">{q.urgencyUrgent}</option>
                  <option value="flexivel">{q.urgencyFlexible}</option>
                </select>
              </label>

              <Field
                label={q.budgetLabel}
                value={budget}
                onChange={setBudget}
                placeholder={q.budgetPlaceholder}
              />

              <label className="field">
                <span className="field__label">{q.detailsLabel}</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="input"
                  placeholder={q.detailsPlaceholder}
                />
              </label>

              <button type="button" onClick={handleWhatsApp} disabled={!isValid} className="btn btn--wa">
                {q.sendWhatsapp}
              </button>
              <button type="button" onClick={handleEmail} disabled={!isValid} className="btn--ghost">
                {q.sendEmail}
              </button>

              {!isValid && <p className="quote-form__hint">{q.validationHint}</p>}

              {sentVia && (
                <p className="text-ok quote-form__sent">
                  {sentVia === "whatsapp" ? q.sentWhatsapp : q.sentEmail}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`quote-tabs__btn${active ? " quote-tabs__btn--active" : ""}`}
    >
      {label}
    </button>
  );
}

function SelectedChip({
  service,
  categoryLabel,
  removeLabel,
  onRemove,
  reduce,
}: {
  service: ClientServiceEntry;
  categoryLabel: string;
  removeLabel: string;
  onRemove: () => void;
  reduce: boolean;
}) {
  return (
    <motion.li
      className="quote-selected__item"
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, x: 12, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={reduce ? undefined : { opacity: 0, x: -12, scale: 0.96 }}
      transition={{ duration: 0.2 }}
    >
      <span className="quote-selected__item-text">
        <strong>{service.title}</strong>
        <span>{categoryLabel}</span>
      </span>
      <button
        type="button"
        className="quote-selected__remove"
        onClick={onRemove}
        aria-label={`${removeLabel} ${service.title}`}
      >
        ×
      </button>
    </motion.li>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input"
      />
    </label>
  );
}
