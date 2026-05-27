# Changelog da refatoração estrutural

## Estrutura nova

- `src/modules/shared/` — utils, constants, contracts, http
- `src/modules/admin/posts|products/` — types + services
- `src/modules/admin/ui/` — componentes compartilhados do admin
- `src/styles/page-loader.css` — estilos do loader extraídos
- `docs/` — arquitetura, smoke test, contratos API

## Melhorias aplicadas

- `slugify` centralizado (posts + produtos)
- CRUD admin usa camada `services/*-api.ts`
- Contrato de contato unificado (Next + Express)
- Assets centralizados em `ASSETS` (logo, wallpaper, backgrounds)
- Loader/boot: ordem corrigida (`is-booting` só remove após fade)
- Favicon + título animado na aba

## Arquivos legados mantidos (compatibilidade)

- `src/components/*` — rotas ainda importam daqui
- `src/lib/*` — core de conteúdo e auth
- `backend/` — API Express no Render

## Não removidos (propositalmente)

- Vídeos grandes na raiz (`*.mp4`) — ignorados pelo `.gitignore`
- `public/wallpaper.mp4` (~252MB local) — não versionar no GitHub
- Rotas PT inalteradas

## Concluído nesta fase

- `page-loader.css` importado em `globals.css`; bloco duplicado do loader removido
- `ASSETS` expandido (favicon, logo anim, comentários em CSS)
- `README.md` na raiz com links para docs e estrutura modular

## Pendências conhecidas (baixa prioridade)

- `globals.css` ainda grande (~1.8k linhas) — extração gradual de outros blocos
- `section-editor.tsx` e `client-quote-builder.tsx` ainda monolíticos
- Duplicação de contrato contato Next/backend (espelhado; unificar via pacote shared no futuro)
