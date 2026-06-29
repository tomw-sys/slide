'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function CreatorSignUpPage() {
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkEmail, setCheckEmail] = useState(false)

  async function handleEmailSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: 'creator' },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setCheckEmail(true)
    setLoading(false)
  }

  async function handleGoogleSignUp() {
    setLoading(true)
    setError('')

    // Store intended role in a short-lived cookie before the OAuth redirect
    document.cookie = `pending_role=creator; path=/; max-age=600; samesite=lax`

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  if (checkEmail) {
    return (
      <main className="min-h-screen bg-[#100F0C] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-6">📬</div>
          <h1 className="text-white text-2xl font-bold mb-3">Check your email</h1>
          <p className="text-[#8a8575] text-sm leading-relaxed">
            We sent a confirmation link to <span className="text-white">{email}</span>. Click it to
            verify your account and continue to your creator profile setup.
          </p>
          <button
            onClick={() => setCheckEmail(false)}
            className="mt-6 text-[#C6F23E] text-sm hover:underline"
          >
            Use a different email
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#100F0C] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/sign-up" className="text-[#8a8575] text-sm hover:text-white transition-colors">
            ← Back
          </Link>
          <div className="mt-4">
            <span className="text-[#C6F23E] text-3xl font-bold tracking-tight">Slide</span>
            <p className="text-[#8a8575] text-sm mt-2">Create your creator account</p>
          </div>
        </div>

        <div className="bg-[#17150F] border border-[#3a3730] rounded-xl p-8">
          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full bg-[#100F0C] border border-[#3a3730] text-white rounded-xl px-4 py-3 hover:bg-[#222] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#3a3730]" />
            <span className="text-[#8a8575] text-xs uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-[#3a3730]" />
          </div>

          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div>
              <label className="block text-[#F4EFE3] text-sm font-medium mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-[#100F0C] border border-[#3a3730] rounded-xl px-4 py-3 text-white placeholder-[#8a8575] focus:outline-none focus:ring-2 focus:ring-[#C6F23E] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-[#F4EFE3] text-sm font-medium mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                minLength={8}
                required
                className="w-full bg-[#100F0C] border border-[#3a3730] rounded-xl px-4 py-3 text-white placeholder-[#8a8575] focus:outline-none focus:ring-2 focus:ring-[#C6F23E] focus:border-transparent transition-all"
              />
            </div>

            {error && <p className="text-[#ef4444] text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C6F23E] text-[#100F0C] font-semibold rounded-xl px-4 py-3 hover:bg-[#ADDA38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create creator account'}
            </button>
          </form>

          <p className="text-center text-[#8a8575] text-xs mt-6 leading-relaxed">
            By signing up you agree to our terms of service and privacy policy.
          </p>

          <p className="text-center text-[#8a8575] text-sm mt-4">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-[#C6F23E] hover:underline">
              Sign in
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
