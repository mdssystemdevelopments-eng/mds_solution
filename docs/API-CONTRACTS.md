# Contratos de API

Rotas canônicas e fronteira híbrida: `src/modules/shared/api/hybrid-routing.ts`.

## Next.js (`src/app/api`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/api/admin/auth-mode` | — | `neon` \| `supabase` \| `legacy` |
| POST | `/api/admin/login` | — | Login admin |
| POST | `/api/admin/logout` | — | Logout |
| GET | `/api/admin/content` | Admin | JSON do site |
| PUT | `/api/admin/content` | Admin | Salva conteúdo |
| GET/POST | `/api/admin/posts` | Supabase admin | Lista / cria posts |
| GET/PUT/DELETE | `/api/admin/posts/[id]` | Supabase admin | CRUD post |
| GET/POST | `/api/admin/products` | Supabase admin | Lista / cria produtos |
| GET/PUT/DELETE | `/api/admin/products/[id]` | Supabase admin | CRUD produto |
| POST | `/api/contact` | — | Formulário de contato |
| GET | `/api/pinterest-video` | — | Utilitário (legado) |

## Express (`backend/src`, prefixo `/api` no Render)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/health` | — | Health check |
| GET | `/api/admin/auth-mode` | — | Modo `neon` ou `legacy` |
| POST | `/api/admin/login` | — | Login legado |
| POST | `/api/admin/logout` | — | Logout |
| GET/PUT | `/api/admin/content` | Cookie admin | Conteúdo Neon |
| POST | `/api/contact` | — | Contato (mesma validação que Next) |

## Contato — payload unificado

Validação em:

- `src/modules/shared/contracts/contact.ts` (Next)
- `backend/src/contracts/contact.ts` (Express, cópia espelhada)

```json
{ "name": "string", "email": "string", "body": "string" }
```

Resposta sucesso: `{ "ok": true, "message": "..." }`  
Erro: `{ "error": "mensagem" }` com status 400.
