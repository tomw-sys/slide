import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TopNav } from '@/components/top-nav'
import { BottomNav } from '@/components/bottom-nav'
import { SwipeFeed } from '@/components/swipe-feed'

export const dynamic = 'force-dynamic'

export default async function SwipePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'creator') redirect('/dashboard')

  const { data: creatorProfile } = await supabase
    .from('creator_profiles')
    .select('niches, tier')
    .eq('id', user.id)
    .single()

  if (!creatorProfile) redirect('/onboarding/creator')

  const { data: swipedRows } = await supabase
    .from('swipes')
    .select('target_id')
    .eq('swiper_id', user.id)
    .eq('target_type', 'brief')

  const swipedIds = (swipedRows ?? []).map((r) => r.target_id)

  let query = supabase
    .from('briefs')
    .select('id, title, description, budget, deadline, niches, image_url, profiles!brand_id(display_name, brand_profiles(company_name))')
    .eq('status', 'live')
    .order('created_at', { ascending: false })
    .limit(50)

  if (swipedIds.length > 0) {
    query = query.not('id', 'in', `(${swipedIds.join(',')})`)
  }

  const { data: briefRows, error: briefsError } = await query

  if (briefsError) {
    console.error('[swipe] briefs query error:', briefsError.message)
  }

  type ProfileJoin = {
    display_name: string | null
    brand_profiles: { company_name: string | null } | null
  }

  const briefs = (briefRows ?? []).map((b) => {
    const p = b.profiles as unknown as ProfileJoin | null
    const brandName = p?.brand_profiles?.company_name || p?.display_name || 'Brand'
    return {
      id: b.id,
      title: b.title,
      description: b.description,
      budget: b.budget,
      deadline: b.deadline,
      niches: b.niches,
      image_url: (b as Record<string, unknown>).image_url as string | null ?? null,
      brand_name: brandName,
    }
  })

  const displayName = profile.display_name || user.email || ''

  return (
    <main className="h-dvh bg-[#100F0C] flex flex-col overflow-hidden">
      <TopNav
        displayName={displayName}
        role="creator"
        tier={creatorProfile.tier ?? undefined}
      />
      <SwipeFeed briefs={briefs} />
      <BottomNav />
    </main>
  )
}
