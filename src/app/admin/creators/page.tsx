import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Nav } from '@/components/nav'
import { VerificationActions } from './verification-actions'

export const dynamic = 'force-dynamic'

function formatFollowers(n: number | null) {
  if (!n) return null
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`
  return String(n)
}

const STATUS_PILL: Record<string, { label: string; classes: string }> = {
  pending: { label: 'Pending review', classes: 'bg-[#f59e0b]/10 text-[#f59e0b]' },
  approved: { label: 'Verified', classes: 'bg-[#C6F23E]/10 text-[#C6F23E]' },
  rejected: { label: 'Rejected', classes: 'bg-[#ef4444]/10 text-[#ef4444]' },
}

const TIER_COLOUR: Record<string, string> = {
  rising: 'text-[#8a8575]',
  verified: 'text-[#C6F23E]',
  elite: 'text-[#f59e0b]',
  ambassador: 'text-[#a855f7]',
}

type CreatorRow = {
  id: string
  niches: string[] | null
  tier: string | null
  verification_status: string | null
  follower_count_instagram: number | null
  follower_count_tiktok: number | null
  follower_count_youtube: number | null
  sample_video_urls: string[] | null
  profiles:
    | { display_name: string | null; avatar_url: string | null; location: string | null }
    | { display_name: string | null; avatar_url: string | null; location: string | null }[]
    | null
}

export default async function AdminCreatorsPage() {
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

  const { data: creatorData } = await supabase
    .from('creator_profiles')
    .select(
      'id, niches, tier, verification_status, follower_count_instagram, follower_count_tiktok, follower_count_youtube, sample_video_urls, profiles(display_name, avatar_url, location)'
    )
    .order('created_at', { ascending: false })

  const all = (creatorData as unknown as CreatorRow[]) ?? []

  const pending = all.filter((c) => c.verification_status === 'pending')
  const others = all.filter((c) => c.verification_status !== 'pending')

  const displayName = profile.display_name || user.email || ''

  return (
    <main className="min-h-screen bg-[#100F0C]">
      <Nav displayName={displayName} role="admin" />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-white text-2xl font-bold mb-1">Creator verifications</h1>
            <p className="text-[#8a8575] text-sm">
              {pending.length > 0
                ? `${pending.length} pending review`
                : 'No pending submissions'}
              {' · '}
              {all.length} total creator{all.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link href="/admin" className="text-sm text-[#8a8575] hover:text-white transition-colors">
            Back to admin
          </Link>
        </div>

        {/* Pending */}
        {pending.length > 0 && (
          <section className="mb-10">
            <h2 className="text-[#8a8575] text-xs uppercase tracking-wider mb-4">
              Awaiting review — {pending.length}
            </h2>
            <div className="flex flex-col gap-4">
              {pending.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} showActions />
              ))}
            </div>
          </section>
        )}

        {/* All others */}
        {others.length > 0 && (
          <section>
            <h2 className="text-[#8a8575] text-xs uppercase tracking-wider mb-4">
              All creators — {others.length}
            </h2>
            <div className="flex flex-col gap-4">
              {others.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} showActions={false} />
              ))}
            </div>
          </section>
        )}

        {all.length === 0 && (
          <div className="bg-[#17150F] border border-[#3a3730] rounded-xl p-10 text-center">
            <p className="text-white font-semibold mb-1">No creators yet</p>
            <p className="text-[#8a8575] text-sm">Creator accounts will appear here once they sign up.</p>
          </div>
        )}
      </div>
    </main>
  )
}

function CreatorCard({
  creator,
  showActions,
}: {
  creator: CreatorRow
  showActions: boolean
}) {
  const p = Array.isArray(creator.profiles) ? creator.profiles[0] : creator.profiles
  const status = creator.verification_status ?? 'pending'
  const pill = STATUS_PILL[status] ?? STATUS_PILL.pending
  const tierColour = TIER_COLOUR[creator.tier ?? 'rising'] ?? 'text-[#8a8575]'

  const igF = creator.follower_count_instagram
  const tkF = creator.follower_count_tiktok
  const ytF = creator.follower_count_youtube

  return (
    <div className="bg-[#17150F] border border-[#3a3730] rounded-xl p-5">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {p?.avatar_url ? (
            <img
              src={p.avatar_url}
              alt={p.display_name || 'Creator'}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#3a3730] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {(p?.display_name || 'C')[0].toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-white font-semibold truncate">{p?.display_name || 'Unnamed creator'}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-medium uppercase tracking-wider ${tierColour}`}>
                {creator.tier ?? 'rising'}
              </span>
              {p?.location && (
                <span className="text-[#8a8575] text-xs">{p.location}</span>
              )}
            </div>
          </div>
        </div>
        <span className={`flex-shrink-0 px-2.5 py-0.5 rounded-lg text-xs font-medium uppercase tracking-wider ${pill.classes}`}>
          {pill.label}
        </span>
      </div>

      {/* Niches */}
      {creator.niches && creator.niches.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {creator.niches.map((n) => (
            <span
              key={n}
              className="px-2 py-0.5 rounded-lg text-xs bg-[#C6F23E]/10 text-[#C6F23E] border border-[#C6F23E]/20"
            >
              {n}
            </span>
          ))}
        </div>
      )}

      {/* Follower counts */}
      {(igF || tkF || ytF) && (
        <div className="flex items-center gap-5 mb-4">
          {igF ? (
            <div>
              <p className="text-[#8a8575] text-xs">Instagram</p>
              <p className="text-white text-sm font-medium">{formatFollowers(igF)}</p>
            </div>
          ) : null}
          {tkF ? (
            <div>
              <p className="text-[#8a8575] text-xs">TikTok</p>
              <p className="text-white text-sm font-medium">{formatFollowers(tkF)}</p>
            </div>
          ) : null}
          {ytF ? (
            <div>
              <p className="text-[#8a8575] text-xs">YouTube</p>
              <p className="text-white text-sm font-medium">{formatFollowers(ytF)}</p>
            </div>
          ) : null}
        </div>
      )}

      {/* Sample videos */}
      {creator.sample_video_urls && creator.sample_video_urls.length > 0 && (
        <div className="mb-4">
          <p className="text-[#8a8575] text-xs uppercase tracking-wider mb-2">Sample videos</p>
          <div className="flex flex-wrap gap-2">
            {creator.sample_video_urls.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#C6F23E] border border-[#C6F23E]/30 rounded-lg px-3 py-1.5 hover:bg-[#C6F23E]/10 transition-colors"
              >
                Video {i + 1} →
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && <VerificationActions creatorId={creator.id} />}
    </div>
  )
}
