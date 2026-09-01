"use client";

import { useState } from "react";
import { ADMIN_PAGES, getAdminPage, type AdminSectionId } from "@/lib/admin-pages";
import { useAdminContent } from "@/hooks/use-admin-content";
import { SectionEditor } from "@/components/admin/cms/section-editor";

export function VisualCms() {
  const { content, loading, saving, dirty, error, load, patch, save } = useAdminContent();
  const [pageId, setPageId] = useState("home");
  const [sectionId, setSectionId] = useState<AdminSectionId>("hero");

  const page = getAdminPage(pageId) ?? ADMIN_PAGES[0];
  const section = page.sections.find((s) => s.id === sectionId) ?? page.sections[0];

  function selectPage(id: string) {
    setPageId(id);
    const next = getAdminPage(id);
    if (next?.sections[0]) setSectionId(next.sections[0].id);
  }

  return (
    <div className="cms-root">
      <header className="cms-topbar">
        <div>
          <h1 className="cms-topbar__title">Editor do site</h1>
          <p className="cms-topbar__sub">
            Escolha a página, edite o texto e clique em Salvar. {loading ? "Atualizando do servidor…" : ""}
          </p>
        </div>
        <div className="cms-topbar__actions">
          {dirty && <span className="cms-dirty">Não salvo</span>}
          <button type="button" onClick={() => void load()} disabled={saving} className="cms-btn cms-btn--ghost">
            Recarregar
          </button>
          <button type="button" onClick={() => void save()} disabled={saving} className="cms-btn cms-btn--primary">
            {saving ? "Salvando…" : "Salvar alterações"}
          </button>
        </div>
      </header>

      {error ? <p className="cms-alert">{error}</p> : null}

      <div className="cms-toolbar">
        <label className="cms-toolbar__field">
          Página
          <select
            className="cms-input"
            value={page.id}
            onChange={(e) => selectPage(e.target.value)}
          >
            {ADMIN_PAGES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="cms-toolbar__field">
          Seção
          <select
            className="cms-input"
            value={section.id}
            onChange={(e) => setSectionId(e.target.value as AdminSectionId)}
          >
            {page.sections.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="cms-editor cms-editor--open">
        <div className="cms-editor__head">
          <h2 className="cms-editor__title">{section.label}</h2>
          <p className="cms-editor__hint">{section.hint}</p>
        </div>
        <SectionEditor sectionId={section.id} content={content} patch={patch} />
      </div>
    </div>
  );
}
