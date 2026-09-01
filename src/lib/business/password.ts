import { createHash, randomBytes, timingSafeEqual } from "crypto";

export function hashBusinessPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const digest = createHash("sha256").update(`${salt}:${password}`).digest("hex");
  return `${salt}:${digest}`;
}

export function verifyBusinessPassword(password: string, stored: string): boolean {
  const [salt, digest] = stored.split(":");
  if (!salt || !digest) return false;
  const next = createHash("sha256").update(`${salt}:${password}`).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(digest, "hex"), Buffer.from(next, "hex"));
  } catch {
    return false;
  }
}

export function businessAccessToken(projectId: string, storedHash: string): string {
  return createHash("sha256").update(`access:${projectId}:${storedHash}`).digest("hex");
}

export function businessCookieName(projectId: string): string {
  return `mds_biz_${projectId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}
