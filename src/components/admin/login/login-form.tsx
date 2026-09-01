"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api-fetch";

function LoginFields() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/admin/conteudo";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const trimmed = email.trim();
      const res = await apiFetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, username: trimmed, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "E-mail ou senha incorretos.");
        return;
      }
      const dest = next.startsWith("/admin") ? next : "/admin/conteudo";
      router.push(dest);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="login-solution__form">
      <label className="login-solution__label">
        E-mail
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-solution__input"
          required
        />
      </label>

      <label className="login-solution__label">
        Senha
        <span className="login-solution__pass-wrap">
          <input
            type={showPass ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-solution__input login-solution__input--pass"
            required
          />
          <button
            type="button"
            className="login-solution__pass-toggle"
            onClick={() => setShowPass((v) => !v)}
            aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPass ? "Ocultar" : "Mostrar"}
          </button>
        </span>
      </label>

      {error && (
        <p className="login-solution__error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="login-solution__submit">
        {loading ? (
          <span className="login-solution__submit-inner">
            <span className="login-solution__spinner" aria-hidden />
            Entrando…
          </span>
        ) : (
          "Acessar painel"
        )}
      </button>
    </form>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={<div className="login-solution__skeleton h-40" aria-hidden />}>
      <LoginFields />
    </Suspense>
  );
}

export function LoginCard() {
  return (
    <div className="login-solution__card">
      <div className="login-solution__card-head">
        <h1 className="login-solution__title">Painel administrativo</h1>
        <p className="login-solution__subtitle">Entre com suas credenciais para gerenciar o site.</p>
      </div>
      <LoginForm />
      <p className="login-solution__footer">
        <Link href={process.env.NEXT_PUBLIC_SITE_URL || "https://mdssolution.com.br"} className="login-solution__back">
          Voltar ao site
        </Link>
      </p>
    </div>
  );
}
