import { Router } from "express";

export const contactRouter = Router();

contactRouter.post("/", async (req, res) => {
  const name = String(req.body?.name ?? "").trim().slice(0, 120);
  const email = String(req.body?.email ?? "").trim().slice(0, 200);
  const body = String(req.body?.body ?? "").trim().slice(0, 8000);

  if (!name || !email || !body) {
    return res.status(400).json({ error: "Preencha nome, e-mail e mensagem." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "E-mail inválido." });
  }

  console.info(`[contato] ${new Date().toISOString()} | ${name} <${email}>`);

  if (process.env.CONTACT_WEBHOOK_URL) {
    try {
      await fetch(process.env.CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: body }),
      });
    } catch {
      /* webhook opcional */
    }
  }

  return res.json({
    ok: true,
    message: "Mensagem registrada. Entraremos em contato em breve.",
  });
});
