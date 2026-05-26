import { createHmac, timingSafeEqual } from "crypto";
import type { Request, Response } from "express";

export const ADMIN_COOKIE = "mds_admin";

export function getAdminCredentials() {
  return {
    username: (process.env.ADMIN_USERNAME ?? "admin").trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD ?? "",
  };
}

export function getExpectedAdminToken(): string | null {
  const { username, password } = getAdminCredentials();
  const secret = process.env.JWT_SECRET || process.env.ADMIN_SESSION_SECRET || password;
  if (!secret || !password) return null;
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

export function setAdminCookie(res: Response) {
  const token = getExpectedAdminToken();
  if (!token) return;
  const secure = process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production";
  res.cookie(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAdminCookie(res: Response) {
  res.cookie(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
}

export function assertAdmin(req: Request): boolean {
  return isValidAdminCookie(req.cookies?.[ADMIN_COOKIE]);
}

function safeCompare(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, "utf8");
    const bb = Buffer.from(b, "utf8");
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

export function loginWithCredentials(email: string, password: string): boolean {
  const { username, password: p } = getAdminCredentials();
  const inUser = email.trim().toLowerCase();
  return safeCompare(inUser, username) && safeCompare(password, p);
}
