'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function revealRewardCode(
  rewardId: string
): Promise<{ error?: string; code?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: reward, error: rewardError } = await supabase
    .from('rewards')
    .select('discount_code, is_active')
    .eq('id', rewardId)
    .single()

  if (rewardError || !reward) return { error: 'Reward not found' }
  if (!reward.is_active) return { error: 'This reward is no longer available' }

  await supabase.from('reward_redemptions').upsert(
    { creator_id: user.id, reward_id: rewardId },
    { onConflict: 'creator_id,reward_id', ignoreDuplicates: true }
  )

  // No revalidatePath here — the caller holds the code in client state.
  // Revalidating would unmount the component and lose the revealed code.
  return { code: reward.discount_code }
}

export async function createReward(
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') return { error: 'Unauthorised' }

  const partnerName = (formData.get('partner_name') as string).trim()
  const offerDescription = (formData.get('offer_description') as string).trim()
  const discountCode = (formData.get('discount_code') as string).trim()
  const discountValue = (formData.get('discount_value') as string).trim()
  const minimumTier = formData.get('minimum_tier') as string
  const expiresAt = formData.get('expires_at') as string

  if (!partnerName) return { error: 'Partner name is required' }
  if (!offerDescription) return { error: 'Offer description is required' }
  if (!discountCode) return { error: 'Discount code is required' }
  if (!discountValue) return { error: 'Discount value is required' }

  const { error } = await supabase.from('rewards').insert({
    partner_name: partnerName,
    offer_description: offerDescription,
    discount_code: discountCode,
    discount_value: discountValue,
    minimum_tier: minimumTier || 'rising',
    expires_at: expiresAt || null,
    is_active: true,
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/rewards')
  revalidatePath('/rewards')
  return {}
}

export async function updateReward(
  rewardId: string,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') return { error: 'Unauthorised' }

  const partnerName = (formData.get('partner_name') as string).trim()
  const offerDescription = (formData.get('offer_description') as string).trim()
  const discountCode = (formData.get('discount_code') as string).trim()
  const discountValue = (formData.get('discount_value') as string).trim()
  const minimumTier = formData.get('minimum_tier') as string
  const expiresAt = formData.get('expires_at') as string

  const { error } = await supabase
    .from('rewards')
    .update({
      partner_name: partnerName,
      offer_description: offerDescription,
      discount_code: discountCode,
      discount_value: discountValue,
      minimum_tier: minimumTier || 'rising',
      expires_at: expiresAt || null,
    })
    .eq('id', rewardId)

  if (error) return { error: error.message }

  revalidatePath('/admin/rewards')
  revalidatePath('/rewards')
  return {}
}

export async function toggleRewardActive(
  rewardId: string,
  isActive: boolean
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') return { error: 'Unauthorised' }

  const { error } = await supabase
    .from('rewards')
    .update({ is_active: isActive })
    .eq('id', rewardId)

  if (error) return { error: error.message }

  revalidatePath('/admin/rewards')
  revalidatePath('/rewards')
  return {}
}
