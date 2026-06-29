import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TopNav } from '@/components/top-nav'
import { BottomNav } from '@/components/bottom-nav'
import { RewardCard } from './reward-card'

export const dynamic = 'force-dynamic'

const TIER_ORDER: Record<string, number> = {
  rising: 0,
  verified: 1,
  elite: 2,
  ambassador: 3,
}

type Reward = {
  id: string
  partner_name: string
  offer_description: string
  discount_value: string
  discount_code: string
  minimum_tier: string
  expires_at: string | null
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
  const redeemed = rewards.filter((r: Reward) => redeemedIds.has(r.id))

  const displayName = profile.display_name || user.email || ''

  return (
    <main className="min-h-screen bg-[#100F0C] pb-28">
      <TopNav
        displayName={displayName}
        role="creator"
        tier={creatorProfile.tier ?? undefined}
      />

      <div className="max-w-4xl mx-auto px-5" style={{ paddingTop: 'max(calc(env(safe-area-inset-top) + 72px), 88px)', paddingBottom: 32 }}>
        {/* Page header */}
        <div className="mb-8">
          <p className="text-[#C6F23E] text-xs uppercase tracking-widest font-semibold mb-2">Members only</p>
          <h1 className="text-white text-3xl font-black mb-1">Rewards wallet</h1>
          <p className="text-[#8a8575] text-sm">
            Exclusive drops from our brand partners. Yours just for being on Slide.
          </p>
        </div>

        {rewards.length === 0 ? (
          <div className="bg-[#17150F] border border-[#3a3730] rounded-2xl p-10 text-center">
            <p className="text-3xl mb-3">⭐</p>
            <p className="text-white font-semibold mb-1">No drops yet</p>
            <p className="text-[#8a8575] text-sm">New partner offers are added regularly. Check back soon.</p>
          </div>
        ) : (
          <>
            {available.length > 0 && (
              <section className="mb-10">
                {/* Drop category header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C6F23E] animate-pulse" />
                    <h2 className="text-white text-base font-black uppercase tracking-wide">
                      Live drops
                    </h2>
                  </div>
                  <div className="flex-1 h-px bg-[#3a3730]" />
                  <span className="text-[#8a8575] text-xs font-medium">
                    {available.length} available
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 stagger-children">
                  {available.map((reward: Reward, i: number) => (
                    <RewardCard key={reward.id} reward={reward} index={i} />
                  ))}
                </div>
              </section>
            )}

            {redeemed.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8a8575]" />
                    <h2 className="text-[#8a8575] text-base font-black uppercase tracking-wide">
                      Already revealed
                    </h2>
                  </div>
                  <div className="flex-1 h-px bg-[#3a3730]" />
                  <span className="text-[#8a8575] text-xs font-medium">
                    {redeemed.length} used
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 opacity-70">
                  {redeemed.map((reward: Reward, i: number) => (
                    <RewardCard key={reward.id} reward={reward} index={i} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </main>
  )
}
