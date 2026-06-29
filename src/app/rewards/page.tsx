import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TopNav } from '@/components/top-nav'
import { BottomNav } from '@/components/bottom-nav'
import { RewardsFeed } from './rewards-feed'
import type { Reward } from './rewards-feed'

export const dynamic = 'force-dynamic'

const TIER_ORDER: Record<string, number> = {
  rising: 0,
  verified: 1,
  elite: 2,
  ambassador: 3,
}

export default async function RewardsPage() {
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
    .select('tier')
    .eq('id', user.id)
    .single()

  if (!creatorProfile) redirect('/onboarding/creator')

  const creatorTierRank = TIER_ORDER[creatorProfile.tier ?? 'rising'] ?? 0

  const { data: allRewards } = await supabase
    .from('rewards')
    .select('id, partner_name, offer_description, discount_value, discount_code, minimum_tier, expires_at')
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gte.${new Date().toISOString().split('T')[0]}`)
    .order('created_at', { ascending: false })

  const rewards = (allRewards ?? []).filter(
    (r: Reward) => (TIER_ORDER[r.minimum_tier] ?? 0) <= creatorTierRank
  )

  const { data: redeemedRows } = await supabase
    .from('reward_redemptions')
    .select('reward_id')
    .eq('creator_id', user.id)

  const redeemedIds = new Set((redeemedRows ?? []).map((r: { reward_id: string }) => r.reward_id))

  const available = rewards.filter((r: Reward) => !redeemedIds.has(r.id))
  const redeemed = rewards
    .filter((r: Reward) => redeemedIds.has(r.id))
    .map((r: Reward) => ({ ...r, code: r.discount_code }))

  const displayName = profile.display_name || user.email || ''

  return (
    <main className="h-dvh bg-[#100F0C] flex flex-col overflow-hidden">
      <TopNav
        displayName={displayName}
        role="creator"
        tier={creatorProfile.tier ?? undefined}
      />
      <RewardsFeed available={available} redeemed={redeemed} />
      <BottomNav />
    </main>
  )
}
