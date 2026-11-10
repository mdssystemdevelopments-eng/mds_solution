import { decryptSecret, encryptSecret } from "@/lib/business/secret";
import { ensureBusinessTables } from "@/lib/business/store";
import { getSql, isNeonConfigured } from "@/lib/db/neon";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";

const UA = "mds-solucoes-digitais";
const TOKEN_KEY = "github_token";
const FILE_PATH = path.join(process.cwd(), "data", "business-secrets.json");

export type GithubConnection = {
  connected: boolean;
  login: string;
  source: "saved" | "env" | "";
};

type SecretStore = Record<string, string>;

async function readFileSecrets(): Promise<SecretStore> {
  try {
    return JSON.parse(await readFile(FILE_PATH, "utf8")) as SecretStore;
  } catch {
    return {};
  }
}

async function writeFileSecrets(store: SecretStore) {
  await mkdir(path.dirname(FILE_PATH), { recursive: true });
  await writeFile(FILE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function getSavedGithubToken(): Promise<string> {
  await ensureBusinessTables();
  if (isNeonConfigured()) {
    const rows = (await getSql()`
      SELECT value FROM business_secrets WHERE key = ${TOKEN_KEY} LIMIT 1
    `) as { value: string }[];
    if (!rows[0]?.value) return "";
    try {
      return decryptSecret(rows[0].value).trim();
    } catch {
      return "";
    }
  }
  const stored = (await readFileSecrets())[TOKEN_KEY];
  if (!stored) return "";
  try {
    return decryptSecret(stored).trim();
  } catch {
    return "";
  }
}

export async function getGithubToken(): Promise<string> {
  return (await getSavedGithubToken()) || process.env.GITHUB_TOKEN?.trim() || "";
}

export async function saveGithubToken(token: string): Promise<void> {
  await ensureBusinessTables();
  const value = encryptSecret(token.trim());
  if (isNeonConfigured()) {
    await getSql()`
      INSERT INTO business_secrets (key, value, updated_at)
      VALUES (${TOKEN_KEY}, ${value}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `;
    return;
  }
  const store = await readFileSecrets();
  store[TOKEN_KEY] = value;
  await writeFileSecrets(store);
}

export async function deleteGithubToken(): Promise<void> {
  await ensureBusinessTables();
  if (isNeonConfigured()) {
    await getSql()`DELETE FROM business_secrets WHERE key = ${TOKEN_KEY}`;
    return;
  }
  try {
    const store = await readFileSecrets();
    delete store[TOKEN_KEY];
    if (Object.keys(store).length) await writeFileSecrets(store);
    else await unlink(FILE_PATH).catch(() => undefined);
  } catch {
    /* ignore */
  }
}

export function githubHeaders(token: string, extra?: HeadersInit): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "User-Agent": UA,
    "X-GitHub-Api-Version": "2022-11-28",
    ...extra,
  };
}

export async function githubJson<T>(token: string, apiPath: string): Promise<{ ok: true; data: T } | { ok: false; status: number }> {
  const res = await fetch(`https://api.github.com${apiPath}`, {
    headers: githubHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) return { ok: false, status: res.status };
  return { ok: true, data: (await res.json()) as T };
}

export async function githubUser(token: string): Promise<{ login: string; name: string } | null> {
  const res = await githubJson<{ login?: string; name?: string }>(token, "/user");
  if (!res.ok || !res.data.login) return null;
  return { login: res.data.login, name: String(res.data.name || "") };
}

export async function githubConnection(): Promise<GithubConnection> {
  const saved = await getSavedGithubToken();
  const env = process.env.GITHUB_TOKEN?.trim() || "";
  const token = saved || env;
  if (!token) return { connected: false, login: "", source: "" };
  const user = await githubUser(token);
  if (!user) return { connected: false, login: "", source: "" };
  return { connected: true, login: user.login, source: saved ? "saved" : "env" };
}

export async function githubRepoMeta(token: string, owner: string, repo: string) {
  const res = await githubJson<{
    private?: boolean;
    default_branch?: string;
    description?: string;
    html_url?: string;
  }>(token, `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
  if (!res.ok) {
    return {
      error:
        res.status === 404
          ? "Repositorio nao encontrado. No repo privado, o token precisa ter permissao repo."
          : "Falha ao ler o repositorio no GitHub.",
      status: res.status,
    };
  }
  return {
    private: Boolean(res.data.private),
    defaultBranch: String(res.data.default_branch || "main"),
    description: String(res.data.description || ""),
    htmlUrl: String(res.data.html_url || ""),
  };
}

export async function githubZipball(token: string, owner: string, repo: string, ref?: string): Promise<Buffer> {
  const suffix = ref ? `/${encodeURIComponent(ref)}` : "";
  const res = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/zipball${suffix}`,
    { headers: githubHeaders(token), cache: "no-store", redirect: "follow" },
  );
  if (!res.ok) {
    throw new Error(res.status === 404 ? "Repositorio sem permissao ou inexistente." : "Falha ao baixar o repositorio.");
  }
  return Buffer.from(await res.arrayBuffer());
}

export async function githubLatestBuildZip(token: string, owner: string, repo: string): Promise<Buffer | null> {
  const res = await githubJson<{
    assets?: { name?: string; url?: string; size?: number }[];
  }>(token, `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/releases/latest`);
  if (!res.ok) return null;
  const asset = (res.data.assets || []).find((item) => {
    const name = String(item.name || "").toLowerCase();
    return name.endsWith(".zip") && /(dist|build|out|site|preview|web)/.test(name);
  });
  if (!asset?.url) return null;
  if ((asset.size || 0) > 8 * 1024 * 1024) return null;
  const file = await fetch(asset.url, {
    headers: githubHeaders(token, { Accept: "application/octet-stream" }),
    cache: "no-store",
    redirect: "follow",
  });
  if (!file.ok) return null;
  return Buffer.from(await file.arrayBuffer());
}
