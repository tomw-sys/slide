-- =====================================================================
-- Slide — Seed Data
-- Run in Supabase SQL editor (executes as service role, bypasses RLS)
-- Safe to run multiple times — all inserts use ON CONFLICT DO NOTHING
-- or ON CONFLICT DO UPDATE where full refresh is preferred.
-- =====================================================================


-- =====================================================================
-- 1. AUTH USERS
-- The handle_new_user trigger fires on each insert and creates a basic
-- profile row. Step 2 upserts over those with the full data.
-- =====================================================================

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, email_change,
  email_change_token_new, recovery_token
)
values
  -- Brand: Prestige London
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000001',
    'authenticated', 'authenticated',
    'prestige@slideapp.dev',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  ),
  -- Creator 1: Zara Mitchell
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111101',
    'authenticated', 'authenticated',
    'zara@slideapp.dev',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  ),
  -- Creator 2: Jordan Blake
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111102',
    'authenticated', 'authenticated',
    'jordan@slideapp.dev',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  ),
  -- Creator 3: Maya Chen
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111103',
    'authenticated', 'authenticated',
    'maya@slideapp.dev',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  ),
  -- Creator 4: Luca Romano
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111104',
    'authenticated', 'authenticated',
    'luca@slideapp.dev',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  ),
  -- Creator 5: Priya Sharma
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111105',
    'authenticated', 'authenticated',
    'priya@slideapp.dev',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  ),
  -- Creator 6: Ethan Cole
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111106',
    'authenticated', 'authenticated',
    'ethan@slideapp.dev',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  ),
  -- Creator 7: Sophie Williams
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111107',
    'authenticated', 'authenticated',
    'sophie@slideapp.dev',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  ),
  -- Creator 8: Marcus Davies
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111108',
    'authenticated', 'authenticated',
    'marcus@slideapp.dev',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  )
on conflict (id) do nothing;


-- =====================================================================
-- 2. PROFILES
-- Upsert so re-runs refresh all fields cleanly.
-- =====================================================================

insert into profiles (id, role, display_name, avatar_url, bio, location)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'brand',
    'Prestige London',
    null,
    'A lifestyle and consumer brand building culture through authentic creator partnerships.',
    'London, UK'
  ),
  (
    '11111111-1111-1111-1111-111111111101',
    'creator',
    'Zara Mitchell',
    'https://source.unsplash.com/featured/?woman,portrait,fashion',
    'London-based lifestyle and fashion creator. I shoot everything on my iPhone and make brands look effortless.',
    'London, UK'
  ),
  (
    '11111111-1111-1111-1111-111111111102',
    'creator',
    'Jordan Blake',
    'https://source.unsplash.com/featured/?man,portrait,chef',
    'Food lover and home cook based in Manchester. Turning everyday ingredients into scroll-stopping content.',
    'Manchester, UK'
  ),
  (
    '11111111-1111-1111-1111-111111111103',
    'creator',
    'Maya Chen',
    'https://source.unsplash.com/featured/?woman,portrait,beauty',
    'Beauty creator obsessed with skincare and honest reviews. No filter, no fluff — just what actually works.',
    'London, UK'
  ),
  (
    '11111111-1111-1111-1111-111111111104',
    'creator',
    'Luca Romano',
    'https://source.unsplash.com/featured/?man,portrait,travel',
    'Travel and lifestyle creator. Slow mornings, big adventures, and hotels with very good coffee.',
    'Edinburgh, UK'
  ),
  (
    '11111111-1111-1111-1111-111111111105',
    'creator',
    'Priya Sharma',
    'https://source.unsplash.com/featured/?woman,portrait,fitness',
    'Fitness coach and wellness creator helping people build sustainable habits without the guilt.',
    'Birmingham, UK'
  ),
  (
    '11111111-1111-1111-1111-111111111106',
    'creator',
    'Ethan Cole',
    'https://source.unsplash.com/featured/?man,portrait,technology',
    'PC gaming and tech content. Setup tours, reviews, and the occasional rage quit. All in good fun.',
    'Leeds, UK'
  ),
  (
    '11111111-1111-1111-1111-111111111107',
    'creator',
    'Sophie Williams',
    'https://source.unsplash.com/featured/?woman,portrait,model',
    'Fashion and beauty creator working with major brands and indie labels. 40+ brand campaigns shot.',
    'London, UK'
  ),
  (
    '11111111-1111-1111-1111-111111111108',
    'creator',
    'Marcus Davies',
    'https://source.unsplash.com/featured/?man,portrait,lifestyle',
    'Food and fitness creator proving you can eat well and train hard without spending a fortune.',
    'Bristol, UK'
  )
on conflict (id) do update set
  role        = excluded.role,
  display_name = excluded.display_name,
  avatar_url  = excluded.avatar_url,
  bio         = excluded.bio,
  location    = excluded.location;


-- =====================================================================
-- 3. BRAND PROFILE
-- =====================================================================

insert into brand_profiles (id, company_name, website, industry, subscription_tier)
values (
  '00000000-0000-0000-0000-000000000001',
  'Prestige London',
  'https://prestigelondon.co.uk',
  'Lifestyle',
  'pro'
)
on conflict (id) do update set
  company_name      = excluded.company_name,
  website           = excluded.website,
  industry          = excluded.industry,
  subscription_tier = excluded.subscription_tier;


-- =====================================================================
-- 4. CREATOR PROFILES
-- day_rate stored in pence (£350/day = 35000)
-- =====================================================================

insert into creator_profiles (
  id,
  niches,
  follower_count_instagram,
  follower_count_tiktok,
  follower_count_youtube,
  follower_count_linkedin,
  avg_engagement_rate,
  verification_status,
  tier,
  day_rate
)
values
  -- Zara Mitchell: Fashion/Lifestyle, elite, approved
  (
    '11111111-1111-1111-1111-111111111101',
    array['Fashion', 'Lifestyle'],
    45000, 22000, 0, 0,
    4.8, 'approved', 'elite',
    35000
  ),
  -- Jordan Blake: Food/Lifestyle, verified tier, approved
  (
    '11111111-1111-1111-1111-111111111102',
    array['Food', 'Lifestyle'],
    28000, 15000, 0, 0,
    6.2, 'approved', 'verified',
    25000
  ),
  -- Maya Chen: Beauty, elite, approved
  (
    '11111111-1111-1111-1111-111111111103',
    array['Beauty'],
    92000, 45000, 0, 0,
    5.4, 'approved', 'elite',
    55000
  ),
  -- Luca Romano: Travel/Lifestyle, verified tier, approved
  (
    '11111111-1111-1111-1111-111111111104',
    array['Travel', 'Lifestyle'],
    67000, 0, 12000, 8000,
    3.9, 'approved', 'verified',
    45000
  ),
  -- Priya Sharma: Fitness/Wellness, rising, pending
  (
    '11111111-1111-1111-1111-111111111105',
    array['Fitness', 'Wellness'],
    18000, 9000, 0, 0,
    7.1, 'pending', 'rising',
    20000
  ),
  -- Ethan Cole: Gaming/Tech, rising, pending
  (
    '11111111-1111-1111-1111-111111111106',
    array['Gaming', 'Tech'],
    0, 8000, 15000, 0,
    8.3, 'pending', 'rising',
    18000
  ),
  -- Sophie Williams: Fashion/Beauty, ambassador, approved
  (
    '11111111-1111-1111-1111-111111111107',
    array['Fashion', 'Beauty'],
    120000, 38000, 0, 14000,
    3.6, 'approved', 'ambassador',
    65000
  ),
  -- Marcus Davies: Food/Fitness, rising, pending
  (
    '11111111-1111-1111-1111-111111111108',
    array['Food', 'Fitness'],
    22000, 10000, 0, 0,
    5.9, 'pending', 'rising',
    22000
  )
on conflict (id) do update set
  niches                  = excluded.niches,
  follower_count_instagram = excluded.follower_count_instagram,
  follower_count_tiktok   = excluded.follower_count_tiktok,
  follower_count_youtube  = excluded.follower_count_youtube,
  follower_count_linkedin = excluded.follower_count_linkedin,
  avg_engagement_rate     = excluded.avg_engagement_rate,
  verification_status     = excluded.verification_status,
  tier                    = excluded.tier,
  day_rate                = excluded.day_rate;


-- =====================================================================
-- 5. BRIEFS
-- All live, all linked to Prestige London.
-- budget stored in pence (£350 = 35000).
-- Deadlines 2–6 weeks from 2026-06-27.
-- =====================================================================

insert into briefs (id, brand_id, title, description, deliverables, budget, currency, deadline, niches, status)
values
  -- 1: Lifestyle — 3 weeks (Jul 18)
  (
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Your Weekend, Elevated',
    'We want creators to show how our new home fragrance range fits naturally into a relaxed, aspirational weekend. Think slow mornings, golden hour light, candles burning, good coffee. The vibe is calm luxury — attainable but considered. Avoid anything that feels staged or overly styled. Real spaces, real moments.',
    array[
      '1 x Instagram Reel (60–90 seconds)',
      '3 x Instagram Story frames with product visible',
      '1 x static feed post'
    ],
    35000, 'GBP', '2026-07-18',
    array['Lifestyle'],
    'live'
  ),
  -- 2: Beauty — 4 weeks (Jul 25)
  (
    '00000000-0000-0000-0002-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Summer Glow Routine',
    'We are launching a new SPF moisturiser and want to see it integrated into a creator''s genuine morning skincare routine. No overly produced demos — real lighting, honest reactions, no filter. Skin-first content that feels trustworthy, not aspirational. Speak to your audience like a friend who just found something they love.',
    array[
      '1 x TikTok or Reel (45–75 seconds)',
      '2 x Instagram Stories showing product in context',
      'Before/after skin texture comparison (optional but preferred)'
    ],
    45000, 'GBP', '2026-07-25',
    array['Beauty'],
    'live'
  ),
  -- 3: Food — 2 weeks (Jul 11)
  (
    '00000000-0000-0000-0002-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Quick Weeknight Dinners',
    'We make a range of small-batch pasta sauces and want creators to show how fast a genuinely good dinner can come together. Real kitchens, real chaos, real taste reactions. The brief is simple: 20-minute dinner, zero compromise on flavour. The sauce should feel like something you already had in the cupboard.',
    array[
      '1 x cooking Reel under 60 seconds',
      '1 x static food photography post',
      'Usage rights for 6 months across paid social'
    ],
    25000, 'GBP', '2026-07-11',
    array['Food'],
    'live'
  ),
  -- 4: Travel — 5 weeks (Aug 1)
  (
    '00000000-0000-0000-0002-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'City Break Essentials Pack',
    'We produce a compact travel organiser designed for carry-on-only travellers. We want creators who actually travel to show it working in real situations — airport security, hotel room unpacking, train journeys. We are not looking for luxury travel content. Practical, slick, genuinely useful. Show us why you would not leave home without it.',
    array[
      '1 x travel vlog-style Reel (90 seconds max)',
      '4 x Instagram Stories shot in-destination',
      '1 x packing flat lay photograph'
    ],
    55000, 'GBP', '2026-08-01',
    array['Travel', 'Lifestyle'],
    'live'
  ),
  -- 5: Gaming — 3 weeks (Jul 18)
  (
    '00000000-0000-0000-0002-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'Level Up Your Battle Station',
    'We make a premium desk pad and cable management system for PC setups. We want setup tour-style content that integrates our product naturally — not a sponsored moment, just part of an honest desk upgrade. Show the before and after if you can. Gaming and tech audiences are savvy; they respect authenticity over polish.',
    array[
      '1 x YouTube Short or TikTok (60 seconds)',
      '1 x before/after setup comparison post',
      'Product mention in pinned comment with link'
    ],
    20000, 'GBP', '2026-07-18',
    array['Gaming', 'Tech'],
    'live'
  ),
  -- 6: Fashion — 4 weeks (Jul 25)
  (
    '00000000-0000-0000-0002-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'The Autumn Edit',
    'We are a small British knitwear brand and we want creators to style our new collection ahead of the seasonal shift. Think earthy tones, textured fabrics, and the feeling of a wardrobe that is ready for October. We are not chasing trends — we make things that last. Show us how you would genuinely wear it.',
    array[
      '2 x Instagram feed posts (styled outfits)',
      '1 x Reel showing get-ready-with-me or styling process',
      '6-month usage rights included'
    ],
    38000, 'GBP', '2026-07-25',
    array['Fashion'],
    'live'
  ),
  -- 7: Fitness — 6 weeks (Aug 8)
  (
    '00000000-0000-0000-0002-000000000007',
    '00000000-0000-0000-0000-000000000001',
    '30 Days of Movement',
    'We are a fitness app launching a new beginner-friendly programme and we want creators to document a genuine 30-day movement challenge using the app. Not a highlight reel — we want the messy middle, the hard days, the small wins. Content should feel real and motivating to people who are not already gym-obsessed.',
    array[
      '3 x progress update Reels across the 30-day period',
      '6 x Instagram Stories (weekly check-ins)',
      '1 x final results post'
    ],
    30000, 'GBP', '2026-08-08',
    array['Fitness', 'Wellness'],
    'live'
  ),
  -- 8: Lifestyle — 2 weeks (Jul 11)
  (
    '00000000-0000-0000-0002-000000000008',
    '00000000-0000-0000-0000-000000000001',
    'WFH That Actually Works',
    'We make ergonomic desk accessories for people who work from home and care about their space. We want creators to show their genuine WFH setup with our products integrated — no showroom staging. Clutter is fine. Real monitor stands, cable chaos tamed, posture improved. Speak to anyone who has ever had a bad back from a kitchen chair.',
    array[
      '1 x setup tour Reel (60–90 seconds)',
      '2 x before/after desk transformation posts',
      '1 x Instagram Story poll or question sticker'
    ],
    42000, 'GBP', '2026-07-11',
    array['Lifestyle'],
    'live'
  ),
  -- 9: Beauty — 5 weeks (Aug 1)
  (
    '00000000-0000-0000-0002-000000000009',
    '00000000-0000-0000-0000-000000000001',
    'The 5-Minute Face',
    'We are a minimal makeup brand and our whole pitch is that our products are fast, effective, and for people who do not want to think about it. We want creators to demonstrate a full face in under 5 minutes using only our core five products. The content should feel rushed in the best way — real life, real speed, real results.',
    array[
      '1 x speed tutorial TikTok or Reel (under 5 minutes)',
      '1 x product flat lay post',
      'Honest review caption required — no scripted copy'
    ],
    50000, 'GBP', '2026-08-01',
    array['Beauty'],
    'live'
  ),
  -- 10: Food — 3 weeks (Jul 18)
  (
    '00000000-0000-0000-0002-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'Weekend Brunch Goals',
    'We produce a range of artisan jams, marmalades, and nut butters. We want weekend brunch content that makes people want to get out of bed. Spread on sourdough, stacked on pancakes, paired with good coffee. Photography should feel warm and abundant. We want people to feel hungry before they read the caption.',
    array[
      '3 x styled brunch photography posts',
      '1 x Reel showing spread preparation or brunch table setup',
      'UGC rights in perpetuity for packaging and website use'
    ],
    28000, 'GBP', '2026-07-18',
    array['Food'],
    'live'
  )
on conflict (id) do nothing;


-- =====================================================================
-- 6. REWARDS
-- 6 partner offers across fashion, food, travel, tech, cinema, fitness.
-- minimum_tier: the lowest tier that can access this reward.
-- =====================================================================

insert into rewards (id, partner_name, offer_description, discount_code, discount_value, minimum_tier, expires_at, is_active)
values
  -- Fashion
  (
    '00000000-0000-0000-0003-000000000001',
    'Topshop',
    '25% off your next full-price order. Valid online and in-store. No minimum spend. Exclusive to Slide creators.',
    'SLIDE25',
    '25% off',
    'rising',
    '2026-12-31',
    true
  ),
  -- Food
  (
    '00000000-0000-0000-0003-000000000002',
    'Deliveroo',
    '£10 off each of your next three orders. Minimum spend £20 per order. Works with Deliveroo Plus.',
    'SLIDEFOOD10',
    '£10 off',
    'rising',
    '2026-09-30',
    true
  ),
  -- Travel
  (
    '00000000-0000-0000-0003-000000000003',
    'Booking.com',
    '£50 hotel credit on stays of 2 nights or more. No blackout dates. Book any property on the platform.',
    'SLIDETRAVEL50',
    '£50 credit',
    'verified',
    '2026-12-31',
    true
  ),
  -- Tech
  (
    '00000000-0000-0000-0003-000000000004',
    'Currys',
    '10% off your next tech purchase. Valid on laptops, cameras, audio, and mobile. No maximum spend cap.',
    'SLIDETECH10',
    '10% off',
    'rising',
    '2026-10-31',
    true
  ),
  -- Cinema
  (
    '00000000-0000-0000-0003-000000000005',
    'Cineworld',
    '2-for-1 cinema tickets on every visit. Valid on standard and IMAX screenings. No single-use limit.',
    'SLIDEFILM21',
    '2 for 1',
    'rising',
    '2026-08-31',
    true
  ),
  -- Fitness
  (
    '00000000-0000-0000-0003-000000000006',
    'PureGym',
    'Your first full month free at any PureGym location across the UK. No joining fee. Switch to monthly after.',
    'SLIDEGYM1M',
    '1 month free',
    'rising',
    null,
    true
  )
on conflict (id) do nothing;
