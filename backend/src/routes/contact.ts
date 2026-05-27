import { Router } from "express";
import { validateContactInput } from "../contracts/contact.js";

export const contactRouter = Router();

contactRouter.post("/", async (req, res) => {
  const parsed = validateContactInput(req.body ?? {});
  if (!parsed.ok) return res.status(400).json({ error: parsed.error });
  const { name, email, body } = parsed.payload;

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
