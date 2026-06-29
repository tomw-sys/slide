'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendVerificationApproved, sendVerificationRejected } from '@/lib/email'

export async function saveVideoUrls(
  urls: string[]
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('creator_profiles')
    .update({
      sample_video_urls: urls,
      verification_status: 'pending',
    })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/profile/verification')
  revalidatePath('/admin/creators')
  return {}
}

export async function approveCreator(
  creatorId: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (adminProfile?.role !== 'admin') return { error: 'Unauthorised' }

  const { data: creator } = await supabase
    .from('creator_profiles')
    .select('tier')
    .eq('id', creatorId)
    .single()

  const { error } = await supabase
    .from('creator_profiles')
    .update({
      verification_status: 'approved',
      // Only upgrade tier if they are still on the default rising tier
      tier: creator?.tier === 'rising' ? 'verified' : creator?.tier,
    })
    .eq('id', creatorId)

  if (error) return { error: error.message }

  // Send approval email (non-blocking)
  const admin = createAdminClient()
  const { data: creatorAuth } = await admin.auth.admin.getUserById(creatorId)
  const { data: creatorProfile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', creatorId)
    .single()

  if (creatorAuth?.user?.email) {
    await sendVerificationApproved({
      to: creatorAuth.user.email,
      creatorName: creatorProfile?.display_name || 'Creator',
    })
  }

  revalidatePath('/admin/creators')
  revalidatePath('/dashboard/creator')
  return {}
}

export async function rejectCreator(
  creatorId: string,
  reason: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (adminProfile?.role !== 'admin') return { error: 'Unauthorised' }

  if (!reason.trim()) return { error: 'A rejection reason is required' }

  const { error } = await supabase
    .from('creator_profiles')
    .update({ verification_status: 'rejected' })
    .eq('id', creatorId)

  if (error) return { error: error.message }

  // Send rejection email (non-blocking)
  const admin = createAdminClient()
  const { data: creatorAuth } = await admin.auth.admin.getUserById(creatorId)
  const { data: creatorProfile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', creatorId)
    .single()

  if (creatorAuth?.user?.email) {
    await sendVerificationRejected({
      to: creatorAuth.user.email,
      creatorName: creatorProfile?.display_name || 'Creator',
      reason: reason.trim(),
    })
  }

  revalidatePath('/admin/creators')
  return {}
}
