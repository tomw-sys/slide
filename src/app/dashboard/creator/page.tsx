import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TopNav } from '@/components/top-nav'
import { BottomNav } from '@/components/bottom-nav'

export const dynamic = 'force-dynamic'

function formatBudget(pence: number) {
  return `£${(pence / 100).toLocaleString('en-GB')}`
}

const APP_STATUS: Record<string, { label: string; dot: string }> = {
  pending:   { label: 'Under review', dot: 'bg-[#f59e0b]' },
  accepted:  { label: 'Accepted',     dot: 'bg-[#C6F23E]' },
  rejected:  { label: 'Not progressed', dot: 'bg-[#ef4444]' },
  withdrawn: { label: 'Withdrawn',    dot: 'bg-[#8a8575]' },
}

const TIER_COLOUR: Record<string, string> = {
  rising:     'text-[#8a8575]',
  verified:   'text-[#C6F23E]',
  elite:      'text-[#f59e0b]',
  ambassador: 'text-[#a855f7]',
}


export default async function CreatorDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/sign-in')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url, role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'creator') redirect('/dashboard')

  const { data: creatorProfile } = await supabase
    .from('creator_profiles')
    .select('tier, verification_status, niches, day_rate')
    .eq('id', user.id)
    .single()

  if (!creatorProfile) redirect('/onboarding/creator')

  const { data: applicationData, error: appError } = await supabase
    .from('applications')
    .select('id, status, proposed_rate, created_at, brief_id, briefs(title, budget, profiles!brand_id(display_name, brand_profiles(company_name)))')
    .eq('creator_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)
  if (appError) console.error('[dashboard] applications query error:', appError.message)

  type AppRow = {
    id: string
    status: string
    proposed_rate: number | null
    created_at: string
    brief_id: string
    briefs: {
      title: string | null
      budget: number | null
      profiles: {
        display_name: string | null
        brand_profiles: { company_name: string | null } | { company_name: string | null }[] | null
      } | {
        display_name: string | null
        brand_profiles: { company_name: string | null } | { company_name: string | null }[] | null
      }[] | null
    } | null
  }

  const applications = (applicationData as unknown as AppRow[]) ?? []

  const { count: dealsCount } = await supabase
    .from('deals')
    .select('id', { count: 'exact', head: true })
    .eq('creator_id', user.id)
    .not('status', 'in', '(cancelled)')

  const pendingCount = applications.filter((a) => a.status === 'pending').length
  const activeDeals = dealsCount ?? 0
  const tier = creatorProfile.tier || 'rising'
  const firstName = profile.display_name?.split(' ')[0] || 'creator'

  return (
    <main className="min-h-dvh bg-[#100F0C] pb-28">
      <TopNav
        displayName={profile.display_name || user.email || ''}
        role="creator"
        tier={tier}
        avatarUrl={profile.avatar_url ?? undefined}
      />

      {/* Page greeting — pushed below fixed header */}
      <div className="px-5 pb-5" style={{ paddingTop: 'max(calc(env(safe-area-inset-top) + 72px), 88px)' }}>
        <h1 className="text-white text-5xl font-extrabold leading-tight">
          Hey, {firstName}
        </h1>
        <p className={`text-sm font-semibold uppercase tracking-wider mt-1 ${TIER_COLOUR[tier]}`}>
          {tier}
          {creatorProfile.verification_status === 'pending' && (
            <span className="text-[#8a8575] normal-case tracking-normal font-normal ml-2">· verification pending</span>
          )}
        </p>
      </div>

      {/* Stats strip */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#17150F] border border-[#3a3730] rounded-2xl p-4 animate-fade-up" style={{ animationDelay: '0ms' }}>
            <p className="text-[#8a8575] text-[10px] uppercase tracking-wider mb-1">Applications</p>
            <p className="text-white text-3xl font-black">{applications.length}</p>
            {pendingCount > 0 && (
              <p className="text-[#f59e0b] text-[10px] mt-0.5">{pendingCount} pending</p>
            )}
          </div>
          <div className="bg-[#17150F] border border-[#3a3730] rounded-2xl p-4 animate-fade-up" style={{ animationDelay: '60ms' }}>
            <p className="text-[#8a8575] text-[10px] uppercase tracking-wider mb-1">Active deals</p>
            <p className="text-white text-3xl font-black">{activeDeals}</p>
          </div>
          <div className="bg-[#17150F] border border-[#3a3730] rounded-2xl p-4 animate-fade-up" style={{ animationDelay: '120ms' }}>
            <p className="text-[#8a8575] text-[10px] uppercase tracking-wider mb-1">Rewards</p>
            <p className="text-white text-3xl font-black">0</p>
          </div>
        </div>
      </div>

      {/* Get verified banner */}
      {!creatorProfile.verification_status && (
        <div className="px-5 mb-6 animate-fade-up">
          <Link href="/profile/verification" className="block">
            <div className="bg-[#C6F23E]/10 border border-[#C6F23E]/30 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#C6F23E] font-bold mb-0.5">Get verified</p>
                  <p className="text-[#8a8575] text-sm">Upload 2-3 sample videos to unlock more briefs</p>
                </div>
                <span className="text-[#C6F23E] text-2xl">→</span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Applications feed */}
      {applications.length > 0 && (
        <div className="px-5">
          <h2 className="text-[#8a8575] text-xs uppercase tracking-wider mb-3">Your applications</h2>
          <div className="flex flex-col gap-2.5 stagger-children">
            {applications.map((app) => {
              const brief = app.briefs
              const p = brief
                ? Array.isArray(brief.profiles) ? brief.profiles[0] : brief.profiles
                : null
              const bp = p
                ? Array.isArray(p.brand_profiles) ? p.brand_profiles[0] : p.brand_profiles
                : null
              const brandName = bp?.company_name || p?.display_name || 'Brand'
              const badge = APP_STATUS[app.status] ?? APP_STATUS.pending

              return (
                <Link
                  key={app.id}
                  href={`/briefs/${app.brief_id}`}
                  className="flex items-center gap-4 bg-[#17150F] border border-[#3a3730] rounded-2xl px-4 py-4 hover:border-[#4a4640] transition-colors tap-scale animate-fade-up"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${badge.dot}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-semibold truncate">
                      {brief?.title || 'Untitled brief'}
                    </p>
                    <p className="text-[#8a8575] text-xs mt-0.5">{brandName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {app.proposed_rate && (
                      <span className="text-[#C6F23E] text-sm font-bold">{formatBudget(app.proposed_rate)}</span>
                    )}
                    <span className="text-[#8a8575] text-[10px] uppercase tracking-wider">{badge.label}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {applications.length === 0 && (
        <div className="px-5">
          <div className="bg-[#17150F] border border-[#3a3730] rounded-2xl p-8 text-center animate-fade-up">
            <p className="text-4xl mb-3">🎬</p>
            <p className="text-white font-semibold mb-1">No applications yet</p>
            <p className="text-[#8a8575] text-sm mb-4">Swipe through live briefs and apply to get started.</p>
            <Link
              href="/swipe"
              className="inline-flex items-center gap-2 bg-[#C6F23E] text-[#100F0C] font-semibold rounded-xl px-5 py-2.5 text-sm hover:bg-[#ADDA38] transition-colors tap-scale"
            >
              Browse briefs
            </Link>
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  )
}
