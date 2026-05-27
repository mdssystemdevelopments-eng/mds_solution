import { apiFetch } from "@/lib/api-fetch";
import type { PostDetails, PostPayload, PostRow } from "@/modules/admin/posts/types";
import { getApiError, parseJson } from "@/modules/shared/http/parse-json";

export async function listPosts(): Promise<PostRow[]> {
  const res = await apiFetch("/api/admin/posts");
  const json = await parseJson<{ items?: PostRow[]; error?: string }>(res);
  if (!res.ok) throw new Error(getApiError(json, "Falha ao carregar"));
  return json.items || [];
}

export async function getPostById(id: string): Promise<PostDetails> {
  const res = await apiFetch(`/api/admin/posts/${id}`);
  const json = await parseJson<{ item?: PostDetails; error?: string }>(res);
  if (!res.ok || !json.item) throw new Error(getApiError(json, "Falha ao abrir"));
  return json.item;
}

export async function createPost(payload: PostPayload) {
  const res = await apiFetch("/api/admin/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await parseJson<{ error?: string }>(res);
  if (!res.ok) throw new Error(getApiError(json, "Falha ao criar"));
}

export async function updatePost(id: string, payload: PostPayload) {
  const res = await apiFetch(`/api/admin/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await parseJson<{ error?: string }>(res);
  if (!res.ok) throw new Error(getApiError(json, "Falha ao salvar"));
}

export async function deletePost(id: string) {
  const res = await apiFetch(`/api/admin/posts/${id}`, { method: "DELETE" });
  const json = await parseJson<{ error?: string }>(res);
  if (!res.ok) throw new Error(getApiError(json, "Falha ao excluir"));
}
