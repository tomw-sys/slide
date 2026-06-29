'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createBrief(
  formData: FormData
): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const title = (formData.get('title') as string).trim()
  const description = (formData.get('description') as string).trim()
  const deliverablesRaw = (formData.get('deliverables') as string).trim()
  const deliverables = deliverablesRaw
    ? deliverablesRaw
        .split('\n')
        .map((d) => d.trim())
        .filter(Boolean)
    : []
  const budgetGBP = parseFloat(formData.get('budget') as string)
  const deadline = formData.get('deadline') as string
  const nichesRaw = formData.get('niches') as string
  const niches = nichesRaw ? nichesRaw.split(',').filter(Boolean) : []

  if (!title) return { error: 'Title is required' }
  if (!description) return { error: 'Description is required' }
  if (isNaN(budgetGBP) || budgetGBP <= 0) return { error: 'Valid budget is required' }
  if (!deadline) return { error: 'Deadline is required' }
  if (niches.length === 0) return { error: 'Select at least one target niche' }

  const { data, error } = await supabase
    .from('briefs')
    .insert({
      brand_id: user.id,
      title,
      description,
      deliverables: deliverables.length > 0 ? deliverables : null,
      budget: Math.round(budgetGBP * 100),
      currency: 'GBP',
      deadline,
      niches,
      status: 'draft',
    })
    .select('id')
    .single()

  if (error) return { error: error.message }
  return { id: data.id }
}

export async function updateBriefStatus(
  briefId: string,
  status: 'draft' | 'live' | 'closed'
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('briefs')
    .update({ status })
    .eq('id', briefId)
    .eq('brand_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/briefs')
  revalidatePath(`/briefs/${briefId}`)
  return {}
}

export async function recordSwipe(
  briefId: string,
  direction: 'pass' | 'slide'
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('swipes').upsert(
    {
      swiper_id: user.id,
      target_id: briefId,
      target_type: 'brief',
      direction,
    },
    { onConflict: 'swiper_id,target_id,target_type' }
  )

  if (error) return { error: error.message }
  return {}
}

export async function submitApplication(
  formData: FormData
): Promise<{ error?: string; redirectTo?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const briefId = formData.get('brief_id') as string
  const pitch = (formData.get('pitch') as string).trim()
  const proposedRateGBP = parseFloat(formData.get('proposed_rate') as string)

  if (!pitch) return { error: 'A pitch is required' }
  if (isNaN(proposedRateGBP) || proposedRateGBP <= 0)
    return { error: 'A valid proposed rate is required' }

  // Check creator profile exists
  const { data: creatorProfile } = await supabase
    .from('creator_profiles')
    .select('id')
    .eq('id', user.id)
    .single()
  if (!creatorProfile) return { error: 'Complete your creator profile first' }

  const { error } = await supabase.from('applications').upsert(
    {
      brief_id: briefId,
      creator_id: user.id,
      pitch,
      proposed_rate: Math.round(proposedRateGBP * 100),
      status: 'pending',
    },
    { onConflict: 'brief_id,creator_id' }
  )

  if (error) return { error: error.message }

  revalidatePath(`/briefs/${briefId}`)
  return { redirectTo: `/briefs/${briefId}?applied=true` }
}
