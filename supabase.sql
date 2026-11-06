-- Minhas Finanças: banco de dados no Supabase
-- Cole tudo no SQL Editor do Supabase e clique em "Run".

-- Uma linha por usuário, com todos os dados do app em JSON
create table if not exists public.financas (
  user_id uuid primary key references auth.users (id) on delete cascade,
  dados jsonb not null,
  atualizado_em timestamptz not null default now()
);

-- Segurança: cada pessoa só enxerga e altera os próprios dados
alter table public.financas enable row level security;

drop policy if exists "ler os proprios dados" on public.financas;
drop policy if exists "inserir os proprios dados" on public.financas;
drop policy if exists "atualizar os proprios dados" on public.financas;

create policy "ler os proprios dados" on public.financas
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "inserir os proprios dados" on public.financas
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "atualizar os proprios dados" on public.financas
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
