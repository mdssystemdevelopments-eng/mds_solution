"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { SiteContent } from "@/types/site-content";

type ServiceCard = SiteContent["ui"]["homeServices"]["items"][number];

export function HomeServices({ content }: { content: SiteContent }) {
  const s = content.ui.homeServices;
  const [active, setActive] = useState<ServiceCard | null>(null);

  return (
    <section className="section">
      <div className="wrap">
        <div className="page-head">
          <p className="eyebrow">{s.eyebrow}</p>
          <h2 className="h2" style={{ marginTop: "0.5rem" }}>
            {s.title}
          </h2>
          <p className="lead">{s.lead}</p>
        </div>
        <div className="grid-4" style={{ marginTop: "1.25rem" }}>
          {s.items.map((item) => (
            <article key={item.title} className="service-card">
              <h3 className="service-card__title">{item.title}</h3>
              <p className="service-card__text">{item.desc}</p>
              <button type="button" className="btn--ghost" onClick={() => setActive(item)}>
                {s.learnMore}
              </button>
            </article>
          ))}
        </div>
      </div>

      {active ? (
        <ServiceModal
          item={active}
          kicker={s.eyebrow}
          closeLabel={s.close || "Fechar"}
          onClose={() => setActive(null)}
        />
      ) : null}
    </section>
  );
}

function ServiceModal({
  item,
  kicker,
  closeLabel,
  onClose,
}: {
  item: ServiceCard;
  kicker: string;
  closeLabel: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="service-modal" role="presentation" onClick={onClose}>
      <div
        className="service-modal__panel panel glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="eyebrow">{kicker}</p>
        <h3 id={titleId} className="service-modal__title">
          {item.title}
        </h3>
        <p className="service-modal__text">{item.details || item.desc}</p>
        {item.points?.length ? (
          <ul className="service-card__list">
            {item.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        ) : null}
        <button ref={closeRef} type="button" className="btn" onClick={onClose}>
          {closeLabel}
        </button>
      </div>
    </div>
  );
}
