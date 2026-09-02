"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-fetch";
import { FileField, GalleryField, ImageField } from "@/components/admin/cms/image-field";
import { Field, Input, Textarea } from "@/components/admin/cms/form-fields";
import { BusinessPublicView } from "@/components/business/business-public-view";
import { BusinessLookPicker } from "@/components/admin/business/business-look-picker";
import { createBlock } from "@/lib/business/blocks";
import { applyLook } from "@/lib/business/palettes";
import { clientBusinessUrl } from "@/lib/site-url";
import {
  BLOCK_GROUPS,
  BLOCK_LABELS,
  STATUS_LABELS,
  VISIBILITY_LABELS,
  type BlockType,
  type BusinessBlock,
  type BusinessCompany,
  type BusinessProject,
} from "@/lib/business/types";

type InspectorTab = "bloco" | "projeto" | "design" | "seo" | "pedidos";

const KEY_LABELS: Record<string, string> = {
  title: "Titulo",
  text: "Texto",
  value: "Valor",
  label: "Rotulo",
  q: "Pergunta",
  a: "Resposta",
  name: "Nome",
  role: "Cargo",
  price: "Preco",
  buttonLabel: "Botao",
  buttonHref: "Link do botao",
  href: "Link",
};

export function BusinessEditor({ id }: { id: string }) {
  const router = useRouter();
  const [project, setProject] = useState<BusinessProject | null>(null);
  const [companies, setCompanies] = useState<BusinessCompany[]>([]);
  const [selected, setSelected] = useState("");
  const [tab, setTab] = useState<InspectorTab>("bloco");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [status, setStatus] = useState("Carregando");
  const [password, setPassword] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const projectRef = useRef<BusinessProject | null>(null);
  const genRef = useRef(0);

  const load = useCallback(async () => {
    const [pRes, cRes] = await Promise.all([
      apiFetch(`/api/admin/business/projects/${id}`),
      apiFetch("/api/admin/business/companies"),
    ]);
    const pJson = await pRes.json();
    const cJson = await cRes.json();
    if (!pRes.ok) {
      toast.error(pJson.error || "Projeto nao encontrado.");
      router.push("/admin/business/projetos");
      return;
    }
    setProject(pJson.project);
    projectRef.current = pJson.project;
    setCompanies(cJson.companies ?? []);
    setSelected(pJson.project.blocks[0]?.id ?? "");
    setStatus("Salvo");
  }, [id, router]);

  useEffect(() => {
    void load();
  }, [load]);

  const persist = useCallback(async (next: BusinessProject, extra: Record<string, unknown> = {}, gen = genRef.current) => {
    setStatus("Salvando...");
    const res = await apiFetch(`/api/admin/business/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...next, ...extra }),
    });
    const json = await res.json();
    if (!res.ok) {
      setStatus("Erro ao salvar");
      toast.error(json.error || "Erro ao salvar");
      return false;
    }
    if (gen !== genRef.current) return true;
    setProject(json.project);
    projectRef.current = json.project;
    setStatus("Salvo");
    return true;
  }, [id]);

  function patch(updater: (prev: BusinessProject) => BusinessProject) {
    setProject((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      projectRef.current = next;
      genRef.current += 1;
      const gen = genRef.current;
      setStatus("Alteracoes nao salvas");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void persist(next, {}, gen);
      }, 900);
      return next;
    });
  }

  const selectedBlock = project?.blocks.find((b) => b.id === selected) ?? null;
  const company = useMemo(
    () => companies.find((item) => item.id === project?.companyId) ?? null,
    [companies, project?.companyId],
  );

  async function publish(action: "publish" | "unpublish") {
    if (!window.confirm(action === "publish" ? "Publicar este projeto?" : "Voltar este projeto para rascunho?")) return;
    const res = await apiFetch(`/api/admin/business/projects/${id}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const json = await res.json();
    if (!res.ok) return toast.error(json.error || "Falha");
    setProject(json.project);
    toast.success(action === "publish" ? "Publicado." : "Voltou para rascunho.");
  }

  async function duplicate() {
    const res = await apiFetch(`/api/admin/business/projects/${id}/duplicate`, { method: "POST" });
    const json = await res.json();
    if (!res.ok) return toast.error(json.error || "Falha ao duplicar");
    toast.success("Copia criada.");
    router.push(`/admin/business/projetos/${json.project.id}`);
  }

  async function remove() {
    if (!window.confirm("Excluir este projeto de forma permanente?")) return;
    const res = await apiFetch(`/api/admin/business/projects/${id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Nao foi possivel excluir.");
    router.push("/admin/business/projetos");
  }

  async function savePassword(clear = false) {
    if (!project) return;
    if (!clear && !password.trim()) return toast.error("Informe a nova senha.");
    const ok = await persist(project, { password: clear ? "" : password });
    if (!ok) return;
    setPassword("");
    toast.success(clear ? "Senha removida." : "Senha atualizada.");
  }

  function copyLink() {
    if (!project) return;
    const url = clientBusinessUrl(project.slug);
    void navigator.clipboard.writeText(url);
    toast.success(project.visibility === "private" ? "Link copiado. O visitante precisara da senha." : "Link copiado.");
  }

  if (!project) return <p className="biz-muted">Carregando editor...</p>;

  return (
    <div className="biz-editor">
      <header className="biz-toolbar">
        <Link href="/admin/business/projetos" className="cms-btn cms-btn--ghost">
          Projetos
        </Link>
        <div className="biz-toolbar__name">
          <strong>{project.title}</strong>
          <span className="biz-save">{status}</span>
        </div>
        <div className="biz-viewports">
          {(["desktop", "tablet", "mobile"] as const).map((v) => (
            <button key={v} type="button" className={viewport === v ? "is-on" : ""} onClick={() => setViewport(v)}>
              {v === "desktop" ? "Desktop" : v === "tablet" ? "Tablet" : "Mobile"}
            </button>
          ))}
        </div>
        <a
          className="cms-btn cms-btn--ghost"
          href={project.status === "published" ? clientBusinessUrl(project.slug) : `/business/${project.slug}`}
          target="_blank"
          rel="noreferrer"
        >
          Visualizar
        </a>
        <button type="button" className="cms-btn cms-btn--ghost" onClick={copyLink}>
          Copiar link
        </button>
        {project.status === "published" ? (
          <button type="button" className="cms-btn cms-btn--ghost" onClick={() => void publish("unpublish")}>
            Despublicar
          </button>
        ) : (
          <button type="button" className="cms-btn cms-btn--primary" onClick={() => void publish("publish")}>
            Publicar
          </button>
        )}
      </header>
      <BusinessLookPicker
        compact
        theme={project.design.theme}
        palette={project.design.palette}
        coverColor={project.design.coverColor || project.design.background}
        onChange={(next) => patch((p) => ({ ...p, design: applyLook(p.design, next) }))}
        onCoverColor={(v) => patch((p) => ({ ...p, design: { ...p.design, coverColor: v } }))}
      />
      <div className="biz-editor__grid">
        <aside className="biz-pane">
          <h3 className="biz-h2">Pagina</h3>
          <ol className="biz-layers">
            {project.blocks.map((block, index) => (
              <li key={block.id} className={selected === block.id ? "is-on" : ""}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(block.id);
                    setTab("bloco");
                  }}
                >
                  {BLOCK_LABELS[block.type as BlockType] || block.type}
                  {block.hidden ? " (oculto)" : ""}
                </button>
                <span>
                  <button type="button" disabled={index === 0} onClick={() => patch((p) => move(p, index, -1))}>
                    Sobe
                  </button>
                  <button type="button" disabled={index === project.blocks.length - 1} onClick={() => patch((p) => move(p, index, 1))}>
                    Desce
                  </button>
                </span>
              </li>
            ))}
          </ol>
          {BLOCK_GROUPS.map((group) => (
            <div key={group.id} className="biz-add-group">
              <p>{group.label}</p>
              <div className="biz-block-add">
                {group.types.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      const block = createBlock(type);
                      patch((p) => ({ ...p, blocks: [...p.blocks, block] }));
                      setSelected(block.id);
                      setTab("bloco");
                    }}
                  >
                    {BLOCK_LABELS[type]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <div className={`biz-canvas biz-canvas--${viewport}`}>
          <div className="biz-canvas__frame">
            <BusinessPublicView project={project} company={company} preview />
          </div>
        </div>

        <aside className="biz-pane">
          <div className="biz-tabs">
            {([
              ["bloco", "Bloco"],
              ["projeto", "Projeto"],
              ["design", "Design"],
              ["seo", "SEO"],
              ["pedidos", "Pedidos"],
            ] as const).map(([key, label]) => (
              <button key={key} type="button" className={tab === key ? "is-on" : ""} onClick={() => setTab(key)}>
                {label}
              </button>
            ))}
          </div>

          {tab === "bloco" ? (
            selectedBlock ? (
              <BlockFields
                block={selectedBlock}
                onChange={(next) => patch((p) => ({ ...p, blocks: p.blocks.map((b) => (b.id === next.id ? next : b)) }))}
                onDuplicate={() => {
                  const copy = { ...selectedBlock, id: createBlock(selectedBlock.type).id, content: { ...selectedBlock.content } };
                  patch((p) => {
                    const i = p.blocks.findIndex((b) => b.id === selectedBlock.id);
                    const blocks = [...p.blocks];
                    blocks.splice(i + 1, 0, copy);
                    return { ...p, blocks };
                  });
                  setSelected(copy.id);
                }}
                onRemove={() => {
                  patch((p) => ({ ...p, blocks: p.blocks.filter((b) => b.id !== selectedBlock.id) }));
                  setSelected("");
                }}
              />
            ) : (
              <p className="biz-muted">Selecione um bloco na lista da esquerda.</p>
            )
          ) : null}

          {tab === "projeto" ? (
            <ProjectForm
              project={project}
              companies={companies}
              password={password}
              setPassword={setPassword}
              patch={patch}
              onSavePassword={() => void savePassword(false)}
              onClearPassword={() => void savePassword(true)}
              onDuplicate={() => void duplicate()}
              onRemove={() => void remove()}
            />
          ) : null}

          {tab === "design" ? <DesignForm project={project} patch={patch} /> : null}
          {tab === "seo" ? <SeoForm project={project} patch={patch} /> : null}
          {tab === "pedidos" ? <LeadsPanel id={id} /> : null}
        </aside>
      </div>
    </div>
  );
}

function move(project: BusinessProject, index: number, dir: number): BusinessProject {
  const next = [...project.blocks];
  const target = index + dir;
  if (target < 0 || target >= next.length) return project;
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return { ...project, blocks: next };
}

function ProjectForm({
  project,
  companies,
  password,
  setPassword,
  patch,
  onSavePassword,
  onClearPassword,
  onDuplicate,
  onRemove,
}: {
  project: BusinessProject;
  companies: BusinessCompany[];
  password: string;
  setPassword: (v: string) => void;
  patch: (fn: (p: BusinessProject) => BusinessProject) => void;
  onSavePassword: () => void;
  onClearPassword: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="biz-form">
      <Field label="Titulo">
        <Input value={project.title} onChange={(v) => patch((p) => ({ ...p, title: v }))} />
      </Field>
      <Field label="Slug" hint={`O cliente abre: ${clientBusinessUrl(project.slug)}`}>
        <Input value={project.slug} onChange={(v) => patch((p) => ({ ...p, slug: v }))} />
      </Field>
      <Field label="Descricao">
        <Textarea value={project.description} onChange={(v) => patch((p) => ({ ...p, description: v }))} rows={3} />
      </Field>
      <Field label="Empresa">
        <select className="cms-input" value={project.companyId} onChange={(e) => patch((p) => ({ ...p, companyId: e.target.value }))}>
          <option value="">Sem empresa</option>
          {companies.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </Field>
      <ImageField label="Capa" value={project.cover} onChange={(v) => patch((p) => ({ ...p, cover: v }))} />
      <p className="biz-muted">
        Status: {STATUS_LABELS[project.status]}
        {project.publishedAt ? ` · publicado em ${new Date(project.publishedAt).toLocaleDateString("pt-BR")}` : ""}
      </p>
      <Field label="Visibilidade">
        <select
          className="cms-input"
          value={project.visibility}
          onChange={(e) => patch((p) => ({ ...p, visibility: e.target.value as BusinessProject["visibility"] }))}
        >
          {Object.entries(VISIBILITY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Senha de acesso" hint={project.passwordHash === "set" ? "Ja existe senha neste projeto." : "Opcional. Use com visibilidade privada."}>
        <Input type="password" value={password} onChange={setPassword} />
      </Field>
      <div className="biz-actions">
        <button type="button" className="cms-btn cms-btn--ghost" onClick={onSavePassword}>
          Salvar senha
        </button>
        {project.passwordHash === "set" ? (
          <button type="button" className="cms-btn cms-btn--ghost" onClick={onClearPassword}>
            Remover senha
          </button>
        ) : null}
      </div>
      <div className="biz-actions">
        <button type="button" className="cms-btn cms-btn--ghost" onClick={onDuplicate}>
          Duplicar projeto
        </button>
        <button
          type="button"
          className="cms-btn cms-btn--ghost"
          onClick={() => patch((p) => ({ ...p, status: p.status === "archived" ? "draft" : "archived" }))}
        >
          {project.status === "archived" ? "Desarquivar" : "Arquivar"}
        </button>
        <button type="button" className="cms-btn cms-btn--ghost" onClick={onRemove}>
          Excluir projeto
        </button>
      </div>
    </div>
  );
}

function DesignForm({
  project,
  patch,
}: {
  project: BusinessProject;
  patch: (fn: (p: BusinessProject) => BusinessProject) => void;
}) {
  const d = project.design;
  return (
    <div className="biz-form">
      <BusinessLookPicker
        theme={d.theme}
        palette={d.palette}
        coverColor={d.coverColor || d.background}
        onChange={(next) => patch((p) => ({ ...p, design: applyLook(p.design, next) }))}
        onCoverColor={(v) => patch((p) => ({ ...p, design: { ...p.design, coverColor: v } }))}
      />
      <ColorField
        label="Cor da capa"
        hint="So o hero e a capa. O resto da pagina nao muda."
        value={d.coverColor || d.background}
        onChange={(v) => patch((p) => ({ ...p, design: { ...p.design, coverColor: v } }))}
      />
      <ImageField label="Logo" value={d.logo} onChange={(v) => patch((p) => ({ ...p, design: { ...p.design, logo: v } }))} />
      <Field label="WhatsApp deste projeto" hint="Se vazio, usa o da empresa ou o da MDS. So numeros.">
        <Input value={d.whatsapp || ""} onChange={(v) => patch((p) => ({ ...p, design: { ...p.design, whatsapp: v } }))} />
      </Field>
      <ColorField label="Cor primaria" value={d.primary} onChange={(v) => patch((p) => ({ ...p, design: { ...p.design, primary: v } }))} />
      <ColorField label="Cor de fundo da pagina" value={d.background} onChange={(v) => patch((p) => ({ ...p, design: { ...p.design, background: v } }))} />
      <ColorField label="Cor do texto" value={d.text} onChange={(v) => patch((p) => ({ ...p, design: { ...p.design, text: v } }))} />
      <label className="biz-check">
        <input
          type="checkbox"
          checked={d.showHeader}
          onChange={(e) => patch((p) => ({ ...p, design: { ...p.design, showHeader: e.target.checked } }))}
        />
        Mostrar cabecalho
      </label>
      <label className="biz-check">
        <input
          type="checkbox"
          checked={d.showFooter}
          onChange={(e) => patch((p) => ({ ...p, design: { ...p.design, showFooter: e.target.checked } }))}
        />
        Mostrar rodape
      </label>
    </div>
  );
}

function toColorInput(value: string): string {
  const v = (value || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(v)) return v;
  if (/^#[0-9a-f]{3}$/i.test(v)) return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  return "#111111";
}

function ColorField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="biz-color">
        <input type="color" value={toColorInput(value)} onChange={(e) => onChange(e.target.value)} />
        <Input value={value} onChange={onChange} />
      </div>
    </Field>
  );
}

function SeoForm({ project, patch }: { project: BusinessProject; patch: (fn: (p: BusinessProject) => BusinessProject) => void }) {
  return (
    <div className="biz-form">
      <Field label="Title">
        <Input value={project.seo.title} onChange={(v) => patch((p) => ({ ...p, seo: { ...p.seo, title: v } }))} />
      </Field>
      <Field label="Description">
        <Textarea value={project.seo.description} onChange={(v) => patch((p) => ({ ...p, seo: { ...p.seo, description: v } }))} rows={3} />
      </Field>
      <ImageField label="Imagem de compartilhamento" value={project.seo.ogImage} onChange={(v) => patch((p) => ({ ...p, seo: { ...p.seo, ogImage: v } }))} />
      <Field label="Robots">
        <select
          className="cms-input"
          value={project.seo.robots}
          onChange={(e) => patch((p) => ({ ...p, seo: { ...p.seo, robots: e.target.value as "index" | "noindex" } }))}
        >
          <option value="noindex">noindex</option>
          <option value="index">index</option>
        </select>
      </Field>
    </div>
  );
}

function LeadsPanel({ id }: { id: string }) {
  const [items, setItems] = useState<{ createdAt: string; meta: Record<string, string> }[]>([]);

  useEffect(() => {
    apiFetch(`/api/admin/business/projects/${id}/analytics`)
      .then((r) => r.json())
      .then((json) => {
        const recent = Array.isArray(json.recent) ? json.recent : [];
        setItems(recent.filter((item: { kind?: string }) => item.kind === "lead"));
      })
      .catch(() => setItems([]));
  }, [id]);

  if (!items.length) {
    return <p className="biz-muted">Nenhum pedido neste projeto ainda. Quando o cliente clicar em Quero conversar, o recado aparece aqui.</p>;
  }

  return (
    <ul className="biz-list">
      {items.map((item, i) => (
        <li key={`${item.createdAt}-${i}`} className="biz-row">
          <div className="biz-row__body">
            <strong>{item.meta.name || "Sem nome"}</strong>
            <p>
              {item.meta.phone || ""} · {new Date(item.createdAt).toLocaleString("pt-BR")}
            </p>
            {item.meta.message ? <p>{item.meta.message}</p> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

function BlockFields({
  block,
  onChange,
  onDuplicate,
  onRemove,
}: {
  block: BusinessBlock;
  onChange: (b: BusinessBlock) => void;
  onDuplicate: () => void;
  onRemove: () => void;
}) {
  const c = block.content;
  function set(key: string, value: unknown) {
    onChange({ ...block, content: { ...c, [key]: value } });
  }

  return (
    <div className="biz-form">
      <h3 className="biz-h2">{BLOCK_LABELS[block.type]}</h3>
      <label className="biz-check">
        <input type="checkbox" checked={!block.hidden} onChange={(e) => onChange({ ...block, hidden: !e.target.checked })} />
        Visivel
      </label>

      {["hero", "text", "video", "pdf", "cta", "timeline", "pricing", "form"].includes(block.type) ? (
        <Field label="Titulo">
          <Input value={String(c.title ?? "")} onChange={(v) => set("title", v)} />
        </Field>
      ) : null}

      {block.type === "hero" || block.type === "cta" || block.type === "video" || block.type === "form" ? (
        <Field label="Texto">
          <Textarea value={String(c.text ?? "")} onChange={(v) => set("text", v)} rows={3} />
        </Field>
      ) : null}

      {block.type === "hero" ? (
        <>
          <Field label="Subtitulo">
            <Input value={String(c.subtitle ?? "")} onChange={(v) => set("subtitle", v)} />
          </Field>
          <ImageField label="Imagem" value={String(c.image ?? "")} onChange={(v) => set("image", v)} />
          <Field label="Botao">
            <Input value={String(c.buttonLabel ?? "")} onChange={(v) => set("buttonLabel", v)} />
          </Field>
          <Field label="Link do botao" hint="Vazio abre o pedido nesta pagina. Nao use /contato.">
            <Input value={String(c.buttonHref ?? "")} onChange={(v) => set("buttonHref", v)} />
          </Field>
          <Field label="Altura">
            <select className="cms-input" value={String(c.height ?? "md")} onChange={(e) => set("height", e.target.value)}>
              <option value="sm">Baixa</option>
              <option value="md">Media</option>
              <option value="lg">Alta</option>
            </select>
          </Field>
          <Field label="Alinhamento">
            <select className="cms-input" value={String(c.align ?? "left")} onChange={(e) => set("align", e.target.value)}>
              <option value="left">Esquerda</option>
              <option value="center">Centro</option>
            </select>
          </Field>
          <label className="biz-check">
            <input type="checkbox" checked={Boolean(c.overlay)} onChange={(e) => set("overlay", e.target.checked)} />
            Escurecer imagem
          </label>
        </>
      ) : null}

      {block.type === "html" ? (
        <>
          <FileField
            label="Arquivo HTML do site"
            hint="Envie o .html completo, ate 4 MB. Sites feitos em React so abrem assim. Colar o codigo no campo de baixo nao funciona quando o arquivo e grande."
            value={String(c.src ?? "")}
            onChange={(v) => set("src", v)}
            accept=".html,text/html"
          />
          <Field
            label="Trecho HTML"
            hint="So para HTML curto. Se colar um site inteiro, use o envio de arquivo acima."
          >
            <Textarea value={String(c.html ?? "")} onChange={(v) => set("html", v)} rows={8} />
          </Field>
        </>
      ) : null}

      {block.type === "text" ? (
        <Field label="Conteudo">
          <Textarea value={String(c.html ?? "")} onChange={(v) => set("html", v)} rows={8} />
        </Field>
      ) : null}

      {block.type === "image" ? (
        <>
          <ImageField label="Imagem" value={String(c.src ?? "")} onChange={(v) => set("src", v)} />
          <Field label="Alt">
            <Input value={String(c.alt ?? "")} onChange={(v) => set("alt", v)} />
          </Field>
          <Field label="Legenda">
            <Input value={String(c.caption ?? "")} onChange={(v) => set("caption", v)} />
          </Field>
        </>
      ) : null}

      {block.type === "gallery" ? (
        <>
          <GalleryField label="Imagens" values={Array.isArray(c.images) ? c.images.map(String) : []} onChange={(urls) => set("images", urls)} />
          <Field label="Colunas">
            <select className="cms-input" value={String(c.columns ?? 3)} onChange={(e) => set("columns", Number(e.target.value))}>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </Field>
        </>
      ) : null}

      {block.type === "video" ? (
        <Field label="URL YouTube ou Vimeo">
          <Input value={String(c.url ?? "")} onChange={(v) => set("url", v)} />
        </Field>
      ) : null}

      {block.type === "pdf" ? (
        <FileField label="Arquivo PDF" value={String(c.src ?? "")} onChange={(v) => set("src", v)} />
      ) : null}

      {block.type === "cta" || block.type === "button" || block.type === "contact" ? (
        <>
          <Field label="Rotulo do botao">
            <Input
              value={String(c.buttonLabel ?? c.label ?? "")}
              onChange={(v) => set(block.type === "button" ? "label" : "buttonLabel", v)}
            />
          </Field>
          <Field label="Link" hint="Vazio abre o pedido nesta pagina. Nao use /contato.">
            <Input
              value={String(c.buttonHref ?? c.href ?? "")}
              onChange={(v) => set(block.type === "button" ? "href" : "buttonHref", v)}
            />
          </Field>
        </>
      ) : null}

      {block.type === "contact" ? (
        <>
          <Field label="Telefone">
            <Input value={String(c.phone ?? "")} onChange={(v) => set("phone", v)} />
          </Field>
          <Field label="WhatsApp">
            <Input value={String(c.whatsapp ?? "")} onChange={(v) => set("whatsapp", v)} />
          </Field>
          <Field label="E-mail">
            <Input value={String(c.email ?? "")} onChange={(v) => set("email", v)} />
          </Field>
          <Field label="Endereco">
            <Input value={String(c.address ?? "")} onChange={(v) => set("address", v)} />
          </Field>
        </>
      ) : null}

      {block.type === "cards" ? (
        <ListEditor
          items={Array.isArray(c.items) ? (c.items as Record<string, string>[]) : []}
          keys={["title", "text", "href"]}
          imageKey="image"
          onChange={(items) => set("items", items)}
        />
      ) : null}

      {["stats", "testimonials", "timeline", "faq"].includes(block.type) ? (
        <ListEditor
          items={Array.isArray(c.items) ? (c.items as Record<string, string>[]) : []}
          keys={block.type === "stats" ? ["value", "label"] : block.type === "faq" ? ["q", "a"] : block.type === "testimonials" ? ["name", "role", "text"] : ["title", "text"]}
          onChange={(items) => set("items", items)}
        />
      ) : null}

      {block.type === "pricing" ? (
        <ListEditor
          items={Array.isArray(c.plans) ? (c.plans as Record<string, string>[]) : []}
          keys={["name", "price", "text", "buttonLabel", "buttonHref"]}
          linesKey="items"
          onChange={(items) => set("plans", items)}
        />
      ) : null}

      {block.type === "table" ? (
        <TableEditor
          headers={Array.isArray(c.headers) ? c.headers.map(String) : []}
          rows={Array.isArray(c.rows) ? (c.rows as unknown[][]).map((row) => (Array.isArray(row) ? row.map(String) : [])) : []}
          onChange={(headers, rows) => onChange({ ...block, content: { ...c, headers, rows } })}
        />
      ) : null}

      <div className="biz-actions">
        <button type="button" className="cms-btn cms-btn--ghost" onClick={onDuplicate}>
          Duplicar bloco
        </button>
        <button type="button" className="cms-btn cms-btn--ghost" onClick={onRemove}>
          Remover bloco
        </button>
      </div>
    </div>
  );
}

function ListEditor({
  items,
  keys,
  imageKey,
  linesKey,
  onChange,
}: {
  items: Record<string, string | string[]>[];
  keys: string[];
  imageKey?: string;
  linesKey?: string;
  onChange: (items: Record<string, string | string[]>[]) => void;
}) {
  return (
    <div className="biz-list-edit">
      {items.map((item, i) => (
        <div key={i} className="cms-card">
          {keys.map((key) => (
            <Field key={key} label={KEY_LABELS[key] || key}>
              <Input
                value={String(item[key] ?? "")}
                onChange={(v) => {
                  const next = items.map((row, idx) => (idx === i ? { ...row, [key]: v } : row));
                  onChange(next);
                }}
              />
            </Field>
          ))}
          {imageKey ? (
            <ImageField
              label="Imagem"
              value={String(item[imageKey] ?? "")}
              onChange={(v) => onChange(items.map((row, idx) => (idx === i ? { ...row, [imageKey]: v } : row)))}
            />
          ) : null}
          {linesKey ? (
            <Field label="Itens (um por linha)">
              <Textarea
                rows={3}
                value={(Array.isArray(item[linesKey]) ? item[linesKey] : []).join("\n")}
                onChange={(v) =>
                  onChange(items.map((row, idx) => (idx === i ? { ...row, [linesKey]: v.split("\n").map((line) => line.trim()).filter(Boolean) } : row)))
                }
              />
            </Field>
          ) : null}
          <button type="button" className="cms-card__remove" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
            Remover
          </button>
        </div>
      ))}
      <button
        type="button"
        className="cms-add-btn"
        onClick={() =>
          onChange([
            ...items,
            {
              ...Object.fromEntries(keys.map((k) => [k, ""])),
              ...(imageKey ? { [imageKey]: "" } : {}),
              ...(linesKey ? { [linesKey]: [] } : {}),
            },
          ])
        }
      >
        Adicionar item
      </button>
    </div>
  );
}

function TableEditor({
  headers,
  rows,
  onChange,
}: {
  headers: string[];
  rows: string[][];
  onChange: (headers: string[], rows: string[][]) => void;
}) {
  const cols = headers.length || 2;

  function setHeader(index: number, value: string) {
    const next = headers.map((item, i) => (i === index ? value : item));
    onChange(next, rows);
  }

  function setCell(row: number, col: number, value: string) {
    const next = rows.map((item, i) => (i === row ? item.map((cell, j) => (j === col ? value : cell)) : item));
    onChange(headers, next);
  }

  return (
    <div className="biz-table-edit">
      <p className="biz-muted">Colunas</p>
      {headers.map((header, i) => (
        <Field key={i} label={`Coluna ${i + 1}`}>
          <Input value={header} onChange={(v) => setHeader(i, v)} />
        </Field>
      ))}
      <div className="biz-actions">
        <button type="button" className="cms-btn cms-btn--ghost" onClick={() => onChange([...headers, `Coluna ${cols + 1}`], rows.map((row) => [...row, ""]))}>
          Coluna
        </button>
        {headers.length > 1 ? (
          <button type="button" className="cms-btn cms-btn--ghost" onClick={() => onChange(headers.slice(0, -1), rows.map((row) => row.slice(0, -1)))}>
            Remover coluna
          </button>
        ) : null}
      </div>
      <p className="biz-muted">Linhas</p>
      {rows.map((row, i) => (
        <div key={i} className="cms-card">
          {row.map((cell, j) => (
            <Field key={j} label={headers[j] || `Coluna ${j + 1}`}>
              <Input value={cell} onChange={(v) => setCell(i, j, v)} />
            </Field>
          ))}
          <button type="button" className="cms-card__remove" onClick={() => onChange(headers, rows.filter((_, idx) => idx !== i))}>
            Remover linha
          </button>
        </div>
      ))}
      <button type="button" className="cms-add-btn" onClick={() => onChange(headers, [...rows, headers.map(() => "")])}>
        Adicionar linha
      </button>
    </div>
  );
}
