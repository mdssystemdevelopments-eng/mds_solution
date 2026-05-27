import { apiFetch } from "@/lib/api-fetch";
import type { ProductPayload, ProductRow } from "@/modules/admin/products/types";
import { getApiError, parseJson } from "@/modules/shared/http/parse-json";

export async function listProducts(): Promise<ProductRow[]> {
  const res = await apiFetch("/api/admin/products");
  const json = await parseJson<{ items?: ProductRow[]; error?: string }>(res);
  if (!res.ok) throw new Error(getApiError(json, "Falha ao carregar"));
  return json.items || [];
}

export async function createProduct(payload: ProductPayload) {
  const res = await apiFetch("/api/admin/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await parseJson<{ error?: string }>(res);
  if (!res.ok) throw new Error(getApiError(json, "Falha ao criar"));
}

export async function updateProduct(id: string, payload: ProductPayload) {
  const res = await apiFetch(`/api/admin/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await parseJson<{ error?: string }>(res);
  if (!res.ok) throw new Error(getApiError(json, "Falha ao salvar"));
}

export async function deleteProduct(id: string) {
  const res = await apiFetch(`/api/admin/products/${id}`, { method: "DELETE" });
  const json = await parseJson<{ error?: string }>(res);
  if (!res.ok) throw new Error(getApiError(json, "Falha ao excluir"));
}
