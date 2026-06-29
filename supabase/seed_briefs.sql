-- =====================================================================
-- Slide — Briefs + Brand Seed
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)
-- Safe to re-run — all inserts use ON CONFLICT DO NOTHING / DO UPDATE
-- =====================================================================

-- 1. Create the Prestige London brand auth user (password: "password" — dev only)
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, email_change,
  email_change_token_new, recovery_token
)
values (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  'authenticated', 'authenticated',
  'prestige@slideapp.dev',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(), now(), '', '', '', ''
)
on conflict (id) do nothing;

-- 2. Profile row
insert into profiles (id, role, display_name, created_at)
values ('00000000-0000-0000-0000-000000000001', 'brand', 'Prestige London', now())
on conflict (id) do update set role = 'brand', display_name = 'Prestige London';

-- 3. Brand profile
insert into brand_profiles (id, company_name, industry, subscription_tier, created_at)
values ('00000000-0000-0000-0000-000000000001', 'Prestige London', 'Lifestyle & Beauty', 'pro', now())
on conflict (id) do nothing;

-- 4. Six live briefs (with Unsplash background images — all URLs verified 200)
insert into briefs (id, brand_id, title, description, deliverables, budget, currency, deadline, niches, status, image_url, created_at)
values
  (
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Your Weekend, Elevated',
    'Show how our new home fragrance range fits naturally into a relaxed, aspirational weekend. Think slow mornings, golden hour light, candles burning, good coffee. The vibe is calm luxury — attainable but considered. Avoid anything staged or overly styled. Real spaces, real moments.',
    array['1 x Instagram Reel (60–90 seconds)', '3 x Instagram Story frames with product visible', '1 x static feed post'],
    35000, 'GBP', '2026-08-18', array['Lifestyle'], 'live',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    now() - interval '5 days'
  ),
  (
    '00000000-0000-0000-0002-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Summer Glow Routine',
    'We are launching a new SPF moisturiser. Show it integrated into a genuine morning skincare routine — no overly produced demos. Real lighting, honest reactions, no filter. Speak to your audience like a friend who just found something they love.',
    array['1 x TikTok or Reel (45–75 seconds)', '2 x Instagram Stories showing product in context'],
    45000, 'GBP', '2026-08-25', array['Beauty'], 'live',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
    now() - interval '4 days'
  ),
  (
    '00000000-0000-0000-0002-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Quick Weeknight Dinners',
    'We make small-batch pasta sauces. Show how fast a genuinely good dinner can come together. Real kitchens, real chaos, real taste reactions. 20-minute dinner, zero compromise on flavour.',
    array['1 x cooking Reel under 60 seconds', '1 x static food photography post'],
    25000, 'GBP', '2026-08-11', array['Food'], 'live',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    now() - interval '3 days'
  ),
  (
    '00000000-0000-0000-0002-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'City Break Essentials Pack',
    'A compact travel organiser for carry-on-only travellers. Show it working in real situations — airport security, hotel room unpacking, train journeys. Practical, slick, genuinely useful.',
    array['1 x travel vlog-style Reel (90 seconds max)', '4 x Instagram Stories shot in-destination', '1 x packing flat lay photograph'],
    55000, 'GBP', '2026-09-01', array['Travel', 'Lifestyle'], 'live',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
    now() - interval '2 days'
  ),
  (
    '00000000-0000-0000-0002-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'Level Up Your Battle Station',
    'Premium desk pad and cable management for PC setups. Setup tour-style content integrating our product naturally. Gaming audiences are savvy — they respect authenticity over polish. Show the before and after.',
    array['1 x YouTube Short or TikTok (60 seconds)', '1 x before/after setup comparison post'],
    20000, 'GBP', '2026-08-18', array['Gaming'], 'live',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    now() - interval '2 days'
  ),
  (
    '00000000-0000-0000-0002-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'The Autumn Edit',
    'Small British knitwear brand. Style our new collection ahead of the seasonal shift. Earthy tones, textured fabrics, the feeling of a wardrobe ready for October. We make things that last — show how you would genuinely wear it.',
    array['2 x Instagram feed posts (styled outfits)', '1 x Reel showing get-ready-with-me or styling process'],
    38000, 'GBP', '2026-08-25', array['Fashion'], 'live',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    now() - interval '1 day'
  )
on conflict (id) do update set
  status = 'live',
  image_url = excluded.image_url;

-- 5. Confirm row count
select count(*) as live_brief_count from briefs where status = 'live';
