-- =====================================================================
-- Slide — Content storage bucket for UGC sample videos
-- Run in Supabase SQL editor
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'content',
  'content',
  true,
  104857600, -- 100 MB per file
  array['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/mpeg']
)
on conflict (id) do nothing;

-- Creators can upload into their own subfolder: content/{their_uuid}/...
create policy "Creators can upload their own sample videos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'content'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Any authenticated user (admin included) can read content files
create policy "Authenticated users can view content"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'content');

-- Creators can replace their own files
create policy "Creators can update their own files"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'content'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Creators can delete their own files
create policy "Creators can delete their own files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'content'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
