-- Add missing columns to profiles for the profile edit page
alter table profiles add column if not exists username text;
alter table profiles add column if not exists niches text[];
alter table profiles add column if not exists social_links jsonb;

-- Unique constraint on username (safe to re-run)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_username_key'
      and conrelid = 'profiles'::regclass
  ) then
    alter table profiles add constraint profiles_username_key unique (username);
  end if;
end $$;

-- Avatars storage bucket (5 MB limit, images only, public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- RLS for avatars bucket
create policy "Users can upload their own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Avatars are publicly readable"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

create policy "Users can update their own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
