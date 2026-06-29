-- =====================================================================
-- Slide — Briefs + Brand Seed
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)
-- Safe to re-run — all inserts use ON CONFLICT DO NOTHING
-- =====================================================================

-- 1. Create the Prestige London brand auth user
-- (password is "password" — for dev/testing only)
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

-- 2. Profile row for Prestige London
insert into profiles (id, role, display_name, created_at)
values (
  '00000000-0000-0000-0000-000000000001',
  'brand',
  'Prestige London',
  now()
)
on conflict (id) do update set role = 'brand', display_name = 'Prestige London';

-- 3. Brand profile
insert into brand_profiles (id, company_name, industry, subscription_tier, created_at)
values (
  '00000000-0000-0000-0000-000000000001',
  'Prestige London',
  'Lifestyle & Beauty',
  'pro',
  now()
)
on conflict (id) do nothing;

-- 4. Ten live briefs across different niches
insert into briefs (id, brand_id, title, description, deliverables, budget, currency, deadline, niches, status, created_at)
values
  (
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Your Weekend, Elevated',
    'We want creators to show how our new home fragrance range fits naturally into a relaxed, aspirational weekend. Think slow mornings, golden hour light, candles burning, good coffee. The vibe is calm luxury — attainable but considered. Avoid anything that feels staged or overly styled. Real spaces, real moments.',
    array['1 x Instagram Reel (60–90 seconds)', '3 x Instagram Story frames with product visible', '1 x static feed post'],
    35000, 'GBP', '2026-07-18', array['Lifestyle'], 'live', now() - interval '5 days'
  ),
  (
    '00000000-0000-0000-0002-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Summer Glow Routine',
    'We are launching a new SPF moisturiser and want to see it integrated into a creator''s genuine morning skincare routine. No overly produced demos — real lighting, honest reactions, no filter. Skin-first content that feels trustworthy, not aspirational. Speak to your audience like a friend who just found something they love.',
    array['1 x TikTok or Reel (45–75 seconds)', '2 x Instagram Stories showing product in context', 'Before/after skin texture comparison (optional but preferred)'],
    45000, 'GBP', '2026-07-25', array['Beauty'], 'live', now() - interval '4 days'
  ),
  (
    '00000000-0000-0000-0002-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Quick Weeknight Dinners',
    'We make a range of small-batch pasta sauces and want creators to show how fast a genuinely good dinner can come together. Real kitchens, real chaos, real taste reactions. The brief is simple: 20-minute dinner, zero compromise on flavour. The sauce should feel like something you already had in the cupboard.',
    array['1 x cooking Reel under 60 seconds', '1 x static food photography post', 'Usage rights for 6 months across paid social'],
    25000, 'GBP', '2026-07-11', array['Food'], 'live', now() - interval '3 days'
  ),
  (
    '00000000-0000-0000-0002-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'City Break Essentials Pack',
    'We produce a compact travel organiser designed for carry-on-only travellers. We want creators who actually travel to show it working in real situations — airport security, hotel room unpacking, train journeys. We are not looking for luxury travel content. Practical, slick, genuinely useful. Show us why you would not leave home without it.',
    array['1 x travel vlog-style Reel (90 seconds max)', '4 x Instagram Stories shot in-destination', '1 x packing flat lay photograph'],
    55000, 'GBP', '2026-08-01', array['Travel', 'Lifestyle'], 'live', now() - interval '2 days'
  ),
  (
    '00000000-0000-0000-0002-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'Level Up Your Battle Station',
    'We make a premium desk pad and cable management system for PC setups. We want setup tour-style content that integrates our product naturally — not a sponsored moment, just part of an honest desk upgrade. Show the before and after if you can. Gaming and tech audiences are savvy; they respect authenticity over polish.',
    array['1 x YouTube Short or TikTok (60 seconds)', '1 x before/after setup comparison post', 'Product mention in pinned comment with link'],
    20000, 'GBP', '2026-07-18', array['Gaming'], 'live', now() - interval '2 days'
  ),
  (
    '00000000-0000-0000-0002-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'The Autumn Edit',
    'We are a small British knitwear brand and we want creators to style our new collection ahead of the seasonal shift. Think earthy tones, textured fabrics, and the feeling of a wardrobe that is ready for October. We are not chasing trends — we make things that last. Show us how you would genuinely wear it.',
    array['2 x Instagram feed posts (styled outfits)', '1 x Reel showing get-ready-with-me or styling process', '6-month usage rights included'],
    38000, 'GBP', '2026-07-25', array['Fashion'], 'live', now() - interval '1 day'
  ),
  (
    '00000000-0000-0000-0002-000000000007',
    '00000000-0000-0000-0000-000000000001',
    '30 Days of Movement',
    'We are a fitness app launching a new beginner-friendly programme and we want creators to document a genuine 30-day movement challenge using the app. Not a highlight reel — we want the messy middle, the hard days, the small wins. Content should feel real and motivating to people who are not already gym-obsessed.',
    array['3 x progress update Reels across the 30-day period', '6 x Instagram Stories (weekly check-ins)', '1 x final results post'],
    30000, 'GBP', '2026-08-08', array['Fitness', 'Wellness'], 'live', now() - interval '1 day'
  ),
  (
    '00000000-0000-0000-0002-000000000008',
    '00000000-0000-0000-0000-000000000001',
    'WFH That Actually Works',
    'We make ergonomic desk accessories for people who work from home and care about their space. We want creators to show their genuine WFH setup with our products integrated — no showroom staging. Clutter is fine. Real monitor stands, cable chaos tamed, posture improved. Speak to anyone who has ever had a bad back from a kitchen chair.',
    array['1 x setup tour Reel (60–90 seconds)', '2 x before/after desk transformation posts', '1 x Instagram Story poll or question sticker'],
    42000, 'GBP', '2026-07-11', array['Lifestyle'], 'live', now()
  ),
  (
    '00000000-0000-0000-0002-000000000009',
    '00000000-0000-0000-0000-000000000001',
    'The 5-Minute Face',
    'We are a minimal makeup brand and our whole pitch is that our products are fast, effective, and for people who do not want to think about it. We want creators to demonstrate a full face in under 5 minutes using only our core five products. The content should feel rushed in the best way — real life, real speed, real results.',
    array['1 x speed tutorial TikTok or Reel (under 5 minutes)', '1 x product flat lay post', 'Honest review caption required — no scripted copy'],
    50000, 'GBP', '2026-08-01', array['Beauty'], 'live', now()
  ),
  (
    '00000000-0000-0000-0002-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'Weekend Brunch Goals',
    'We produce a range of artisan jams, marmalades, and nut butters. We want weekend brunch content that makes people want to get out of bed. Spread on sourdough, stacked on pancakes, paired with good coffee. Photography should feel warm and abundant. We want people to feel hungry before they read the caption.',
    array['3 x styled brunch photography posts', '1 x Reel showing spread preparation or brunch table setup', 'UGC rights in perpetuity for packaging and website use'],
    28000, 'GBP', '2026-07-18', array['Food'], 'live', now()
  )
on conflict (id) do nothing;
