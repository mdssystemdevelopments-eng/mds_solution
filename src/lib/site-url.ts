export const DEFAULT_PUBLIC_SITE_URL = "https://mdssolution.com.br";

export function publicSiteUrl(): string {
  const env = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_PUBLIC_SITE_URL).trim().replace(/\/$/, "");
  try {
    const url = new URL(env.includes("://") ? env : `https://${env}`);
    if (url.hostname.toLowerCase().startsWith("adminplus.")) {
      url.hostname = url.hostname.replace(/^adminplus\./i, "");
    }
    return url.origin;
  } catch {
    return DEFAULT_PUBLIC_SITE_URL;
  }
}

export function businessPublicUrl(slug: string): string {
  return `${publicSiteUrl()}/business/${encodeURIComponent(slug)}`;
}

export function clientPublicOrigin(): string {
  if (typeof window !== "undefined") {
    const host = window.location.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") {
      return window.location.origin;
    }
  }
  return publicSiteUrl();
}

export function clientBusinessUrl(slug: string): string {
  return `${clientPublicOrigin()}/business/${encodeURIComponent(slug)}`;
}
