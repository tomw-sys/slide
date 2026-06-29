import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TopNav } from '@/components/top-nav'
import { BottomNav } from '@/components/bottom-nav'
import { ProfileForm } from './profile-form'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/sign-in')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url, bio, username, niches, social_links, role')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/sign-in')

  let tier: string | undefined
  if (profile.role === 'creator') {
    const { data: cp } = await supabase
      .from('creator_profiles')
      .select('tier')
      .eq('id', user.id)
      .single()
    tier = cp?.tier ?? undefined
  }

  return (
    <main className="min-h-dvh bg-[#100F0C]">
      <TopNav
        displayName={profile.display_name || user.email || ''}
        role={profile.role as 'creator' | 'brand' | 'admin'}
        tier={tier}
        avatarUrl={profile.avatar_url ?? undefined}
      />
      <ProfileForm
        userId={user.id}
        profile={{
          display_name: profile.display_name ?? '',
          username: (profile as Record<string, unknown>).username as string ?? '',
          bio: profile.bio ?? '',
          niches: (profile as Record<string, unknown>).niches as string[] ?? [],
          social_links: (profile as Record<string, unknown>).social_links as Record<string, string> ?? {},
          avatar_url: profile.avatar_url ?? null,
          role: profile.role ?? 'creator',
        }}
      />
      <BottomNav />
    </main>
  )
}
