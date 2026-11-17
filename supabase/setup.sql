-- CV Studio: run this once in Supabase → SQL Editor → New query → Run.
-- It creates the CV table, lets each person see only their own CVs,
-- and refuses sign-ups from any email that isn't @bitsom.edu.in.

-- 1. Table: one row per CV, owned by the signed-in user
create table if not exists public.cvs (
  user_id    uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  id         text        not null,
  data       jsonb       not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- 2. Row-level security: you can only read and write your own rows,
--    and only while signed in with a BITSoM email
alter table public.cvs enable row level security;

drop policy if exists "Own CVs: read"   on public.cvs;
drop policy if exists "Own CVs: insert" on public.cvs;
drop policy if exists "Own CVs: update" on public.cvs;
drop policy if exists "Own CVs: delete" on public.cvs;

create policy "Own CVs: read" on public.cvs for select to authenticated
  using (auth.uid() = user_id and lower(auth.jwt() ->> 'email') like '%@bitsom.edu.in');
create policy "Own CVs: insert" on public.cvs for insert to authenticated
  with check (auth.uid() = user_id and lower(auth.jwt() ->> 'email') like '%@bitsom.edu.in');
create policy "Own CVs: update" on public.cvs for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id and lower(auth.jwt() ->> 'email') like '%@bitsom.edu.in');
create policy "Own CVs: delete" on public.cvs for delete to authenticated
  using (auth.uid() = user_id);

-- 3. Block sign-ups from any other email domain (enforced on the server,
--    so it can't be bypassed from the browser)
create or replace function public.only_bitsom_emails()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is null or lower(split_part(new.email, '@', 2)) <> 'bitsom.edu.in' then
    raise exception 'Only @bitsom.edu.in email addresses can sign up';
  end if;
  return new;
end;
$$;

drop trigger if exists only_bitsom_emails on auth.users;
create trigger only_bitsom_emails
  before insert or update of email on auth.users
  for each row execute function public.only_bitsom_emails();
