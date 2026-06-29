import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile?.role) {
    redirect('/sign-up')
  }

  if (profile.role === 'creator') {
    const { data: creatorProfile } = await supabase
      .from('creator_profiles')
      .select('id')
      .eq('id', user.id)
      .single()
    redirect(creatorProfile ? '/dashboard/creator' : '/onboarding/creator')
  }

  if (profile.role === 'brand') {
    const { data: brandProfile } = await supabase
      .from('brand_profiles')
      .select('id')
      .eq('id', user.id)
      .single()
    redirect(brandProfile ? '/dashboard/brand' : '/onboarding/brand')
  }

  if (profile.role === 'admin') {
    redirect('/admin')
  }

  redirect('/sign-in')
}
