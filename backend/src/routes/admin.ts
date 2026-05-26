import { Router } from "express";
import { getSql } from "../db.js";
import {
  assertAdmin,
  clearAdminCookie,
  loginWithCredentials,
  setAdminCookie,
} from "../auth.js";

export const adminRouter = Router();

adminRouter.get("/auth-mode", (_req, res) => {
  res.json({ mode: process.env.DATABASE_URL ? "neon" : "legacy" });
});

adminRouter.post("/login", (req, res) => {
  const email = String(req.body?.email ?? req.body?.username ?? "").trim();
  const password = String(req.body?.password ?? "");
  if (!email || !password) {
    return res.status(400).json({ error: "Informe email e senha." });
  }
  if (!loginWithCredentials(email, password)) {
    return res.status(401).json({ error: "E-mail ou senha incorretos." });
  }
  setAdminCookie(res);
  return res.json({ ok: true, mode: "legacy" });
});

adminRouter.post("/logout", (_req, res) => {
  clearAdminCookie(res);
  res.json({ ok: true });
});

adminRouter.get("/content", async (req, res) => {
  if (!assertAdmin(req)) return res.status(401).json({ error: "Não autenticado" });
  try {
    const sql = getSql();
    const rows = await sql`SELECT content FROM site_content WHERE locale = 'pt-BR' LIMIT 1`;
    const row = rows[0] as { content?: unknown } | undefined;
    if (!row?.content) return res.status(404).json({ error: "Conteúdo não encontrado" });
    return res.json(row.content);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao ler conteúdo";
    return res.status(500).json({ error: msg });
  }
});

adminRouter.put("/content", async (req, res) => {
  if (!assertAdmin(req)) return res.status(401).json({ error: "Não autenticado" });
  const content = req.body;
  if (!content || typeof content !== "object") {
    return res.status(400).json({ error: "Corpo inválido" });
  }
  try {
    const sql = getSql();
    await sql`
      INSERT INTO site_content (locale, content, updated_at)
      VALUES ('pt-BR', ${JSON.stringify(content)}::jsonb, NOW())
      ON CONFLICT (locale) DO UPDATE SET
        content = EXCLUDED.content,
        updated_at = NOW()
    `;
    return res.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao salvar";
    return res.status(500).json({ error: msg });
  }
});
