export function newBusinessId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function sanitizePlain(input: unknown, max = 4000): string {
  return String(input ?? "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+=["'][^"']*["']/gi, "")
    .slice(0, max);
}

export function mediaSrc(url: unknown): string {
  const value = String(url ?? "").trim();
  if (!value) return "";
  const uploads = value.match(/\/uploads\/([^/?#]+)/i);
  if (uploads?.[1]) return `/api/media/${encodeURIComponent(uploads[1])}`;
  return value;
}

export function sanitizeHtml(
  input: unknown,
  max = 20000,
  preview = false,
  opts?: { keepScripts?: boolean; keepDocument?: boolean },
): string {
  let html = String(input ?? "");
  if (!opts?.keepScripts) {
    html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  }
  html = html
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=["'][^"']*["']/gi, "");
  if (!opts?.keepDocument) {
    html = html.replace(/<\/?(html|head|body|meta|link)[^>]*>/gi, "");
  }
  if (preview) {
    html = html
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .replace(/position\s*:\s*fixed/gi, "position:relative")
      .replace(/position\s*:\s*sticky/gi, "position:relative")
      .replace(/z-index\s*:\s*\d+/gi, "z-index:0");
  }
  return html.slice(0, max);
}

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}
