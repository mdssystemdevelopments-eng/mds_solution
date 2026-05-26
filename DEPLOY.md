# Deploy — MDS Soluções Digitais

Arquitetura de produção:

| Serviço | Onde | Função |
|---------|------|--------|
| **Front** | [Vercel](https://vercel.com) | Next.js (site + painel admin) |
| **API** | [Render](https://render.com) | Express (`backend/`) — login, conteúdo, contato |
| **Banco** | [Neon](https://neon.tech) | PostgreSQL |
| **Domínio** | [Registro.br](https://registro.br) | `mdssolution.com.br` |

---

## 1. Neon (banco de dados)

1. Crie um projeto em [console.neon.tech](https://console.neon.tech).
2. Copie a **connection string** (`postgresql://...?sslmode=require`).
3. No **SQL Editor**, execute o arquivo `neon/schema.sql`.
4. (Opcional) Após editar o site localmente, copie o JSON de `data/site-content.json` e insira:

```sql
INSERT INTO site_content (locale, content)
VALUES ('pt-BR', '{}'::jsonb)
ON CONFLICT (locale) DO NOTHING;
```

Substitua `'{}'` pelo conteúdo JSON completo do arquivo.

---

## 2. Render (API backend)

1. Conecte o repositório no Render → **New Web Service** (ou Blueprint com `render.yaml`).
2. **Root directory:** `backend`
3. **Build:** `npm install && npm run build`
4. **Start:** `npm start`
5. Variáveis de ambiente:

| Variável | Valor |
|----------|--------|
| `DATABASE_URL` | Connection string do Neon |
| `ADMIN_USERNAME` | E-mail do admin (ex.: `mathias@mdssolution.com.br`) |
| `ADMIN_PASSWORD` | Senha forte |
| `JWT_SECRET` | String aleatória longa (Render pode gerar) |
| `CORS_ORIGIN` | `https://mdssolution.com.br,https://www.mdssolution.com.br` |
| `COOKIE_SECURE` | `true` |
| `NODE_ENV` | `production` |

6. Anote a URL do serviço, ex.: `https://mds-api.onrender.com`.
7. (Opcional) Em Render → **Custom Domain** → `api.mdssolution.com.br` (CNAME no Registro.br).

Teste: `GET https://mds-api.onrender.com/health` → `{ "ok": true }`.

---

## 3. Vercel (front Next.js)

1. Importe o repositório na Vercel.
2. **Framework:** Next.js (detectado automaticamente).
3. Região recomendada: **São Paulo (gru1)** — já em `vercel.json`.
4. Variáveis de ambiente:

| Variável | Valor |
|----------|--------|
| `DATABASE_URL` | Mesma string do Neon (SSR lê conteúdo do site) |
| `RENDER_API_URL` | URL do Render, ex. `https://mds-api.onrender.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://mdssolution.com.br` |
| `ADMIN_USERNAME` | Igual ao Render |
| `ADMIN_PASSWORD` | Igual ao Render |
| `ADMIN_SESSION_SECRET` | (Opcional) Mesmo valor que `JWT_SECRET` no Render |

> **Importante:** `ADMIN_USERNAME` e `ADMIN_PASSWORD` devem ser **idênticos** na Vercel e no Render para o cookie de sessão funcionar nas rotas locais do Next e nas reescritas para a API.

5. Deploy. O `next.config.ts` reescreve `/api/*` → Render quando `RENDER_API_URL` está definido (o navegador continua chamando `mdssolution.com.br/api/...`).

---

## 4. Domínio Registro.br

No painel do Registro.br, para `mdssolution.com.br`:

### Site (Vercel)

| Tipo | Nome | Destino |
|------|------|---------|
| **A** | `@` | `76.76.21.21` (IP da Vercel — confira na doc atual) |
| **CNAME** | `www` | `cname.vercel-dns.com` |

Na Vercel → **Settings → Domains** → adicione `mdssolution.com.br` e `www.mdssolution.com.br`.

### API (opcional)

| Tipo | Nome | Destino |
|------|------|---------|
| **CNAME** | `api` | URL do serviço no Render (ex. `mds-api.onrender.com`) |

Se usar só `RENDER_API_URL` (rewrite), o subdomínio `api` é opcional.

---

## 5. Login do painel

- URL: `https://mdssolution.com.br/loginsolution`
- Credenciais: `ADMIN_USERNAME` / `ADMIN_PASSWORD`
- Após login: `/admin/conteudo`

---

## 6. Desenvolvimento local

```bash
cp .env.example .env.local
# Preencha DATABASE_URL (opcional), ADMIN_*, etc.

npm install
npm run dev:reset
```

- Sem `DATABASE_URL`: conteúdo em `data/site-content.json`.
- Com `DATABASE_URL`: lê/grava no Neon.
- Sem `RENDER_API_URL`: rotas `/api` do próprio Next.js.

Para testar com API local:

```bash
cd backend && npm install && npm run dev
# No .env.local da raiz: RENDER_API_URL=http://localhost:4000
```

---

## 7. Checklist pós-deploy

- [ ] `https://mdssolution.com.br` abre o site
- [ ] `https://mdssolution.com.br/loginsolution` — login OK
- [ ] Editar conteúdo no admin persiste (Neon)
- [ ] Formulário de contato responde
- [ ] `sitemap.xml` e `robots.txt` com URL correta
- [ ] HTTPS ativo (Vercel + Render)

---

## Observações

- **Posts / produtos / mídias** no painel ainda usam Supabase quando configurado. Com apenas Neon, use **Conteúdo do site** para textos e seções.
- Não commite `.env.local` nem senhas no Git.
- Free tier do Render pode “dormir” — primeira requisição pode demorar ~30s.
