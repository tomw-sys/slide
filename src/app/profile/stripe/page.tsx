import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TopNav } from '@/components/top-nav'
import { BottomNav } from '@/components/bottom-nav'

export const dynamic = 'force-dynamic'

export default async function StripePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url, role')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/sign-in')

  const { data: cp } = await supabase
    .from('creator_profiles')
    .select('tier')
    .eq('id', user.id)
    .single()

  return (
    <main className="min-h-dvh bg-[#100F0C]">
      <TopNav
        displayName={profile.display_name || user.email || ''}
        role={profile.role as 'creator' | 'brand' | 'admin'}
        tier={cp?.tier ?? undefined}
        avatarUrl={profile.avatar_url ?? undefined}
      />

      <div
        className="max-w-lg mx-auto px-5 flex flex-col items-center justify-center text-center"
        style={{
          minHeight: '100dvh',
          paddingTop: 'max(calc(env(safe-area-inset-top) + 72px), 88px)',
          paddingBottom: 'max(calc(env(safe-area-inset-bottom) + 84px), 100px)',
        }}
      >
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'rgba(198,242,62,0.08)', border: '1px solid rgba(198,242,62,0.2)' }}>
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="#C6F23E" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="14" rx="2" />
            <path d="M16 14a1 1 0 1 0 2 0 1 1 0 0 0-2 0" fill="#C6F23E" stroke="none" />
            <path d="M2 10h20" />
          </svg>
        </div>

        <p className="text-[#C6F23E] text-[10px] font-bold uppercase tracking-widest mb-3">Coming soon</p>
        <h1 className="text-white text-2xl font-black mb-3">Stripe payouts</h1>
        <p className="text-[#8a8575] text-sm leading-relaxed max-w-xs">
          Bank account connections via Stripe Connect are coming soon. Once live, you&apos;ll connect your account here to receive payouts directly.
        </p>

        <Link
          href="/dashboard/earnings"
          className="mt-8 inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl tap-scale"
          style={{ background: '#C6F23E', color: '#100F0C', WebkitTapHighlightColor: 'transparent' }}
        >
          Back to earnings
        </Link>
      </div>

      <BottomNav />
    </main>
  )
}
