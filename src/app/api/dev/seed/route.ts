import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Only available in development
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const admin = createAdminClient()

  // ── 1. Ensure a brand user exists ─────────────────────────────────────────

  const BRAND_ID = '00000000-0000-0000-0000-000000000001'

  const { error: userCheckErr } = await admin.auth.admin.getUserById(BRAND_ID)
  if (userCheckErr) {
    const { error: createAuthErr } = await admin.auth.admin.createUser({
      user_metadata: {},
      email: 'prestige@slideapp.dev',
      password: 'password',
      email_confirm: true,
    })
    if (createAuthErr && !createAuthErr.message.includes('already been registered')) {
      return NextResponse.json({ error: `Auth user: ${createAuthErr.message}` }, { status: 500 })
    }
  }

  await admin.from('profiles').upsert(
    { id: BRAND_ID, role: 'brand', display_name: 'Prestige London' },
    { onConflict: 'id' }
  )

  await admin.from('brand_profiles').upsert(
    { id: BRAND_ID, company_name: 'Prestige London', industry: 'Lifestyle & Beauty', subscription_tier: 'pro' },
    { onConflict: 'id' }
  )

  // ── 2. Check existing live brief count ────────────────────────────────────

  const { data: existing, error: countErr } = await admin
    .from('briefs')
    .select('id', { count: 'exact' })
    .eq('status', 'live')

  if (countErr) {
    return NextResponse.json({ error: `Count query: ${countErr.message}` }, { status: 500 })
  }

  const liveCount = existing?.length ?? 0

  // ── 3. Upsert 6 live briefs with verified Unsplash backgrounds ────────────

  const briefs = [
    {
      id: '00000000-0000-0000-0002-000000000001',
      brand_id: BRAND_ID,
      title: 'Your Weekend, Elevated',
      description: 'Show how our home fragrance range fits naturally into a relaxed, aspirational weekend. Calm luxury — think slow mornings, golden hour light, good coffee. Real spaces, real moments.',
      deliverables: ['1 x Instagram Reel (60-90 seconds)', '3 x Instagram Story frames', '1 x static feed post'],
      budget: 35000,
      currency: 'GBP',
      deadline: '2026-08-18',
      niches: ['Lifestyle'],
      status: 'live',
      image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    },
    {
      id: '00000000-0000-0000-0002-000000000002',
      brand_id: BRAND_ID,
      title: 'Summer Glow Routine',
      description: 'We are launching a new SPF moisturiser. Show it integrated into a genuine morning skincare routine. Real lighting, honest reactions, no filter.',
      deliverables: ['1 x TikTok or Reel (45-75 seconds)', '2 x Instagram Stories showing product in context'],
      budget: 45000,
      currency: 'GBP',
      deadline: '2026-08-25',
      niches: ['Beauty'],
      status: 'live',
      image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
    },
    {
      id: '00000000-0000-0000-0002-000000000003',
      brand_id: BRAND_ID,
      title: 'Quick Weeknight Dinners',
      description: 'We make small-batch pasta sauces. Show how fast a genuinely good dinner can come together. Real kitchens, real chaos, real taste reactions. 20-minute dinner, zero compromise on flavour.',
      deliverables: ['1 x cooking Reel under 60 seconds', '1 x static food photography post'],
      budget: 25000,
      currency: 'GBP',
      deadline: '2026-08-11',
      niches: ['Food'],
      status: 'live',
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    },
    {
      id: '00000000-0000-0000-0002-000000000004',
      brand_id: BRAND_ID,
      title: 'City Break Essentials Pack',
      description: 'A compact travel organiser for carry-on-only travellers. Show it working in real situations — airport security, hotel room unpacking, train journeys. Practical, slick, genuinely useful.',
      deliverables: ['1 x travel vlog-style Reel (90 seconds max)', '4 x Instagram Stories shot in-destination'],
      budget: 55000,
      currency: 'GBP',
      deadline: '2026-09-01',
      niches: ['Travel', 'Lifestyle'],
      status: 'live',
      image_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
    },
    {
      id: '00000000-0000-0000-0002-000000000005',
      brand_id: BRAND_ID,
      title: 'Level Up Your Battle Station',
      description: 'Premium desk pad and cable management for PC setups. Setup tour-style content integrating our product naturally. Gaming audiences are savvy — they respect authenticity over polish.',
      deliverables: ['1 x YouTube Short or TikTok (60 seconds)', '1 x before/after setup comparison post'],
      budget: 20000,
      currency: 'GBP',
      deadline: '2026-08-18',
      niches: ['Gaming'],
      status: 'live',
      image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    },
    {
      id: '00000000-0000-0000-0002-000000000006',
      brand_id: BRAND_ID,
      title: 'The Autumn Edit',
      description: 'Small British knitwear brand. Style our new collection ahead of the seasonal shift. Earthy tones, textured fabrics. We make things that last — show how you would genuinely wear it.',
      deliverables: ['2 x Instagram feed posts (styled outfits)', '1 x Reel showing styling process'],
      budget: 38000,
      currency: 'GBP',
      deadline: '2026-08-25',
      niches: ['Fashion'],
      status: 'live',
      image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    },
  ]

  const { error: insertErr } = await admin
    .from('briefs')
    .upsert(briefs, { onConflict: 'id' })

  if (insertErr) {
    return NextResponse.json({ error: `Insert briefs: ${insertErr.message}` }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    live_briefs_before: liveCount,
    seeded: briefs.length,
    message: 'Seed complete. Visit /swipe to see the briefs.',
  })
}
