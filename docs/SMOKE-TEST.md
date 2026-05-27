# Smoke test — checklist manual

Execute após cada refatoração ou antes de deploy.

## Preparação

```bash
npm run dev:reset
# ou: npm run clean && npm run dev
```

Abrir: `http://localhost:3000`

## Site público

- [ ] `/` — home com wallpaper, logo animada, loader com barra
- [ ] `/sobre` — fundo da página
- [ ] `/servicos` — fundo da página
- [ ] `/portfolio` — fundo da página
- [ ] `/contato` — formulário envia (mensagem de sucesso)
- [ ] `/area-cliente` — página carrega
- [ ] Navegação entre páginas sem erro 500 no terminal
- [ ] Favicon e título da aba (marquee) visíveis

## Admin

- [ ] `/loginsolution` — login (Supabase ou legado conforme `.env.local`)
- [ ] `/admin` — dashboard
- [ ] `/admin/conteudo` — editar e salvar conteúdo
- [ ] `/admin/posts` — listar, criar, editar, excluir post
- [ ] `/admin/produtos` — listar, criar, editar, excluir produto

## API (local)

- [ ] `POST /api/contact` — payload inválido retorna 400
- [ ] `GET /api/admin/auth-mode` — retorna `neon` | `supabase` | `legacy`

## Build

```bash
npm run build
npm run lint
cd backend && npm run build
```

- [ ] Build Next sem erro
- [ ] Build backend sem erro

## Dev — cache quebrado

Se aparecer `__webpack_modules__ is not a function` ou `Cannot find module './XXX.js'`:

```bash
npm run clean
npm run dev
```
