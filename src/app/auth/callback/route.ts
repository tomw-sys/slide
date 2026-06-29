import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/sign-in?error=missing_code`)
  }

  // Collect cookies that Supabase sets during exchangeCodeForSession so we can
  // forward them onto whichever redirect response we end up returning.
  // Using next/headers cookies() here doesn't work reliably for redirect
  // responses — cookies set that way may not be forwarded by Next.js.
  const responseCookies: Array<{
    name: string
    value: string
    options: Parameters<(typeof NextResponse.prototype.cookies)['set']>[2]
  }> = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach((c) =>
            responseCookies.push({ name: c.name, value: c.value, options: c.options })
          )
        },
      },
    }
  )

  // Helper: build a redirect and stamp all session cookies onto it.
  // Handles x-forwarded-host so production deployments (e.g. Vercel) redirect
  // to the correct hostname rather than the internal origin.
  function makeRedirect(path: string) {
    const forwardedHost = request.headers.get('x-forwarded-host')
    const base =
      forwardedHost && process.env.NODE_ENV !== 'development'
        ? `https://${forwardedHost}`
        : origin
    const response = NextResponse.redirect(`${base}${path}`)
    responseCookies.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options)
    })
    return response
  }

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('[auth/callback] exchangeCodeForSession error:', exchangeError.message)
    return makeRedirect('/sign-in?error=auth_failed')
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return makeRedirect('/sign-in?error=no_user')
  }

  // Read the role from user metadata (email sign-up) or the pending_role cookie
  // that was set just before an OAuth redirect.
  const pendingRole = request.cookies.get('pending_role')?.value
  const roleFromMeta = user.user_metadata?.role as string | undefined

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .single()

  if (!profile?.role) {
    const role = roleFromMeta || pendingRole || 'creator'

    // Upsert in case the DB trigger did not run (e.g. trigger not deployed)
    await supabase.from('profiles').upsert(
      {
        id: user.id,
        role,
        display_name: (user.user_metadata?.full_name as string) || null,
        avatar_url: (user.user_metadata?.avatar_url as string) || null,
      },
      { onConflict: 'id' }
    )

    const response = makeRedirect(`/onboarding/${role}`)
    response.cookies.set('pending_role', '', { maxAge: 0, path: '/' })
    return response
  }

  // Profile already has a role — figure out if onboarding is complete
  if (profile.role === 'creator') {
    const { data: creatorProfile } = await supabase
      .from('creator_profiles')
      .select('id')
      .eq('id', user.id)
      .single()
    return makeRedirect(creatorProfile ? '/dashboard/creator' : '/onboarding/creator')
  }

  if (profile.role === 'brand') {
    const { data: brandProfile } = await supabase
      .from('brand_profiles')
      .select('id')
      .eq('id', user.id)
      .single()
    return makeRedirect(brandProfile ? '/dashboard/brand' : '/onboarding/brand')
  }

  return makeRedirect('/dashboard')
}
