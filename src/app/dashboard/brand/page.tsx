import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'

export const dynamic = 'force-dynamic'

export default async function BrandDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'brand') {
    redirect('/dashboard')
  }

  const { data: brandProfile } = await supabase
    .from('brand_profiles')
    .select('company_name, industry, website, subscription_tier')
    .eq('id', user.id)
    .single()

  if (!brandProfile) {
    redirect('/onboarding/brand')
  }

  return (
    <main className="min-h-screen bg-[#151515]">
      {/* Nav */}
      <nav className="border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between">
        <span className="text-[#1ee231] text-xl font-bold tracking-tight">Slide</span>
        <div className="flex items-center gap-4">
          <span className="text-[#a3a3a3] text-sm">
            {brandProfile.company_name || profile.display_name || user.email}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="text-[#a3a3a3] text-sm hover:text-white transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-white text-2xl font-bold mb-1">
            {brandProfile.company_name || 'Your brand'}
          </h1>
          <p className="text-[#a3a3a3] text-sm">
            {brandProfile.industry || 'Brand dashboard'}
            {brandProfile.subscription_tier && (
              <span className="ml-2 text-[#1ee231] uppercase text-xs tracking-wider font-medium">
                {brandProfile.subscription_tier}
              </span>
            )}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Active briefs', value: '0' },
            { label: 'Applications', value: '0' },
            { label: 'Active deals', value: '0' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-5"
            >
              <p className="text-[#a3a3a3] text-xs uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-white text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Post a brief */}
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-1">Post a brief</h2>
            <p className="text-[#a3a3a3] text-sm mb-6">
              Describe the content you need, set a budget, and let creators come to you.
            </p>
            <Link
              href="/briefs/new"
              className="inline-flex items-center gap-2 bg-[#1ee231] text-[#151515] font-semibold rounded-xl px-4 py-2.5 text-sm hover:bg-[#17c029] transition-colors"
            >
              Create brief
            </Link>
          </div>

          {/* Find creators */}
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-1">Find creators</h2>
            <p className="text-[#a3a3a3] text-sm mb-6">
              Search and swipe through verified UGC creators. Filter by niche, location, and reach.
            </p>
            <Link
              href="/creators"
              className="inline-flex items-center gap-2 border border-[#2a2a2a] text-white font-medium rounded-xl px-4 py-2.5 text-sm hover:border-[#1ee231] hover:text-[#1ee231] transition-colors"
            >
              Browse creators
            </Link>
          </div>

          {/* Active briefs */}
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-1">Your briefs</h2>
            <p className="text-[#a3a3a3] text-sm mb-6">
              Manage your live and draft briefs and review incoming applications.
            </p>
            <Link
              href="/briefs"
              className="inline-flex items-center gap-2 border border-[#2a2a2a] text-white font-medium rounded-xl px-4 py-2.5 text-sm hover:border-[#1ee231] hover:text-[#1ee231] transition-colors"
            >
              View briefs
            </Link>
          </div>

          {/* Active deals */}
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-1">Active deals</h2>
            <p className="text-[#a3a3a3] text-sm mb-6">
              Track content delivery, manage escrow, and approve submitted work.
            </p>
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 border border-[#2a2a2a] text-white font-medium rounded-xl px-4 py-2.5 text-sm hover:border-[#1ee231] hover:text-[#1ee231] transition-colors"
            >
              View deals
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
