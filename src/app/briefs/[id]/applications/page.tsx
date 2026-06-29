import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Nav } from '@/components/nav'
import { ApplicationActions } from './application-actions'

export const dynamic = 'force-dynamic'

function formatBudget(pence: number) {
  return `£${(pence / 100).toLocaleString('en-GB')}`
}

type Application = {
  id: string
  pitch: string | null
  proposed_rate: number | null
  status: string
  created_at: string
  creator_id: string
  profiles: { display_name: string | null } | null
  creator_profiles: {
    niches: string[] | null
    tier: string | null
    day_rate: number | null
    verification_status: string | null
  } | null
}

export default async function ApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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

  const { data: brief } = await supabase
    .from('briefs')
    .select('id, title, status, brand_id, budget')
    .eq('id', id)
    .single()

  if (!brief || brief.brand_id !== user.id) redirect('/briefs')

  const { data: brandProfile } = await supabase
    .from('brand_profiles')
    .select('company_name')
    .eq('id', user.id)
    .single()

  const displayName = brandProfile?.company_name || profile.display_name || user.email || ''

  const { data: appData } = await supabase
    .from('applications')
    .select(
      'id, pitch, proposed_rate, status, created_at, creator_id, profiles(display_name), creator_profiles(niches, tier, day_rate, verification_status)'
    )
    .eq('brief_id', id)
    .order('created_at', { ascending: false })

  const applications = (appData as unknown as Application[]) ?? []
  const pending = applications.filter((a) => a.status === 'pending')
  const reviewed = applications.filter((a) => a.status !== 'pending')

  const REVIEWED_LABELS: Record<string, { label: string; classes: string }> = {
    accepted: { label: 'Accepted', classes: 'bg-[#C6F23E]/10 text-[#C6F23E]' },
    rejected: { label: 'Not progressed', classes: 'bg-[#ef4444]/10 text-[#ef4444]' },
    withdrawn: { label: 'Withdrawn', classes: 'bg-[#3a3730] text-[#8a8575]' },
  }

  return (
    <main className="min-h-screen bg-[#100F0C]">
      <Nav displayName={displayName} role="brand" />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#8a8575] mb-6 flex-wrap">
          <Link href="/briefs" className="hover:text-white transition-colors">
            Your briefs
          </Link>
          <span>/</span>
          <Link href={`/briefs/${id}`} className="hover:text-white transition-colors truncate max-w-[200px]">
            {brief.title}
          </Link>
          <span>/</span>
          <span className="text-white">Applications</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-white text-xl font-bold">{brief.title}</h1>
            <p className="text-[#8a8575] text-sm mt-1">
              {applications.length} application{applications.length !== 1 ? 's' : ''}
              {pending.length > 0 && (
                <span className="ml-2 text-[#C6F23E]">{pending.length} awaiting review</span>
              )}
            </p>
          </div>
          <Link
            href={`/briefs/${id}`}
            className="text-[#8a8575] text-sm hover:text-white transition-colors flex-shrink-0"
          >
            View brief
          </Link>
        </div>

        {/* Empty state */}
        {applications.length === 0 && (
          <div className="bg-[#17150F] border border-[#3a3730] rounded-xl p-10 text-center">
            <p className="text-white font-medium mb-2">No applications yet</p>
            <p className="text-[#8a8575] text-sm">
              {brief.status === 'draft'
                ? 'Publish your brief so creators can discover and apply.'
                : 'Creators will see this brief in their swipe feed.'}
            </p>
            {brief.status === 'draft' && (
              <Link
                href={`/briefs/${id}`}
                className="inline-flex mt-4 items-center gap-2 bg-[#C6F23E] text-[#100F0C] font-semibold rounded-xl px-4 py-2.5 text-sm hover:bg-[#ADDA38] transition-colors"
              >
                Go to brief
              </Link>
            )}
          </div>
        )}

        {/* Pending applications */}
        {pending.length > 0 && (
          <div className="mb-8">
            <p className="text-[#8a8575] text-xs uppercase tracking-wider font-medium mb-4">
              Awaiting review ({pending.length})
            </p>
            <div className="space-y-4">
              {pending.map((app) => {
                const p = app.profiles
                const cp = app.creator_profiles
                return (
                  <div
                    key={app.id}
                    className="bg-[#17150F] border border-[#3a3730] rounded-xl p-5"
                  >
                    {/* Creator header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 rounded-full bg-[#3a3730] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {(p?.display_name || 'C')[0].toUpperCase()}
                          </div>
                          <p className="text-white font-semibold">
                            {p?.display_name || 'Creator'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 pl-10">
                          {cp?.tier && (
                            <span className="text-[#8a8575] text-xs uppercase tracking-wider">
                              {cp.tier}
                            </span>
                          )}
                          {cp?.verification_status === 'approved' && (
                            <span className="text-[#C6F23E] text-xs">Verified</span>
                          )}
                          {cp?.niches && cp.niches.length > 0 && (
                            <span className="text-[#8a8575] text-xs">
                              {cp.niches.slice(0, 3).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {app.proposed_rate && (
                          <p className="text-[#C6F23E] font-semibold">
                            {formatBudget(app.proposed_rate)}
                          </p>
                        )}
                        {cp?.day_rate && (
                          <p className="text-[#8a8575] text-xs mt-0.5">
                            Day rate: {formatBudget(cp.day_rate)}
                          </p>
                        )}
                        {brief.budget && app.proposed_rate && (
                          <p className="text-[#8a8575] text-xs mt-0.5">
                            Budget: {formatBudget(brief.budget)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Pitch */}
                    {app.pitch && (
                      <p className="text-[#F4EFE3] text-sm leading-relaxed whitespace-pre-wrap mb-5 pl-0">
                        {app.pitch}
                      </p>
                    )}

                    <ApplicationActions applicationId={app.id} currentStatus={app.status} />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Reviewed applications */}
        {reviewed.length > 0 && (
          <div>
            <p className="text-[#8a8575] text-xs uppercase tracking-wider font-medium mb-4">
              Reviewed ({reviewed.length})
            </p>
            <div className="space-y-3">
              {reviewed.map((app) => {
                const p = app.profiles
                const cp = app.creator_profiles
                const badge = REVIEWED_LABELS[app.status]
                return (
                  <div
                    key={app.id}
                    className="bg-[#17150F] border border-[#3a3730] rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#3a3730] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {(p?.display_name || 'C')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {p?.display_name || 'Creator'}
                          </p>
                          {cp?.niches && cp.niches.length > 0 && (
                            <p className="text-[#8a8575] text-xs mt-0.5">
                              {cp.niches.slice(0, 2).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {app.proposed_rate && (
                          <span className="text-[#8a8575] text-sm">
                            {formatBudget(app.proposed_rate)}
                          </span>
                        )}
                        {badge && (
                          <span
                            className={`px-2.5 py-0.5 rounded-lg text-xs font-medium uppercase tracking-wider ${badge.classes}`}
                          >
                            {badge.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
