create extension if not exists pgcrypto;
create table if not exists public.admin_users (id uuid primary key default gen_random_uuid(), email text not null unique, password_hash text not null, role text not null default 'admin', created_at timestamptz not null default now());
create table if not exists public.contact_submissions (id uuid primary key default gen_random_uuid(), name text not null, email text not null, mobile text not null, country text not null, service text not null, budget text not null, message text, created_at timestamptz not null default now());
create table if not exists public.career_submissions (id uuid primary key default gen_random_uuid(), name text not null, email text not null, mobile text not null, position text not null, experience text not null, location text, portfolio text, resume_url text, message text, created_at timestamptz not null default now());
create table if not exists public.newsletter_subs (id uuid primary key default gen_random_uuid(), email text not null, created_at timestamptz not null default now());
create table if not exists public.chatbot_conversations (id uuid primary key default gen_random_uuid(), session_id text not null unique, messages jsonb not null default '[]'::jsonb, user_ip inet, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), constraint chatbot_messages_must_be_array check (jsonb_typeof(messages) = 'array'));
create index if not exists contact_submissions_created_at_idx on public.contact_submissions (created_at desc);
create index if not exists career_submissions_created_at_idx on public.career_submissions (created_at desc);
create index if not exists newsletter_subs_created_at_idx on public.newsletter_subs (created_at desc);
create index if not exists chatbot_conversations_created_at_idx on public.chatbot_conversations (created_at desc);
create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists chatbot_conversations_set_updated_at on public.chatbot_conversations;
create trigger chatbot_conversations_set_updated_at before update on public.chatbot_conversations for each row execute function public.set_updated_at();
alter table public.admin_users enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.career_submissions enable row level security;
alter table public.newsletter_subs enable row level security;
alter table public.chatbot_conversations enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('career-resumes', 'career-resumes', false, 5242880, array['application/pdf'])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;