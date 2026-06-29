-- Allow users to delete their own swipes (needed for reset-swipes dev tool)
create policy "Users can delete their own swipes"
  on swipes for delete
  to authenticated
  using (auth.uid() = swiper_id);

-- Add image_url column to briefs for card background photos
alter table briefs add column if not exists image_url text;
