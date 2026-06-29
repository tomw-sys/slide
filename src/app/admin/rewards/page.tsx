import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Nav } from '@/components/nav'
import { RewardsManager } from './rewards-manager'

export const dynamic = 'force-dynamic'

export default async function AdminRewardsPage() {
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

  const { data: rewards } = await supabase
    .from('rewards')
    .select('id, partner_name, offer_description, discount_code, discount_value, minimum_tier, expires_at, is_active')
    .order('created_at', { ascending: false })

  const displayName = profile.display_name || user.email || ''

  return (
    <main className="min-h-screen bg-[#100F0C]">
      <Nav displayName={displayName} role="admin" />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-white text-2xl font-bold mb-1">Rewards</h1>
            <p className="text-[#8a8575] text-sm">Manage partner discount offers for creators.</p>
          </div>
          <Link
            href="/admin"
            className="text-sm text-[#8a8575] hover:text-white transition-colors"
          >
            Back to admin
          </Link>
        </div>

        <RewardsManager rewards={rewards ?? []} />
      </div>
    </main>
  )
}
