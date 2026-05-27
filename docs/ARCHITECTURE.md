# Arquitetura do projeto (MDS Soluções Digitais)

## Visão geral

| Camada | Pasta | Responsabilidade |
|--------|-------|------------------|
| Rotas/páginas | `src/app` | App Router Next.js (site PT, admin, API BFF) |
| UI legada (compat.) | `src/components` | Componentes do site e admin (importados pelas rotas) |
| Domínios | `src/modules` | Lógica por domínio: admin, shared |
| Lib core | `src/lib` | Conteúdo do site, auth, Supabase, Neon |
| API Express | `backend/src` | Serviços legados (Neon auth/content, contato) |
| Assets | `public` | Arquivos estáticos servidos pelo Next |

## Arquitetura híbrida (decisão)

- **Next API (`src/app/api`)**: BFF — validação, sessão, integração Supabase, contato com mensagem dinâmica do CMS.
- **Express (`backend/src`)**: API legada para deploy no Render quando `RENDER_API_URL` está configurado; rewrites em `next.config.ts`.
- **Roteamento documentado**: `src/modules/shared/api/hybrid-routing.ts` (rotas BFF vs espelho Express, `resolveApiPath`).
- **Não remover** nenhuma das duas camadas sem migração explícita.

## Domínios em `src/modules`

```text
src/modules/
  admin/
    posts/       types + services (CRUD posts)
    products/    types + services (CRUD produtos)
    ui/          componentes reutilizáveis do admin
  shared/
    constants/   ASSETS (paths de imagens/vídeos)
    contracts/   validação compartilhada (ex.: contato)
    http/        helpers de API client
    utils/       slugify, etc.
```

## URLs públicas (português)

Rotas do site permanecem em PT: `/sobre`, `/servicos`, `/portfolio`, `/contato`, `/area-cliente`, `/loginsolution`.

Código interno (pastas, tipos, serviços) em inglês.

## Conteúdo e persistência

Ordem de leitura do conteúdo (`src/lib/site-content.ts`):

1. Neon (`DATABASE_URL`)
2. Supabase (`site_content`)
3. Arquivo local `data/site-content.json`

Admin auth: Supabase (preferencial) ou cookie legado (`ADMIN_*`).

## Assets centralizados

Paths públicos definidos em `src/modules/shared/constants/assets.ts`.  
Ao mover arquivos em `public/`, atualize apenas esse arquivo e referências derivadas.

## Próximos passos sugeridos (sem quebrar produção)

- Mover gradualmente `src/components/admin/*` → `src/modules/admin/components/*` com reexport.
- Extrair estilos de `globals.css` por domínio (loader já em `src/styles/page-loader.css`).
- Testes automatizados de smoke (Playwright) baseados em `docs/SMOKE-TEST.md`.
