-- Schema base para CMS (Supabase/Postgres)
-- Rode no SQL Editor do Supabase.

-- Extensões úteis
create extension if not exists "pgcrypto";

-- Perfis (papéis/permissões)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('admin','editor','viewer')),
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Conteúdo do site (JSON por locale)
create table if not exists public.site_content (
  locale text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

-- Configurações gerais (tokens do tema, contatos, redes, etc.)
create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

-- Páginas (se quiser modelar páginas separadas do JSON)
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  seo jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Seções (para páginas dinâmicas/reordenação)
create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references public.pages(id) on delete cascade,
  kind text not null,
  title text,
  data jsonb not null default '{}'::jsonb,
  position int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Blog
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content_html text not null default '',
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  author_id uuid references auth.users(id),
  seo jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.post_categories (
  post_id uuid references public.posts(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  primary key (post_id, category_id)
);

-- Produtos/Serviços
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price_cents int,
  currency text not null default 'BRL',
  active boolean not null default true,
  images jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Mídias (metadados; os binários ficam no Storage)
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media',
  path text not null,
  public_url text,
  mime_type text,
  size_bytes bigint,
  width int,
  height int,
  alt text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

-- Helpers
create or replace function public.is_admin(uid uuid)
returns boolean
language sql stable
as $$
  select exists(select 1 from public.profiles p where p.user_id = uid and p.role = 'admin');
$$;

-- Timestamps
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists trg_pages_updated on public.pages;
create trigger trg_pages_updated before update on public.pages
for each row execute function public.touch_updated_at();

drop trigger if exists trg_sections_updated on public.sections;
create trigger trg_sections_updated before update on public.sections
for each row execute function public.touch_updated_at();

drop trigger if exists trg_posts_updated on public.posts;
create trigger trg_posts_updated before update on public.posts
for each row execute function public.touch_updated_at();

drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated before update on public.products
for each row execute function public.touch_updated_at();

-- Realtime
alter publication supabase_realtime add table public.site_content;
alter publication supabase_realtime add table public.settings;
alter publication supabase_realtime add table public.pages;
alter publication supabase_realtime add table public.sections;
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.media;

-- RLS
alter table public.profiles enable row level security;
alter table public.site_content enable row level security;
alter table public.settings enable row level security;
alter table public.pages enable row level security;
alter table public.sections enable row level security;
alter table public.categories enable row level security;
alter table public.posts enable row level security;
alter table public.post_categories enable row level security;
alter table public.products enable row level security;
alter table public.media enable row level security;

-- Policies (leitura pública onde faz sentido)
drop policy if exists "public read site_content" on public.site_content;
create policy "public read site_content" on public.site_content
for select to anon, authenticated using (true);

drop policy if exists "admin write site_content" on public.site_content;
create policy "admin write site_content" on public.site_content
for all to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "public read settings" on public.settings;
create policy "public read settings" on public.settings
for select to anon, authenticated using (true);

drop policy if exists "admin write settings" on public.settings;
create policy "admin write settings" on public.settings
for all to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Demais tabelas: leitura pública apenas de publicados/ativos
drop policy if exists "public read pages" on public.pages;
create policy "public read pages" on public.pages
for select to anon, authenticated using (published = true);

drop policy if exists "admin write pages" on public.pages;
create policy "admin write pages" on public.pages
for all to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "public read sections" on public.sections;
create policy "public read sections" on public.sections
for select to anon, authenticated using (published = true);

drop policy if exists "admin write sections" on public.sections;
create policy "admin write sections" on public.sections
for all to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories
for select to anon, authenticated using (true);

drop policy if exists "admin write categories" on public.categories;
create policy "admin write categories" on public.categories
for all to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "public read posts" on public.posts;
create policy "public read posts" on public.posts
for select to anon, authenticated using (status = 'published');

drop policy if exists "admin write posts" on public.posts;
create policy "admin write posts" on public.posts
for all to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "admin manage post_categories" on public.post_categories;
create policy "admin manage post_categories" on public.post_categories
for all to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products
for select to anon, authenticated using (active = true);

drop policy if exists "admin write products" on public.products;
create policy "admin write products" on public.products
for all to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "public read media" on public.media;
create policy "public read media" on public.media
for select to anon, authenticated using (true);

drop policy if exists "admin write media" on public.media;
create policy "admin write media" on public.media
for all to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

