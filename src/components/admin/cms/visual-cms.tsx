"use client";

import { useState } from "react";
import Link from "next/link";
import { ADMIN_PAGES, getAdminPage, type AdminSectionId } from "@/lib/admin-pages";
import { useAdminContent } from "@/hooks/use-admin-content";
import { SectionEditor } from "@/components/admin/cms/section-editor";
import { AdminEditor } from "@/components/admin/admin-editor";

type ViewMode = "visual" | "json";

export function VisualCms() {
  const { content, loading, saving, dirty, load, patch, save } = useAdminContent();
  const [pageId, setPageId] = useState(ADMIN_PAGES[1]?.id ?? "home");
  const [sectionId, setSectionId] = useState<AdminSectionId>("hero");
  const [mode, setMode] = useState<ViewMode>("visual");

  const page = getAdminPage(pageId);
  const section = page?.sections.find((s) => s.id === sectionId) ?? page?.sections[0];

  function selectPage(id: string) {
    setPageId(id);
    const p = getAdminPage(id);
    if (p?.sections[0]) setSectionId(p.sections[0].id);
  }

  if (loading || !content) {
    return (
      <div className="cms-root">
        <div className="cms-loading">
          <span className="login-solution__spinner" aria-hidden />
          Carregando conteúdo…
        </div>
      </div>
    );
  }

  if (mode === "json") {
    return (
      <div className="cms-root">
        <div className="cms-topbar">
          <button type="button" className="cms-mode-btn" onClick={() => setMode("visual")}>
            ← Editor visual
          </button>
        </div>
        <AdminEditor embedded />
      </div>
    );
  }

  return (
    <div className="cms-root">
      <header className="cms-topbar">
        <div>
          <h1 className="cms-topbar__title">Editor do site</h1>
          <p className="cms-topbar__sub">Escolha a página, depois a seção que deseja editar.</p>
        </div>
        <div className="cms-topbar__actions">
          {dirty && <span className="cms-dirty">Alterações não salvas</span>}
          <button type="button" onClick={() => load()} disabled={saving} className="cms-btn cms-btn--ghost">
            Recarregar
          </button>
          <button type="button" onClick={() => setMode("json")} className="cms-btn cms-btn--ghost">
            Modo JSON
          </button>
          <button type="button" onClick={() => save()} disabled={saving || !dirty} className="cms-btn cms-btn--primary">
            {saving ? "Salvando…" : "Salvar alterações"}
          </button>
        </div>
      </header>

      <div className="cms-layout">
        <aside className="cms-pages">
          <p className="cms-pages__label">Páginas</p>
          <nav className="cms-pages__list">
            {ADMIN_PAGES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPage(p.id)}
                className={`cms-page-btn${pageId === p.id ? " cms-page-btn--active" : ""}`}
              >
                <span className="cms-page-btn__name">{p.label}</span>
                <span className="cms-page-btn__path">{p.previewPath}</span>
              </button>
            ))}
          </nav>
        </aside>

        <aside className="cms-sections">
          {page && (
            <>
              <p className="cms-sections__desc">{page.description}</p>
              <nav className="cms-sections__list">
                {page.sections.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSectionId(s.id)}
                    className={`cms-section-btn${sectionId === s.id ? " cms-section-btn--active" : ""}`}
                  >
                    <span>{s.label}</span>
                    <span className="cms-section-btn__hint">{s.hint}</span>
                  </button>
                ))}
              </nav>
              {page.previewPath && (
                <Link href={page.previewPath} target="_blank" className="cms-preview-link">
                  Ver página no site ↗
                </Link>
              )}
            </>
          )}
        </aside>

        <div className="cms-editor">
          {section && (
            <>
              <div className="cms-editor__head">
                <h2 className="cms-editor__title">{section.label}</h2>
                <p className="cms-editor__hint">{section.hint}</p>
              </div>
              <SectionEditor sectionId={sectionId} content={content} patch={patch} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
