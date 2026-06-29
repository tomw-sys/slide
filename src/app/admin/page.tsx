import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Nav } from '@/components/nav'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
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

  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const [{ count: creatorsCount }, { count: rewardsCount }, { count: pendingCount }] =
    await Promise.all([
      supabase
        .from('creator_profiles')
        .select('id', { count: 'exact', head: true }),
      supabase
        .from('rewards')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true),
      supabase
        .from('creator_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('verification_status', 'pending'),
    ])

  const displayName = profile.display_name || user.email || ''

  return (
    <main className="min-h-screen bg-[#151515]">
      <Nav displayName={displayName} role="admin" />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-white text-2xl font-bold mb-1">Admin</h1>
          <p className="text-[#a3a3a3] text-sm">Make Agency internal dashboard.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-5">
            <p className="text-[#a3a3a3] text-xs uppercase tracking-wider mb-1">Creators</p>
            <p className="text-white text-3xl font-bold">{creatorsCount ?? 0}</p>
          </div>
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-5">
            <p className="text-[#a3a3a3] text-xs uppercase tracking-wider mb-1">Pending verif.</p>
            <p className="text-white text-3xl font-bold">{pendingCount ?? 0}</p>
            {(pendingCount ?? 0) > 0 && (
              <p className="text-[#f59e0b] text-xs mt-1">Needs review</p>
            )}
          </div>
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-5">
            <p className="text-[#a3a3a3] text-xs uppercase tracking-wider mb-1">Active rewards</p>
            <p className="text-white text-3xl font-bold">{rewardsCount ?? 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/admin/creators"
            className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#3a3a3a] transition-colors"
          >
            <h2 className="text-white font-semibold mb-1">Creator verifications</h2>
            <p className="text-[#a3a3a3] text-sm">
              Review and approve or reject creator verification submissions.
            </p>
          </Link>
          <Link
            href="/admin/rewards"
            className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#3a3a3a] transition-colors"
          >
            <h2 className="text-white font-semibold mb-1">Rewards</h2>
            <p className="text-[#a3a3a3] text-sm">
              Add, edit, and deactivate partner discount offers for the creator wallet.
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}
