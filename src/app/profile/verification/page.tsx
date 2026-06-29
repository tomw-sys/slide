import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TopNav } from '@/components/top-nav'
import { BottomNav } from '@/components/bottom-nav'
import { UploadForm } from './upload-form'

export const dynamic = 'force-dynamic'

const STATUS_INFO: Record<string, { label: string; classes: string; description: string }> = {
  pending: {
    label: 'Under review',
    classes: 'bg-[#f59e0b]/10 text-[#f59e0b]',
    description: 'Your samples are with our team. We aim to review within 3 working days.',
  },
  approved: {
    label: 'Verified',
    classes: 'bg-[#C6F23E]/10 text-[#C6F23E]',
    description: 'Your verified badge is live on your profile and creator cards.',
  },
  rejected: {
    label: 'Not approved',
    classes: 'bg-[#ef4444]/10 text-[#ef4444]',
    description: 'Check the feedback email and re-submit when ready.',
  },
}

export default async function VerificationPage() {
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

  if (!profile || profile.role !== 'creator') redirect('/dashboard')

  const { data: creatorProfile } = await supabase
    .from('creator_profiles')
    .select('verification_status, sample_video_urls, tier')
    .eq('id', user.id)
    .single()

  if (!creatorProfile) redirect('/onboarding/creator')

  const { verification_status, sample_video_urls } = creatorProfile
  const statusInfo = verification_status ? STATUS_INFO[verification_status] : null
  const displayName = profile.display_name || user.email || ''

  return (
    <main className="min-h-screen bg-[#100F0C] pb-28">
      <TopNav
        displayName={displayName}
        role="creator"
        tier={creatorProfile.tier ?? undefined}
      />

      <div className="max-w-2xl mx-auto px-6" style={{ paddingTop: 'max(calc(env(safe-area-inset-top) + 72px), 88px)', paddingBottom: 32 }}>
        <div className="mb-2">
          <Link
            href="/dashboard/creator"
            className="text-[#8a8575] text-sm hover:text-white transition-colors"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="mb-8 mt-4">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-white text-2xl font-bold">Creator verification</h1>
            {statusInfo && (
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium uppercase tracking-wider ${statusInfo.classes}`}>
                {statusInfo.label}
              </span>
            )}
          </div>
          <p className="text-[#8a8575] text-sm">
            {statusInfo
              ? statusInfo.description
              : 'Upload 2–3 sample UGC videos to get your verified badge. Verified creators unlock more briefs and appear higher in brand searches.'}
          </p>
        </div>

        {/* What we look for */}
        {verification_status !== 'approved' && (
          <div className="bg-[#17150F] border border-[#3a3730] rounded-xl p-5 mb-6">
            <p className="text-white text-sm font-semibold mb-3">What we look for</p>
            <ul className="space-y-2 text-sm text-[#8a8575]">
              <li className="flex gap-2">
                <span className="text-[#C6F23E] flex-shrink-0">·</span>
                Real UGC style — natural, unscripted, shot on your phone
              </li>
              <li className="flex gap-2">
                <span className="text-[#C6F23E] flex-shrink-0">·</span>
                Clear audio and stable framing (a tripod or leaning against something is fine)
              </li>
              <li className="flex gap-2">
                <span className="text-[#C6F23E] flex-shrink-0">·</span>
                At least one video featuring a product review or tutorial format
              </li>
              <li className="flex gap-2">
                <span className="text-[#C6F23E] flex-shrink-0">·</span>
                Your face on screen for at least part of one video
              </li>
            </ul>
          </div>
        )}

        <UploadForm
          userId={user.id}
          existingUrls={sample_video_urls ?? null}
          verificationStatus={verification_status ?? null}
        />
      </div>
      <BottomNav />
    </main>
  )
}
