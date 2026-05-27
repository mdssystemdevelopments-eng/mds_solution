/** Parse JSON de Response com fallback seguro. */
export async function parseJson<T>(res: Response): Promise<T> {
  return (await res.json().catch(() => ({}))) as T;
}

export function getApiError(json: { error?: string }, fallback: string) {
  return json.error || fallback;
}
