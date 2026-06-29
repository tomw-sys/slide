'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendApplicationAccepted, sendApplicationRejected } from '@/lib/email'

export async function acceptApplication(applicationId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: app } = await supabase
    .from('applications')
    .select('id, brief_id, creator_id, proposed_rate')
    .eq('id', applicationId)
    .single()

  if (!app) return { error: 'Application not found' }

  const { data: brief } = await supabase
    .from('briefs')
    .select('id, title, brand_id')
    .eq('id', app.brief_id)
    .single()

  if (!brief || brief.brand_id !== user.id) return { error: 'Unauthorised' }

  const { error: acceptError } = await supabase
    .from('applications')
    .update({ status: 'accepted' })
    .eq('id', applicationId)

  if (acceptError) return { error: acceptError.message }

  const { error: dealError } = await supabase.from('deals').insert({
    brief_id: app.brief_id,
    creator_id: app.creator_id,
    brand_id: user.id,
    agreed_fee: app.proposed_rate,
    status: 'pending',
  })

  if (dealError) return { error: dealError.message }

  // Reject all other pending applications for this brief
  await supabase
    .from('applications')
    .update({ status: 'rejected' })
    .eq('brief_id', app.brief_id)
    .eq('status', 'pending')
    .neq('id', applicationId)

  // Notify the creator
  const admin = createAdminClient()
  const { data: creatorAuth } = await admin.auth.admin.getUserById(app.creator_id)
  const creatorEmail = creatorAuth?.user?.email

  const { data: creatorProfile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', app.creator_id)
    .single()

  const { data: brandProfile } = await supabase
    .from('brand_profiles')
    .select('company_name')
    .eq('id', user.id)
    .single()

  if (creatorEmail) {
    await sendApplicationAccepted({
      to: creatorEmail,
      creatorName: creatorProfile?.display_name || 'Creator',
      briefTitle: brief.title || 'Untitled brief',
      brandName: brandProfile?.company_name || 'A brand',
      briefId: app.brief_id,
    })
  }

  revalidatePath(`/briefs/${app.brief_id}`)
  revalidatePath(`/briefs/${app.brief_id}/applications`)
  revalidatePath('/dashboard/creator')
  return {}
}

export async function rejectApplication(applicationId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: app } = await supabase
    .from('applications')
    .select('id, brief_id, creator_id')
    .eq('id', applicationId)
    .single()

  if (!app) return { error: 'Application not found' }

  const { data: brief } = await supabase
    .from('briefs')
    .select('id, title, brand_id')
    .eq('id', app.brief_id)
    .single()

  if (!brief || brief.brand_id !== user.id) return { error: 'Unauthorised' }

  const { error: rejectError } = await supabase
    .from('applications')
    .update({ status: 'rejected' })
    .eq('id', applicationId)

  if (rejectError) return { error: rejectError.message }

  // Notify the creator
  const admin = createAdminClient()
  const { data: creatorAuth } = await admin.auth.admin.getUserById(app.creator_id)
  const creatorEmail = creatorAuth?.user?.email

  const { data: creatorProfile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', app.creator_id)
    .single()

  if (creatorEmail) {
    await sendApplicationRejected({
      to: creatorEmail,
      creatorName: creatorProfile?.display_name || 'Creator',
      briefTitle: brief.title || 'Untitled brief',
    })
  }

  revalidatePath(`/briefs/${app.brief_id}`)
  revalidatePath(`/briefs/${app.brief_id}/applications`)
  revalidatePath('/dashboard/creator')
  return {}
}
