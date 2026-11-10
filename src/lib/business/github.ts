export type GithubRepoRef = {
  owner: string;
  repo: string;
};

export function safeHttpUrl(input: unknown, max = 500): string {
  const value = String(input ?? "").trim().slice(0, max);
  if (!value) return "";
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    url.hash = "";
    return url.toString().replace(/\/$/, "") === url.origin ? url.origin + "/" : url.toString();
  } catch {
    return "";
  }
}

export function parseGithubRepo(input: unknown): GithubRepoRef | null {
  const value = String(input ?? "").trim();
  if (!value) return null;
  const short = value.match(/^([\w.-]+)\/([\w.-]+?)(?:\.git)?$/i);
  if (short && !value.includes("github.com") && !value.includes("://")) {
    return { owner: short[1], repo: short[2].replace(/\.git$/i, "") };
  }
  try {
    const withProto = value.includes("://") ? value : `https://${value}`;
    const url = new URL(withProto);
    const host = url.hostname.replace(/^www\./i, "").toLowerCase();
    if (host !== "github.com") return null;
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/i, "");
    if (!owner || !repo) return null;
    return { owner, repo };
  } catch {
    return null;
  }
}

export function siteHostLabel(input: unknown): string {
  const value = String(input ?? "").trim();
  if (value.startsWith("/") && !value.startsWith("//")) return "preview MDS";
  try {
    return new URL(safeHttpUrl(value) || value).hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}

export function canEmbedSite(input: unknown): boolean {
  const value = String(input ?? "").trim();
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  const url = safeHttpUrl(value);
  return Boolean(url) && !isGithubWebsiteHost(url);
}

export function githubRepoUrl(ref: GithubRepoRef): string {
  return `https://github.com/${ref.owner}/${ref.repo}`;
}

export function githubPagesUrl(ref: GithubRepoRef): string {
  if (ref.repo.toLowerCase() === `${ref.owner.toLowerCase()}.github.io`) {
    return `https://${ref.owner}.github.io/`;
  }
  return `https://${ref.owner}.github.io/${ref.repo}/`;
}

export function isGithubWebsiteHost(input: unknown): boolean {
  try {
    const url = new URL(String(input ?? ""));
    const host = url.hostname.replace(/^www\./i, "").toLowerCase();
    return host === "github.com";
  } catch {
    return false;
  }
}

export function keepHttpUrl(input: unknown, max = 500): string {
  const raw = String(input ?? "").trim().slice(0, max).replace(/[<>"']/g, "");
  return safeHttpUrl(raw) || raw;
}

export function keepGithubRepo(input: unknown): string {
  const raw = String(input ?? "").trim().slice(0, 300).replace(/[<>"']/g, "");
  const ref = parseGithubRepo(raw);
  return ref ? githubRepoUrl(ref) : raw;
}

export function hostedPreviewPath(slug: string): string {
  return `/business/${encodeURIComponent(slug)}/site/`;
}

export function liveSiteUrl(repoUrl?: string, siteUrl?: string): string {
  const live = safeHttpUrl(siteUrl);
  if (live && !isGithubWebsiteHost(live)) return live;
  return "";
}

export function presentationSiteUrl(project: {
  slug: string;
  githubRepo?: string;
  githubSite?: string;
  githubPreviewFiles?: number;
}): string {
  if ((project.githubPreviewFiles || 0) > 0) return hostedPreviewPath(project.slug);
  return liveSiteUrl(project.githubRepo, project.githubSite);
}
