'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const CALLBACK_ERRORS: Record<string, string> = {
  auth_failed:
    'The confirmation link has expired or was already used. Please sign in below.',
  missing_code: 'The confirmation link is invalid. Please try signing up again.',
  no_user: 'Something went wrong confirming your account. Please try signing in.',
}

interface Props {
  callbackError?: string
}

export function SignInForm({ callbackError }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const initialError = callbackError
    ? (CALLBACK_ERRORS[callbackError] ?? 'Something went wrong. Please try again.')
    : ''

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(initialError)

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile?.role) {
      router.push('/sign-up')
      return
    }

    if (profile.role === 'creator') {
      const { data: creatorProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('id', user.id)
        .single()
      router.push(creatorProfile ? '/dashboard/creator' : '/onboarding/creator')
    } else if (profile.role === 'brand') {
      const { data: brandProfile } = await supabase
        .from('brand_profiles')
        .select('id')
        .eq('id', user.id)
        .single()
      router.push(brandProfile ? '/dashboard/brand' : '/onboarding/brand')
    } else {
      router.push('/dashboard')
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true)
    setError('')

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (oauthError) {
      setError(oauthError.message)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#151515] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-[#1ee231] text-3xl font-bold tracking-tight">Slide</span>
          <p className="text-[#a3a3a3] text-sm mt-2">Sign in to your account</p>
        </div>

        <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-8">
          {error && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl px-4 py-3 mb-6">
              <p className="text-[#ef4444] text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label className="block text-[#d4d4d4] text-sm font-medium mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#1ee231] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-[#d4d4d4] text-sm font-medium mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#1ee231] focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1ee231] text-[#151515] font-semibold rounded-xl px-4 py-3 hover:bg-[#17c029] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-[#2a2a2a]" />
            <span className="text-[#a3a3a3] text-xs uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-[#2a2a2a]" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-[#151515] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 hover:bg-[#222] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="text-center text-[#a3a3a3] text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-[#1ee231] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  )
}
