'use server'

import { createClient } from '@/lib/supabase/server'

export async function completeCreatorOnboarding(
  formData: FormData
): Promise<{ error?: string; redirectTo?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { redirectTo: '/sign-in' }
  }

  const displayName = formData.get('display_name') as string
  const bio = formData.get('bio') as string
  const location = formData.get('location') as string
  const dayRate = formData.get('day_rate') as string
  const avatarUrl = formData.get('avatar_url') as string
  const nichesRaw = formData.get('niches') as string
  const niches = nichesRaw ? nichesRaw.split(',').filter(Boolean) : []

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        role: 'creator',
        display_name: displayName || null,
        bio: bio || null,
        location: location || null,
        avatar_url: avatarUrl || null,
      },
      { onConflict: 'id' }
    )

  if (profileError) {
    console.error('[completeCreatorOnboarding] profile upsert error:', profileError.message)
    return { error: profileError.message }
  }

  const { error: creatorError } = await supabase.from('creator_profiles').upsert({
    id: user.id,
    niches: niches.length > 0 ? niches : null,
    day_rate: dayRate ? Math.round(parseFloat(dayRate) * 100) : null,
    verification_status: 'pending',
    tier: 'rising',
  })

  if (creatorError) {
    console.error('[completeCreatorOnboarding] creator_profiles upsert error:', creatorError.message)
    return { error: creatorError.message }
  }

  return { redirectTo: '/dashboard/creator' }
}

export async function completeBrandOnboarding(
  formData: FormData
): Promise<{ error?: string; redirectTo?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { redirectTo: '/sign-in' }
  }

  const displayName = formData.get('display_name') as string
  const companyName = formData.get('company_name') as string
  const website = formData.get('website') as string
  const industry = formData.get('industry') as string

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        role: 'brand',
        display_name: displayName || companyName || null,
      },
      { onConflict: 'id' }
    )

  if (profileError) {
    console.error('[completeBrandOnboarding] profile upsert error:', profileError.message)
    return { error: profileError.message }
  }

  const { error: brandError } = await supabase.from('brand_profiles').upsert({
    id: user.id,
    company_name: companyName || null,
    website: website || null,
    industry: industry || null,
    subscription_tier: 'free',
  })

  if (brandError) {
    console.error('[completeBrandOnboarding] brand_profiles upsert error:', brandError.message)
    return { error: brandError.message }
  }

  return { redirectTo: '/dashboard/brand' }
}
