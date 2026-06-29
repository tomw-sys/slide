import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function SignUpPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    // If the user is authenticated and already has a role, send them home
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role) {
      redirect('/dashboard')
    }
    // role is null — fall through and show role selection
  }

  return (
    <main className="min-h-screen bg-[#100F0C] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-[#C6F23E] text-3xl font-bold tracking-tight">Slide</span>
          <p className="text-[#8a8575] text-sm mt-2">Who are you joining as?</p>
        </div>

        <div className="space-y-4">
          <Link href="/sign-up/creator" className="block">
            <div className="bg-[#17150F] border border-[#3a3730] rounded-xl p-6 hover:border-[#C6F23E] transition-colors group cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🎬</div>
                <div className="flex-1">
                  <h2 className="text-white font-semibold text-lg group-hover:text-[#C6F23E] transition-colors">
                    Creator
                  </h2>
                  <p className="text-[#8a8575] text-sm mt-1">
                    Get discovered by brands, apply to paid briefs, and unlock exclusive retail
                    rewards.
                  </p>
                </div>
                <svg
                  className="text-[#8a8575] group-hover:text-[#C6F23E] transition-colors mt-1"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/sign-up/brand" className="block">
            <div className="bg-[#17150F] border border-[#3a3730] rounded-xl p-6 hover:border-[#C6F23E] transition-colors group cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🏢</div>
                <div className="flex-1">
                  <h2 className="text-white font-semibold text-lg group-hover:text-[#C6F23E] transition-colors">
                    Brand or Agency
                  </h2>
                  <p className="text-[#8a8575] text-sm mt-1">
                    Find verified UGC creators, post briefs, and manage campaigns end to end.
                  </p>
                </div>
                <svg
                  className="text-[#8a8575] group-hover:text-[#C6F23E] transition-colors mt-1"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        <p className="text-center text-[#8a8575] text-sm mt-8">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-[#C6F23E] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
