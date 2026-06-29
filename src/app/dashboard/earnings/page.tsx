import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TopNav } from '@/components/top-nav'
import { BottomNav } from '@/components/bottom-nav'

export const dynamic = 'force-dynamic'

function fmt(pence: number) {
  return `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const DEAL_STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Pending',          color: '#8a8575', bg: 'rgba(58,55,48,0.6)' },
  funded:    { label: 'Awaiting content', color: '#8a8575', bg: 'rgba(58,55,48,0.6)' },
  delivered: { label: 'Under review',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  approved:  { label: 'Approved',         color: '#C6F23E', bg: 'rgba(198,242,62,0.10)' },
  disputed:  { label: 'Disputed',         color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
}

const PIPELINE = ['Content submitted', 'Brand review', 'Approved', 'Paid out']

type DealRow = {
  id: string
  agreed_fee: number | null
  status: string
  created_at: string
  approved_at: string | null
  brief_id: string
  briefs: { title: string | null } | null
  profiles: {
    display_name: string | null
    brand_profiles: { company_name: string | null } | { company_name: string | null }[] | null
  } | null
}

function getBrandName(deal: DealRow): string {
  const p = deal.profiles
  if (!p) return 'Brand'
  const bp = Array.isArray(p.brand_profiles) ? p.brand_profiles[0] : p.brand_profiles
  return bp?.company_name || p.display_name || 'Brand'
}

export default async function EarningsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url, role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'creator') redirect('/dashboard')

  const { data: cp } = await supabase
    .from('creator_profiles')
    .select('tier')
    .eq('id', user.id)
    .single()

  const tier = cp?.tier ?? 'rising'

  const { data: raw } = await supabase
    .from('deals')
    .select('id, agreed_fee, status, created_at, approved_at, brief_id, briefs(title), profiles!brand_id(display_name, brand_profiles(company_name))')
    .eq('creator_id', user.id)
    .not('status', 'eq', 'cancelled')
    .order('created_at', { ascending: false })

  const all = (raw as unknown as DealRow[]) ?? []

  const active = all.filter(d => d.status !== 'approved')
  const paid   = all.filter(d => d.status === 'approved')

  const pendingBalance   = all.filter(d => ['funded', 'delivered'].includes(d.status)).reduce((s, d) => s + (d.agreed_fee ?? 0), 0)
  const activeDealsValue = active.reduce((s, d) => s + (d.agreed_fee ?? 0), 0)
  const totalEarned      = paid.reduce((s, d) => s + (d.agreed_fee ?? 0), 0)

  // Determine pipeline highlight (0-indexed, matches PIPELINE array)
  let pipelineStage = 0
  if (all.some(d => d.status === 'delivered')) pipelineStage = 1
  if (all.some(d => d.status === 'approved') && active.length === 0) pipelineStage = 3
  else if (all.some(d => d.status === 'approved')) pipelineStage = 2

  const stripeConnected = false

  return (
    <main className="min-h-dvh bg-[#100F0C]" style={{ paddingBottom: 'max(calc(env(safe-area-inset-bottom) + 84px), 100px)' }}>
      <TopNav
        displayName={profile.display_name || user.email || ''}
        role="creator"
        tier={tier}
        avatarUrl={profile.avatar_url ?? undefined}
      />

      <div className="max-w-lg mx-auto px-5" style={{ paddingTop: 'max(calc(env(safe-area-inset-top) + 72px), 88px)' }}>

        {/* Page heading */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/dashboard/creator"
            className="w-9 h-9 rounded-full bg-[#17150F] border border-[#3a3730] flex items-center justify-center text-[#8a8575] hover:text-white transition-colors tap-scale flex-shrink-0"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Back"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className="text-white text-2xl font-black">Earnings</h1>
        </div>

        {/* ── Balance summary ── */}
        <div className="mb-6 animate-fade-up">
          <p className="text-[#C6F23E] text-[10px] font-bold uppercase tracking-widest mb-2">
            Pending payout
          </p>
          <p
            className="text-white font-black leading-none mb-5"
            style={{ fontSize: 'clamp(3.5rem, 14vw, 5.5rem)' }}
          >
            {fmt(pendingBalance)}
          </p>
          <div className="flex gap-3">
            <div className="bg-[#17150F] border border-[#3a3730] rounded-xl px-4 py-3 flex-1">
              <p className="text-[#5C584C] text-[10px] uppercase tracking-widest font-bold mb-1">Total earned to date</p>
              <p className="text-white text-base font-bold">{fmt(totalEarned)}</p>
            </div>
            <div className="bg-[#17150F] border border-[#3a3730] rounded-xl px-4 py-3 flex-1">
              <p className="text-[#5C584C] text-[10px] uppercase tracking-widest font-bold mb-1">Active deals value</p>
              <p className="text-white text-base font-bold">{fmt(activeDealsValue)}</p>
            </div>
          </div>
        </div>

        {/* ── Payout status card ── */}
        <div className="bg-[#17150F] border border-[#3a3730] rounded-2xl p-5 mb-6 animate-fade-up" style={{ animationDelay: '60ms' }}>
          <p className="text-white text-sm font-semibold mb-1">How payouts work</p>
          <p className="text-[#8a8575] text-sm leading-relaxed mb-6">
            Funds are held in escrow until your content is approved by the brand. Once approved, payment is released within 2 business days.
          </p>

          {/* Pipeline track */}
          <div className="flex items-start">
            {PIPELINE.map((stage, i) => {
              const done    = i <= pipelineStage
              const current = i === pipelineStage
              const last    = i === PIPELINE.length - 1
              return (
                <div key={stage} className="flex items-start flex-1 min-w-0">
                  <div className="flex flex-col items-center flex-shrink-0" style={{ width: 52 }}>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                      style={{
                        background: done ? '#C6F23E' : '#2a2720',
                        color: done ? '#100F0C' : '#5C584C',
                        border: current ? '2px solid #C6F23E' : '2px solid transparent',
                        boxShadow: current ? '0 0 0 3px rgba(198,242,62,0.2)' : undefined,
                      }}
                    >
                      {done && !current ? (
                        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <p
                      className="text-[9px] font-semibold text-center leading-tight mt-1.5"
                      style={{ color: done ? '#C6F23E' : '#5C584C' }}
                    >
                      {stage}
                    </p>
                  </div>
                  {!last && (
                    <div
                      className="flex-1 h-px mt-3.5"
                      style={{ background: i < pipelineStage ? '#C6F23E' : '#3a3730' }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Active deals (in escrow) ── */}
        <div className="mb-6 animate-fade-up" style={{ animationDelay: '120ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 flex-shrink-0" stroke="#8a8575" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2a4 4 0 0 0-4 4v2H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
              <circle cx="10" cy="13" r="1" fill="#8a8575" stroke="none" />
            </svg>
            <h2 className="text-[#8a8575] text-[10px] uppercase tracking-widest font-bold">In escrow</h2>
          </div>

          {active.length === 0 ? (
            <div className="bg-[#17150F] border border-[#3a3730] rounded-2xl p-8 text-center">
              <p className="text-[#5C584C] text-sm">No active escrow deals</p>
              <p className="text-[#3a3730] text-xs mt-1">Deals with funded escrow will appear here.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 stagger-children">
              {active.map((deal) => {
                const cfg = DEAL_STATUS_CFG[deal.status] ?? DEAL_STATUS_CFG.pending
                return (
                  <div key={deal.id} className="bg-[#17150F] border border-[#3a3730] rounded-2xl px-4 py-4 animate-fade-up">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-semibold truncate">{deal.briefs?.title || 'Untitled brief'}</p>
                        <p className="text-[#8a8575] text-xs mt-0.5">{getBrandName(deal)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        {deal.agreed_fee !== null && (
                          <p className="text-[#C6F23E] text-sm font-bold tabular-nums">{fmt(deal.agreed_fee)}</p>
                        )}
                        <span
                          className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                          style={{ color: cfg.color, background: cfg.bg }}
                        >
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Payment history ── */}
        <div className="mb-6 animate-fade-up" style={{ animationDelay: '180ms' }}>
          <h2 className="text-[#8a8575] text-[10px] uppercase tracking-widest font-bold mb-3">Paid out</h2>

          {paid.length === 0 ? (
            <div className="bg-[#17150F] border border-[#3a3730] rounded-2xl p-8 text-center">
              <p className="text-[#5C584C] text-sm">No payments yet</p>
              <p className="text-[#3a3730] text-xs mt-1">Completed deals will show here once payment is released.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 stagger-children">
              {paid.map((deal) => {
                const date = deal.approved_at ? fmtDate(deal.approved_at) : fmtDate(deal.created_at)
                return (
                  <div key={deal.id} className="bg-[#17150F] border border-[#3a3730] rounded-2xl px-4 py-4 animate-fade-up">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(198,242,62,0.08)', border: '1px solid rgba(198,242,62,0.2)' }}>
                        <svg viewBox="0 0 20 20" fill="#C6F23E" className="w-4 h-4">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-semibold truncate">{deal.briefs?.title || 'Untitled brief'}</p>
                        <p className="text-[#8a8575] text-xs mt-0.5">{getBrandName(deal)} · {date}</p>
                      </div>
                      {deal.agreed_fee !== null && (
                        <p className="text-white text-sm font-bold flex-shrink-0 tabular-nums">{fmt(deal.agreed_fee)}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Payout method ── */}
        <div className="animate-fade-up" style={{ animationDelay: '240ms' }}>
          <h2 className="text-[#8a8575] text-[10px] uppercase tracking-widest font-bold mb-3">Payout method</h2>

          {stripeConnected ? (
            <div className="bg-[#17150F] border border-[#3a3730] rounded-2xl px-4 py-4 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-semibold">Bank account</p>
                <p className="text-[#8a8575] text-xs mt-0.5">•••• •••• •••• 1234</p>
              </div>
              <Link
                href="/profile/stripe"
                className="text-[#C6F23E] text-sm font-semibold hover:underline"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                Manage
              </Link>
            </div>
          ) : (
            <div className="bg-[#17150F] border border-[#3a3730] rounded-2xl p-5">
              <p className="text-white text-sm font-semibold mb-1">No bank account connected</p>
              <p className="text-[#8a8575] text-sm leading-relaxed mb-4">
                Connect your bank account to receive payouts when your content is approved.
              </p>
              <Link
                href="/profile/stripe"
                className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl tap-scale"
                style={{ background: '#C6F23E', color: '#100F0C', WebkitTapHighlightColor: 'transparent' }}
              >
                Connect bank
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          )}
        </div>

      </div>
      <BottomNav />
    </main>
  )
}
