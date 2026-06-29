import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TopNav } from '@/components/top-nav'
import { BottomNav } from '@/components/bottom-nav'
import { BriefStatusControls } from '../status-controls'
import { ApplicationForm } from './application-form'

export const dynamic = 'force-dynamic'

const STATUS_BADGE: Record<string, { label: string; classes: string }> = {
  draft: { label: 'Draft', classes: 'bg-[#3a3730] text-[#8a8575]' },
  live: { label: 'Live', classes: 'bg-[#C6F23E]/10 text-[#C6F23E]' },
  closed: { label: 'Closed', classes: 'bg-[#f59e0b]/10 text-[#f59e0b]' },
  completed: { label: 'Completed', classes: 'bg-[#3b82f6]/10 text-[#3b82f6]' },
}

const APP_STATUS: Record<string, { label: string; classes: string }> = {
  pending: { label: 'Under review', classes: 'bg-[#f59e0b]/10 text-[#f59e0b]' },
  accepted: { label: 'Accepted', classes: 'bg-[#C6F23E]/10 text-[#C6F23E]' },
  rejected: { label: 'Not progressed', classes: 'bg-[#ef4444]/10 text-[#ef4444]' },
  withdrawn: { label: 'Withdrawn', classes: 'bg-[#3a3730] text-[#8a8575]' },
}

function formatBudget(pence: number) {
  return `£${(pence / 100).toLocaleString('en-GB')}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function daysLeft(dateStr: string) {
  const diff = Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
  if (diff < 0) return 'Overdue'
  if (diff === 0) return 'Due today'
  return `${diff} day${diff !== 1 ? 's' : ''} left`
}

export default async function BriefDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ applied?: string }>
}) {
  const { id } = await params
  const { applied } = await searchParams

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
  if (!profile) redirect('/dashboard')

  const { data: brief } = await supabase
    .from('briefs')
    .select('*, profiles!brand_id(display_name, brand_profiles(company_name))')
    .eq('id', id)
    .single()

  if (!brief) redirect('/briefs')

  const isBrand = profile.role === 'brand'
  const isOwner = isBrand && brief.brand_id === user.id
  const isCreator = profile.role === 'creator'

  // Non-owner brands can't see draft briefs
  if (!isOwner && brief.status === 'draft') redirect('/swipe')

  let displayName = profile.display_name || user.email || ''
  if (isBrand) {
    const { data: bp } = await supabase
      .from('brand_profiles')
      .select('company_name')
      .eq('id', user.id)
      .single()
    displayName = bp?.company_name || displayName
  }

  // For brand owner: fetch applications
  let applications: Array<{
    id: string
    pitch: string | null
    proposed_rate: number | null
    status: string
    created_at: string
    creator_id: string
    profiles: {
      display_name: string | null
      creator_profiles: { niches: string[] | null; tier: string | null } | null
    } | null
  }> = []

  if (isOwner) {
    const { data } = await supabase
      .from('applications')
      .select('id, pitch, proposed_rate, status, created_at, creator_id, profiles!creator_id(display_name, creator_profiles(niches, tier))')
      .eq('brief_id', id)
      .order('created_at', { ascending: false })
    applications = (data as unknown as typeof applications) ?? []
  }

  // For creator: check if they have an existing application
  let existingApplication: {
    status: string
    pitch: string | null
    proposed_rate: number | null
  } | null = null

  if (isCreator) {
    const { data } = await supabase
      .from('applications')
      .select('status, pitch, proposed_rate')
      .eq('brief_id', id)
      .eq('creator_id', user.id)
      .single()
    existingApplication = data
  }

  type BriefProfile = { display_name: string | null; brand_profiles: { company_name: string | null } | { company_name: string | null }[] | null }
  const p = brief.profiles as unknown as BriefProfile | BriefProfile[] | null
  const pObj = Array.isArray(p) ? p[0] : p
  const bpObj = pObj ? (Array.isArray(pObj.brand_profiles) ? pObj.brand_profiles[0] : pObj.brand_profiles) : null
  const brandName = bpObj?.company_name || pObj?.display_name || 'Brand'

  const badge = STATUS_BADGE[brief.status] ?? STATUS_BADGE.draft

  return (
    <main className="min-h-screen bg-[#100F0C] pb-28">
      <TopNav displayName={displayName} role={profile.role as 'creator' | 'brand'} />
      <BottomNav />

      <div className="max-w-3xl mx-auto px-6" style={{ paddingTop: 'max(calc(env(safe-area-inset-top) + 72px), 88px)', paddingBottom: 32 }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#8a8575] mb-6">
          <Link href={isOwner ? '/briefs' : '/swipe'} className="hover:text-white transition-colors">
            {isOwner ? 'Your briefs' : 'Swipe feed'}
          </Link>
          <span>/</span>
          <span className="text-white truncate">{brief.title}</span>
        </div>

        {/* Applied banner */}
        {applied === 'true' && (
          <div className="bg-[#C6F23E]/10 border border-[#C6F23E]/20 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
            <span className="text-[#C6F23E] text-lg">✓</span>
            <p className="text-[#C6F23E] text-sm font-medium">
              Application submitted. The brand will be in touch if it is a match.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="bg-[#17150F] border border-[#3a3730] rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-medium uppercase tracking-wider ${badge.classes}`}
                >
                  {badge.label}
                </span>
                <span className="text-[#8a8575] text-sm">{brandName}</span>
              </div>
              <h1 className="text-white text-xl font-bold">{brief.title}</h1>
            </div>
            {isOwner && (
              <BriefStatusControls briefId={brief.id} currentStatus={brief.status} />
            )}
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-3 gap-4 py-4 border-t border-[#3a3730]">
            <div>
              <p className="text-[#8a8575] text-xs uppercase tracking-wider mb-1">Budget</p>
              <p className="text-[#C6F23E] text-lg font-bold">
                {brief.budget ? formatBudget(brief.budget) : '—'}
              </p>
            </div>
            <div>
              <p className="text-[#8a8575] text-xs uppercase tracking-wider mb-1">Deadline</p>
              <p className="text-white font-medium">
                {brief.deadline ? formatDate(brief.deadline) : '—'}
              </p>
              {brief.deadline && (
                <p className="text-[#8a8575] text-xs mt-0.5">{daysLeft(brief.deadline)}</p>
              )}
            </div>
            <div>
              <p className="text-[#8a8575] text-xs uppercase tracking-wider mb-1">Niches</p>
              <div className="flex flex-wrap gap-1">
                {(brief.niches ?? []).slice(0, 3).map((n: string) => (
                  <span
                    key={n}
                    className="text-xs px-2 py-0.5 rounded-lg bg-[#100F0C] border border-[#3a3730] text-[#F4EFE3]"
                  >
                    {n}
                  </span>
                ))}
                {(brief.niches ?? []).length > 3 && (
                  <span className="text-[#8a8575] text-xs">
                    +{(brief.niches ?? []).length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#17150F] border border-[#3a3730] rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-3">Brief</h2>
          <p className="text-[#F4EFE3] text-sm leading-relaxed whitespace-pre-wrap">
            {brief.description}
          </p>
        </div>

        {/* Deliverables */}
        {brief.deliverables && brief.deliverables.length > 0 && (
          <div className="bg-[#17150F] border border-[#3a3730] rounded-xl p-6 mb-6">
            <h2 className="text-white font-semibold mb-3">Deliverables</h2>
            <ul className="space-y-2">
              {brief.deliverables.map((d: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#F4EFE3]">
                  <span className="text-[#C6F23E] mt-0.5 flex-shrink-0">✓</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Creator: application section */}
        {isCreator && brief.status === 'live' && (
          <div className="bg-[#17150F] border border-[#3a3730] rounded-xl p-6 mb-6">
            {existingApplication ? (
              <div>
                <h2 className="text-white font-semibold mb-2">Your application</h2>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-medium uppercase tracking-wider ${APP_STATUS[existingApplication.status]?.classes ?? ''}`}
                  >
                    {APP_STATUS[existingApplication.status]?.label ?? existingApplication.status}
                  </span>
                  {existingApplication.proposed_rate && (
                    <span className="text-[#8a8575] text-sm">
                      Proposed rate: {formatBudget(existingApplication.proposed_rate)}
                    </span>
                  )}
                </div>
                {existingApplication.pitch && (
                  <p className="text-[#F4EFE3] text-sm leading-relaxed whitespace-pre-wrap">
                    {existingApplication.pitch}
                  </p>
                )}
              </div>
            ) : (
              <ApplicationForm briefId={brief.id} briefBudget={brief.budget} />
            )}
          </div>
        )}

        {/* Brand owner: applications list */}
        {isOwner && (
          <div className="bg-[#17150F] border border-[#3a3730] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Applications</h2>
              <div className="flex items-center gap-3">
                <span className="text-[#8a8575] text-sm">{applications.length}</span>
                {applications.length > 0 && (
                  <Link
                    href={`/briefs/${brief.id}/applications`}
                    className="text-[#C6F23E] text-sm hover:underline"
                  >
                    Review all
                  </Link>
                )}
              </div>
            </div>

            {applications.length === 0 ? (
              <p className="text-[#8a8575] text-sm">
                {brief.status === 'draft'
                  ? 'Publish your brief for creators to discover and apply.'
                  : 'No applications yet. Creators will see this brief in their swipe feed.'}
              </p>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => {
                  const appBadge = APP_STATUS[app.status] ?? APP_STATUS.pending
                  return (
                    <div
                      key={app.id}
                      className="border border-[#3a3730] rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="text-white font-medium text-sm">
                            {app.profiles?.display_name || 'Creator'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {app.profiles?.creator_profiles?.tier && (
                              <span className="text-xs text-[#8a8575] uppercase tracking-wider">
                                {app.profiles.creator_profiles.tier}
                              </span>
                            )}
                            {app.profiles?.creator_profiles?.niches && (
                              <span className="text-xs text-[#8a8575]">
                                {app.profiles.creator_profiles.niches.slice(0, 2).join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-medium uppercase tracking-wider ${appBadge.classes}`}
                          >
                            {appBadge.label}
                          </span>
                          {app.proposed_rate && (
                            <p className="text-[#C6F23E] text-sm font-medium mt-1">
                              {formatBudget(app.proposed_rate)}
                            </p>
                          )}
                        </div>
                      </div>
                      {app.pitch && (
                        <p className="text-[#F4EFE3] text-sm leading-relaxed whitespace-pre-wrap line-clamp-3">
                          {app.pitch}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
