export function newBusinessId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function sanitizePlain(input: unknown, max = 4000): string {
  return String(input ?? "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+=["'][^"']*["']/gi, "")
    .slice(0, max);
}

export function sanitizeHtml(input: unknown, max = 20000): string {
  return String(input ?? "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=["'][^"']*["']/gi, "")
    .slice(0, max);
}

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}
