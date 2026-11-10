import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

function secretKey(): Buffer {
  const seed =
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    "mds-local-secret";
  return createHash("sha256").update(`mds-biz-secret:${seed}`).digest();
}

export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", secretKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${enc.toString("base64url")}`;
}

export function decryptSecret(stored: string): string {
  const [ivPart, tagPart, dataPart] = String(stored || "").split(".");
  if (!ivPart || !tagPart || !dataPart) return "";
  const decipher = createDecipheriv("aes-256-gcm", secretKey(), Buffer.from(ivPart, "base64url"));
  decipher.setAuthTag(Buffer.from(tagPart, "base64url"));
  const out = Buffer.concat([decipher.update(Buffer.from(dataPart, "base64url")), decipher.final()]);
  return out.toString("utf8");
}
