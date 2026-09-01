"use client";

import { useState } from "react";

export function BusinessUnlockForm({ slug }: { slug: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/business/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Nao foi possivel entrar.");
        return;
      }
      window.location.reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="bp-lock">
      <form onSubmit={(e) => void submit(e)}>
        <h1>Projeto privado</h1>
        <p>Este projeto e protegido. Informe a senha para continuar.</p>
        <label>
          Senha
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error ? <p role="alert">{error}</p> : null}
        <button type="submit" disabled={busy}>{busy ? "Validando..." : "Acessar"}</button>
      </form>
    </main>
  );
}
