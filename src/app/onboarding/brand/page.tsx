'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { completeBrandOnboarding } from '@/app/actions/profile'

const INDUSTRIES = [
  'Fashion & Apparel',
  'Beauty & Cosmetics',
  'Food & Beverage',
  'Health & Wellness',
  'Technology',
  'Gaming',
  'Travel & Hospitality',
  'Home & Lifestyle',
  'Finance & Fintech',
  'Education',
  'Sports & Fitness',
  'Entertainment',
  'Retail & E-commerce',
  'Automotive',
  'Media & Publishing',
  'Other',
]

export default function BrandOnboardingPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [website, setWebsite] = useState('')
  const [industry, setIndustry] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!companyName.trim()) {
      setError('Company name is required.')
      return
    }

    if (!industry) {
      setError('Please select an industry.')
      return
    }

    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.set('display_name', displayName || companyName)
    formData.set('company_name', companyName)
    formData.set('website', website)
    formData.set('industry', industry)

    const result = await completeBrandOnboarding(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    if (result.redirectTo) {
      router.push(result.redirectTo)
    }
  }

  return (
    <main className="min-h-screen bg-[#100F0C] py-12 px-4">
      <div className="w-full max-w-xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#C6F23E] text-2xl font-bold tracking-tight">Slide</span>
          <h1 className="text-white text-2xl font-bold mt-4 mb-1">Set up your brand profile</h1>
          <p className="text-[#8a8575] text-sm">
            This is what creators see when your briefs appear in their feed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brand details */}
          <div className="bg-[#17150F] border border-[#3a3730] rounded-xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Brand details</h2>

            <div>
              <label className="block text-[#F4EFE3] text-sm font-medium mb-1.5">
                Company name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your company or brand name"
                required
                className="w-full bg-[#100F0C] border border-[#3a3730] rounded-xl px-4 py-3 text-white placeholder-[#8a8575] focus:outline-none focus:ring-2 focus:ring-[#C6F23E] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-[#F4EFE3] text-sm font-medium mb-1.5">
                Your name{' '}
                <span className="text-[#8a8575] font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name or job title"
                className="w-full bg-[#100F0C] border border-[#3a3730] rounded-xl px-4 py-3 text-white placeholder-[#8a8575] focus:outline-none focus:ring-2 focus:ring-[#C6F23E] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-[#F4EFE3] text-sm font-medium mb-1.5">
                Website{' '}
                <span className="text-[#8a8575] font-normal">(optional)</span>
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourcompany.com"
                className="w-full bg-[#100F0C] border border-[#3a3730] rounded-xl px-4 py-3 text-white placeholder-[#8a8575] focus:outline-none focus:ring-2 focus:ring-[#C6F23E] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Industry */}
          <div className="bg-[#17150F] border border-[#3a3730] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-1">Industry</h2>
            <p className="text-[#8a8575] text-sm mb-4">
              Helps creators understand your category and audience.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {INDUSTRIES.map((ind) => {
                const selected = industry === ind
                return (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => setIndustry(ind)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border text-left ${
                      selected
                        ? 'bg-[#C6F23E] text-[#100F0C] border-[#C6F23E]'
                        : 'bg-[#100F0C] text-[#F4EFE3] border-[#3a3730] hover:border-[#C6F23E] hover:text-white'
                    }`}
                  >
                    {ind}
                  </button>
                )
              })}
            </div>
          </div>

          {error && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl px-4 py-3">
              <p className="text-[#ef4444] text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C6F23E] text-[#100F0C] font-semibold rounded-xl px-4 py-3.5 hover:bg-[#ADDA38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            {loading ? 'Setting up your account...' : 'Complete setup'}
          </button>
        </form>
      </div>
    </main>
  )
}
