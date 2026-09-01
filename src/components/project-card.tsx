"use client";

import { useEffect, useState } from "react";
import type { PortfolioItem } from "@/types/site-content";
import { projectGallery } from "@/lib/project-gallery";

export function ProjectCard({
  item,
  categoryLabels,
}: {
  item: PortfolioItem;
  categoryLabels: Record<string, string>;
}) {
  const photos = projectGallery(item);
  const cover = photos[0] ?? "";
  const extra = Math.max(0, photos.length - 1);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  function openAt(i: number) {
    if (!photos.length) return;
    setIndex(i);
    setOpen(true);
  }

  function close() {
    setOpen(false);
  }

  function prev() {
    setIndex((current) => (current - 1 + photos.length) % photos.length);
  }

  function next() {
    setIndex((current) => (current + 1) % photos.length);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") {
        setIndex((current) => (current - 1 + photos.length) % photos.length);
      }
      if (e.key === "ArrowRight") {
        setIndex((current) => (current + 1) % photos.length);
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, photos.length]);

  return (
    <>
      <article className="project-card">
        <button
          type="button"
          className="project-card__img-wrap"
          onClick={() => openAt(0)}
          disabled={!cover}
          aria-label={photos.length > 1 ? `Ver fotos de ${item.name}` : item.name}
        >
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="project-card__img" />
          ) : (
            <span className="project-card__img-empty">Sem imagem</span>
          )}
          <span className="project-card__badge">{categoryLabels[item.category]}</span>
          {extra > 0 ? (
            <span className="project-card__count">+{extra} foto{extra > 1 ? "s" : ""}</span>
          ) : null}
        </button>
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

      {open && photos.length > 0 ? (
        <div className="project-gallery site-overlay" role="dialog" aria-modal="true" aria-label={item.name} onClick={close}>
          <div className="project-gallery__frame" onClick={(e) => e.stopPropagation()}>
            <div className="project-gallery__head">
              <p className="project-gallery__title">{item.name}</p>
              <span className="project-gallery__index">
                {index + 1} / {photos.length}
              </span>
              <button type="button" className="project-gallery__close" onClick={close} aria-label="Fechar">
                Fechar
              </button>
            </div>
            <div className="project-gallery__stage">
              {photos.length > 1 ? (
                <button type="button" className="project-gallery__nav" onClick={prev} aria-label="Foto anterior">
                  ‹
                </button>
              ) : null}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photos[index]} alt={`${item.name} — foto ${index + 1}`} className="project-gallery__photo" />
              {photos.length > 1 ? (
                <button type="button" className="project-gallery__nav" onClick={next} aria-label="Próxima foto">
                  ›
                </button>
              ) : null}
            </div>
            {photos.length > 1 ? (
              <div className="project-gallery__thumbs">
                {photos.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    className={`project-gallery__thumb${i === index ? " is-active" : ""}`}
                    onClick={() => setIndex(i)}
                    aria-label={`Foto ${i + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
