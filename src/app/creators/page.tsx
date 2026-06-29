import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Nav } from '@/components/nav'
import { CreatorFilters } from './creator-filters'

export const dynamic = 'force-dynamic'

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`
  return String(n)
}

function formatBudget(pence: number) {
  return `£${(pence / 100).toLocaleString('en-GB')}`
}

const TIER_BADGE: Record<string, { label: string; classes: string }> = {
  rising:     { label: 'Rising',     classes: 'text-[#a3a3a3]' },
  verified:   { label: 'Verified',   classes: 'text-[#1ee231]' },
  elite:      { label: 'Elite',      classes: 'text-[#f59e0b]' },
  ambassador: { label: 'Ambassador', classes: 'text-[#a855f7]' },
}

type CreatorRow = {
  id: string
  niches: string[] | null
  tier: string | null
  verification_status: string | null
  follower_count_instagram: number | null
  follower_count_tiktok: number | null
  follower_count_youtube: number | null
  day_rate: number | null
  profiles:
    | { display_name: string | null; avatar_url: string | null; bio: string | null; location: string | null }
    | { display_name: string | null; avatar_url: string | null; bio: string | null; location: string | null }[]
    | null
}

export default async function CreatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ niche?: string; location?: string; minFollowers?: string; tier?: string }>
}) {
  const { niche, location, minFollowers, tier } = await searchParams

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
  if (!profile || profile.role !== 'brand') redirect('/dashboard')

  const { data: brandProfile } = await supabase
    .from('brand_profiles')
    .select('company_name')
    .eq('id', user.id)
    .single()

  const displayName = brandProfile?.company_name || profile.display_name || user.email || ''

  let query = supabase
    .from('creator_profiles')
    .select(
      'id, niches, tier, verification_status, follower_count_instagram, follower_count_tiktok, follower_count_youtube, day_rate, profiles(display_name, avatar_url, bio, location)'
    )
    .limit(100)

  if (niche) query = query.contains('niches', [niche])
  if (tier)  query = query.eq('tier', tier)

  const { data: creatorData } = await query
  let creators = (creatorData as unknown as CreatorRow[]) ?? []

  if (location) {
    const search = location.toLowerCase()
    creators = creators.filter((c) => {
      const p = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles
      return p?.location?.toLowerCase().includes(search)
    })
  }

  if (minFollowers) {
    const min = parseInt(minFollowers, 10)
    creators = creators.filter((c) => {
      const total =
        (c.follower_count_instagram ?? 0) +
        (c.follower_count_tiktok ?? 0) +
        (c.follower_count_youtube ?? 0)
      return total >= min
    })
  }

  return (
    <main className="min-h-screen bg-[#151515]">
      <Nav displayName={displayName} role="brand" />

      <div className="max-w-5xl mx-auto px-5 py-8">
        <div className="mb-6">
          <h1 className="text-white text-2xl font-black mb-1">Creator directory</h1>
          <p className="text-[#a3a3a3] text-sm">
            {creators.length} creator{creators.length !== 1 ? 's' : ''}
            {niche || location || minFollowers || tier ? ' matching your filters' : ''}
          </p>
        </div>

        <Suspense>
          <CreatorFilters
            niche={niche || ''}
            location={location || ''}
            minFollowers={minFollowers || ''}
            tier={tier || ''}
          />
        </Suspense>

        {creators.length === 0 ? (
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-10 text-center mt-6">
            <p className="text-white font-semibold mb-1">No creators found</p>
            <p className="text-[#a3a3a3] text-sm">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6 stagger-children">
            {creators.map((creator) => {
              const p = Array.isArray(creator.profiles) ? creator.profiles[0] : creator.profiles
              const tierBadge = TIER_BADGE[creator.tier || 'rising']
              const totalFollowers =
                (creator.follower_count_instagram ?? 0) +
                (creator.follower_count_tiktok ?? 0) +
                (creator.follower_count_youtube ?? 0)
              const initials = (p?.display_name || 'C')[0].toUpperCase()

              return (
                <div
                  key={creator.id}
                  className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-5 flex flex-col items-center text-center gap-3 animate-fade-up tap-scale"
                >
                  {/* Circular avatar — centred */}
                  <div className="relative">
                    {p?.avatar_url ? (
                      <img
                        src={p.avatar_url}
                        alt={p.display_name || 'Creator'}
                        className="w-20 h-20 rounded-full object-cover border-2 border-[#2a2a2a]"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-[#2a2a2a] flex items-center justify-center text-white text-2xl font-black border-2 border-[#333]">
                        {initials}
                      </div>
                    )}
                    {creator.verification_status === 'approved' && (
                      <span
                        title="Verified creator"
                        className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#1ee231] border-2 border-[#1c1c1c] flex items-center justify-center text-[#151515] text-[10px] font-black"
                      >
                        ✓
                      </span>
                    )}
                  </div>

                  {/* Name + tier */}
                  <div>
                    <p className="text-white font-bold text-sm truncate max-w-[140px]">
                      {p?.display_name || 'Creator'}
                    </p>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold ${tierBadge.classes}`}>
                      {tierBadge.label}
                    </span>
                  </div>

                  {/* Followers — prominent */}
                  {totalFollowers > 0 && (
                    <div>
                      <p className="text-white text-xl font-black">{formatFollowers(totalFollowers)}</p>
                      <p className="text-[#a3a3a3] text-[10px] uppercase tracking-wider">followers</p>
                    </div>
                  )}

                  {/* Location */}
                  {p?.location && (
                    <p className="text-[#a3a3a3] text-xs">{p.location}</p>
                  )}

                  {/* Niches */}
                  {creator.niches && creator.niches.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {creator.niches.slice(0, 2).map((n) => (
                        <span
                          key={n}
                          className="px-2 py-0.5 rounded-full text-[10px] bg-[#1ee231]/10 text-[#1ee231] border border-[#1ee231]/20"
                        >
                          {n}
                        </span>
                      ))}
                      {creator.niches.length > 2 && (
                        <span className="text-[#a3a3a3] text-[10px]">+{creator.niches.length - 2}</span>
                      )}
                    </div>
                  )}

                  {/* Day rate */}
                  {creator.day_rate && (
                    <p className="text-[#1ee231] text-sm font-bold">{formatBudget(creator.day_rate)}<span className="text-[#a3a3a3] font-normal text-xs">/day</span></p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
