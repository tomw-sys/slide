import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TopNav } from '@/components/top-nav'
import { BottomNav } from '@/components/bottom-nav'
import { BriefStatusControls } from './status-controls'

export const dynamic = 'force-dynamic'

const STATUS_BADGE: Record<string, { label: string; classes: string }> = {
  draft: { label: 'Draft', classes: 'bg-[#2a2a2a] text-[#a3a3a3]' },
  live: { label: 'Live', classes: 'bg-[#1ee231]/10 text-[#1ee231]' },
  closed: { label: 'Closed', classes: 'bg-[#f59e0b]/10 text-[#f59e0b]' },
  completed: { label: 'Completed', classes: 'bg-[#3b82f6]/10 text-[#3b82f6]' },
}

function formatBudget(pence: number) {
  return `£${(pence / 100).toLocaleString('en-GB')}`
}

function formatDeadline(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return 'Overdue'
  if (diff === 0) return 'Due today'
  if (diff === 1) return '1 day left'
  return `${diff} days left`
}

export default async function BriefsPage() {
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

  const { data: briefs } = await supabase
    .from('briefs')
    .select('id, title, status, budget, deadline, niches, created_at')
    .eq('brand_id', user.id)
    .order('created_at', { ascending: false })

  // Get application counts per brief
  const briefIds = (briefs ?? []).map((b) => b.id)
  const { data: appCounts } = briefIds.length
    ? await supabase
        .from('applications')
        .select('brief_id')
        .in('brief_id', briefIds)
    : { data: [] }

  const countMap: Record<string, number> = {}
  for (const app of appCounts ?? []) {
    countMap[app.brief_id] = (countMap[app.brief_id] ?? 0) + 1
  }

  const displayName = brandProfile?.company_name || profile.display_name || user.email || ''

  return (
    <main className="min-h-screen bg-[#151515] pb-28">
      <TopNav displayName={displayName} role="brand" />
      <BottomNav />

      <div className="max-w-4xl mx-auto px-6" style={{ paddingTop: 'max(calc(env(safe-area-inset-top) + 72px), 88px)', paddingBottom: 32 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-2xl font-bold">Your briefs</h1>
            <p className="text-[#a3a3a3] text-sm mt-1">
              {briefs?.length ?? 0} brief{briefs?.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/briefs/new"
            className="bg-[#1ee231] text-[#151515] font-semibold rounded-xl px-4 py-2.5 text-sm hover:bg-[#17c029] transition-colors"
          >
            + New brief
          </Link>
        </div>

        {!briefs || briefs.length === 0 ? (
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-12 text-center">
            <p className="text-white font-semibold mb-2">No briefs yet</p>
            <p className="text-[#a3a3a3] text-sm mb-6">
              Create your first brief and start finding creators.
            </p>
            <Link
              href="/briefs/new"
              className="inline-flex bg-[#1ee231] text-[#151515] font-semibold rounded-xl px-4 py-2.5 text-sm hover:bg-[#17c029] transition-colors"
            >
              Create a brief
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {briefs.map((brief) => {
              const badge = STATUS_BADGE[brief.status] ?? STATUS_BADGE.draft
              const appCount = countMap[brief.id] ?? 0
              return (
                <div
                  key={brief.id}
                  className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-5 hover:border-[#3a3a3a] transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-medium uppercase tracking-wider ${badge.classes}`}
                        >
                          {badge.label}
                        </span>
                        {appCount > 0 && (
                          <span className="text-[#a3a3a3] text-xs">
                            {appCount} application{appCount !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <Link href={`/briefs/${brief.id}`}>
                        <h2 className="text-white font-semibold hover:text-[#1ee231] transition-colors truncate">
                          {brief.title}
                        </h2>
                      </Link>
                      <div className="flex items-center gap-4 mt-2">
                        {brief.budget && (
                          <span className="text-[#1ee231] text-sm font-medium">
                            {formatBudget(brief.budget)}
                          </span>
                        )}
                        {brief.deadline && (
                          <span className="text-[#a3a3a3] text-sm">
                            {formatDeadline(brief.deadline)}
                          </span>
                        )}
                        {brief.niches && brief.niches.length > 0 && (
                          <span className="text-[#a3a3a3] text-sm">
                            {brief.niches.slice(0, 2).join(', ')}
                            {brief.niches.length > 2 && ` +${brief.niches.length - 2}`}
                          </span>
                        )}
                      </div>
                    </div>
                    <BriefStatusControls briefId={brief.id} currentStatus={brief.status} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
