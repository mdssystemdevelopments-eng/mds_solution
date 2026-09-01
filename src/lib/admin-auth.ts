import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "mds_admin";

export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME?.trim() ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (process.env.NODE_ENV === "production" && (!username || !password)) {
    return { username: "", password: "" };
  }
  return {
    username: username || "admin",
    password: password || "root",
  };
}

export function getExpectedAdminToken(): string | null {
  const { username, password } = getAdminCredentials();
  if (!username || !password) return null;
  const secret = process.env.ADMIN_SESSION_SECRET || password;
  if (!secret) return null;
  return createHmac("sha256", secret).update(`mds-admin:${username}:${password}`).digest("hex");
}

export function isValidAdminCookie(value: string | undefined): boolean {
  const expected = getExpectedAdminToken();
  if (!expected || !value) return false;
  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(value, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function setAdminCookie() {
  const token = getExpectedAdminToken();
  if (!token) return;
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminCookie() {
  (await cookies()).set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
}

export async function assertAdmin(): Promise<{ ok: true } | { ok: false; status: number }> {
  if (!getExpectedAdminToken()) return { ok: false, status: 503 };
  const c = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!isValidAdminCookie(c)) return { ok: false, status: 401 };
  return { ok: true };
}
