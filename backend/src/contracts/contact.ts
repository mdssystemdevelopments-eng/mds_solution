export type ContactInput = {
  name?: string;
  email?: string;
  body?: string;
};

export type ContactPayload = {
  name: string;
  email: string;
  body: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactInput(input: ContactInput) {
  const payload: ContactPayload = {
    name: String(input.name || "").trim().slice(0, 120),
    email: String(input.email || "").trim().slice(0, 200),
    body: String(input.body || "").trim().slice(0, 8000),
  };

  if (!payload.name || !payload.email || !payload.body) {
    return { ok: false as const, error: "Preencha nome, e-mail e mensagem." };
  }
  if (!EMAIL_RE.test(payload.email)) {
    return { ok: false as const, error: "E-mail inválido." };
  }
  return { ok: true as const, payload };
}
