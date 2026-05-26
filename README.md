# MDS Soluções Digitais — Site + CMS (Next.js + Supabase)

## Stack

- **Frontend**: Next.js (App Router) + React + TailwindCSS
- **Backend**: API Routes do Next.js (Node.js)
- **Banco / Auth / Realtime / Upload**: Supabase (Postgres + Auth + Storage + Realtime)

## Rodar localmente

1) Instale dependências:

```bash
npm install
```

2) Crie `.env.local` (baseado em `.env.example`) e preencha:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3) No Supabase, execute o SQL em `supabase/schema.sql`.

4) Crie um usuário no **Supabase Auth** (Email/Password) e marque como admin:

- Inserir/atualizar em `public.profiles`:
  - `user_id = <id do auth.users>`
  - `role = 'admin'`

5) Rode:

```bash
npm run dev
```

## Admin (CMS)

- Login: `GET /loginsolution` (única rota de acesso ao login admin)
- Dashboard: `GET /admin`
- Conteúdo do site (JSON dinâmico): `GET /admin/conteudo`
- Produtos/Serviços (CRUD): `GET /admin/produtos`

## Realtime (atualização automática)

O site assina mudanças em `public.site_content` via Realtime e aplica `router.refresh()` automaticamente.  
Após salvar no painel, o site público deve refletir as alterações sem F5.

