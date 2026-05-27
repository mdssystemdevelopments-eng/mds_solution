"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { PostPayload, PostRow } from "@/modules/admin/posts/types";
import {
  createPost,
  deletePost,
  getPostById,
  listPosts,
  updatePost,
} from "@/modules/admin/posts/services/posts-api";
import { AdminListToolbar } from "@/modules/admin/ui/admin-list-toolbar";
import { slugify } from "@/modules/shared/utils/slugify";

export function PostsAdmin() {
  const [items, setItems] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[240px] focus:outline-none p-4",
      },
    },
  });

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((p) => p.title.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s));
  }, [items, q]);

  async function load() {
    setLoading(true);
    try {
      setItems(await listPosts());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao carregar");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setStatus("draft");
    editor?.commands.setContent("");
  }

  function startCreate() {
    resetForm();
    setOpen(true);
  }

  async function startEdit(id: string) {
    try {
      const p = await getPostById(id);
      setEditingId(id);
      setTitle(p.title);
      setSlug(p.slug);
      setExcerpt(p.excerpt ?? "");
      setStatus(p.status);
      editor?.commands.setContent(p.content_html || "");
      setOpen(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao abrir");
    }
  }

  async function save() {
    if (!title.trim()) return toast.error("Título é obrigatório");
    const s = slug.trim() || slugify(title, { maxLength: 200 });
    if (!s) return toast.error("Slug inválido");
    const content_html = editor?.getHTML() ?? "";

    try {
      const body: PostPayload = {
        title: title.trim(),
        slug: s,
        excerpt: excerpt.trim() || null,
        status,
        content_html,
      };

      if (editingId) {
        await updatePost(editingId, body);
        toast.success("Post atualizado");
      } else {
        await createPost(body);
        toast.success("Post criado");
      }

      setOpen(false);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao salvar");
    }
  }

  async function remove(p: PostRow) {
    const ok = window.confirm(`Excluir "${p.title}"? Esta ação não pode ser desfeita.`);
    if (!ok) return;
    try {
      await deletePost(p.id);
      toast.success("Excluído");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao excluir");
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-ink p-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Posts</h1>
        <p className="mt-1 text-sm text-zinc-400">Editor rich text (Tiptap) + status rascunho/publicado.</p>
      </div>

      <div className="mt-4">
        <AdminListToolbar
          query={q}
          onQueryChange={setQ}
          queryPlaceholder="Buscar por título ou slug…"
          onReload={load}
          onCreate={startCreate}
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-900/40 text-zinc-300">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Título</th>
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-zinc-400">
                  Carregando…
                </td>
              </tr>
            ) : filtered.length ? (
              filtered.map((p) => (
                <tr key={p.id} className="bg-ink">
                  <td className="px-4 py-3 text-white">{p.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-300">{p.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs ${
                        p.status === "published"
                          ? "bg-emerald-950/50 text-emerald-200"
                          : "bg-zinc-900/50 text-zinc-300"
                      }`}
                    >
                      {p.status === "published" ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(p.id)}
                        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-900/40"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(p)}
                        className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-200 hover:bg-red-950/30"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-zinc-400">
                  Nenhum item.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-zinc-800 bg-ink-muted p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-neon-blue">
                  {editingId ? "Editar" : "Novo"}
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">Post</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-900/40"
              >
                Fechar
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              <label className="text-sm text-zinc-200">
                Título
                <input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editingId) setSlug(slugify(e.target.value, { maxLength: 200 }));
                  }}
                  className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-ink px-4 py-3 text-white outline-none focus:border-neon-blue"
                />
              </label>
              <label className="text-sm text-zinc-200">
                Slug
                <input
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value, { maxLength: 200 }))}
                  className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-ink px-4 py-3 font-mono text-sm text-white outline-none focus:border-neon-blue"
                />
              </label>
              <label className="text-sm text-zinc-200">
                Resumo
                <input
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-ink px-4 py-3 text-white outline-none focus:border-neon-blue"
                />
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm text-zinc-200">
                  Status
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                    className="ml-3 rounded-xl border border-zinc-700 bg-ink px-3 py-2 text-sm text-white outline-none focus:border-neon-blue"
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                  </select>
                </label>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-ink">
                <div className="flex flex-wrap gap-2 border-b border-zinc-800 p-2">
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-900/40"
                  >
                    Negrito
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-900/40"
                  >
                    Itálico
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-900/40"
                  >
                    Lista
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-900/40"
                  >
                    H2
                  </button>
                </div>
                <EditorContent editor={editor} />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900/40"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={save}
                className="rounded-xl bg-neon-blue px-4 py-2 text-sm font-bold text-ink hover:brightness-110"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

