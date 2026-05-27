# MDS Soluções Digitais — Site + CMS

## Stack

- **Frontend**: Next.js 15 (App Router) + React 19 + Tailwind
- **BFF**: API Routes em `src/app/api`
- **API legada**: Express em `backend/` (Render)
- **Dados**: Neon / Supabase / `data/site-content.json`

## Documentação

| Documento | Conteúdo |
|-----------|----------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Estrutura, domínios, decisões |
| [docs/SMOKE-TEST.md](docs/SMOKE-TEST.md) | Checklist pós-refatoração |
| [docs/API-CONTRACTS.md](docs/API-CONTRACTS.md) | Rotas e payloads |
| [docs/REFACTORING-CHANGELOG.md](docs/REFACTORING-CHANGELOG.md) | O que mudou na refatoração |
| [DEPLOY.md](DEPLOY.md) | Deploy Vercel + Render + Neon |
| [docs/deploy/DEPLOY-AGORA.md](docs/deploy/DEPLOY-AGORA.md) | Re-deploy rápido quando Vercel bloqueia |
| [docs/deploy/DEPLOY-VIDEO.md](docs/deploy/DEPLOY-VIDEO.md) | Troubleshooting de vídeos no deploy |

## Rodar localmente

```bash
npm install
cp .env.example .env.local
# Preencha Supabase e/ou ADMIN_* conforme modo desejado
npm run dev:reset
```

Site: `http://localhost:3000`  
Admin: `http://localhost:3000/loginsolution`

## Estrutura modular (`src/modules`)

```text
src/modules/
  admin/posts|products/   # types + services (CRUD)
  admin/ui/               # componentes compartilhados
  shared/constants/       # ASSETS (paths públicos)
  shared/contracts/       # validação (contato)
  shared/http/            # parseJson, erros API
  shared/utils/           # slugify
```

Componentes em `src/components` permanecem por compatibilidade; novas features devem preferir `src/modules`.

## Organização da raiz

- Arquivos de rascunho (imagens/vídeos de trabalho) ficam em `workspace-assets/raw/`.
- Esses arquivos são ignorados no Git para manter o repositório limpo.

## Scripts úteis

| Comando | Uso |
|---------|-----|
| `npm run dev` | Desenvolvimento |
| `npm run dev:reset` | Limpa `.next` e sobe na porta 3000 |
| `npm run clean` | Remove cache `.next` |
| `npm run build` | Build produção |
| `npm run lint` | ESLint |

## Admin (CMS)

- Login: `/loginsolution`
- Dashboard: `/admin`
- Conteúdo: `/admin/conteudo`
- Posts: `/admin/posts`
- Produtos: `/admin/produtos`

## Realtime

Com Supabase configurado, mudanças em `site_content` atualizam o site via `router.refresh()`.
