'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { completeCreatorOnboarding } from '@/app/actions/profile'

const NICHES = [
  'Fashion',
  'Beauty',
  'Lifestyle',
  'Food & Drink',
  'Travel',
  'Fitness',
  'Tech',
  'Gaming',
  'Home & Living',
  'Parenting',
  'Finance',
  'Music',
  'Comedy',
  'Education',
  'Sustainability',
  'Pets',
]

export default function CreatorOnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [dayRate, setDayRate] = useState('')
  const [selectedNiches, setSelectedNiches] = useState<string[]>([])
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function toggleNiche(niche: string) {
    setSelectedNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    )
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Not authenticated')
      setUploading(false)
      return
    }

    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, {
      upsert: true,
    })

    if (uploadError) {
      setError('Avatar upload failed. You can skip this and add one later.')
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    setAvatarUrl(data.publicUrl)
    setAvatarPreview(URL.createObjectURL(file))
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (selectedNiches.length === 0) {
      setError('Select at least one niche.')
      return
    }

    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.set('display_name', displayName)
    formData.set('bio', bio)
    formData.set('location', location)
    formData.set('day_rate', dayRate)
    formData.set('avatar_url', avatarUrl)
    formData.set('niches', selectedNiches.join(','))

    const result = await completeCreatorOnboarding(formData)

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
          <h1 className="text-white text-2xl font-bold mt-4 mb-1">Build your creator profile</h1>
          <p className="text-[#8a8575] text-sm">
            This is how brands will find and evaluate you. Take your time.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="bg-[#17150F] border border-[#3a3730] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Profile photo</h2>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative w-20 h-20 rounded-full bg-[#100F0C] border border-[#3a3730] hover:border-[#C6F23E] transition-colors overflow-hidden flex items-center justify-center flex-shrink-0"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="text-[#8a8575]"
                    width="28"
                    height="28"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </button>
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="text-[#C6F23E] text-sm font-medium hover:underline disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload photo'}
                </button>
                <p className="text-[#8a8575] text-xs mt-1">JPG or PNG, max 5MB. Optional.</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>

          {/* Basic info */}
          <div className="bg-[#17150F] border border-[#3a3730] rounded-xl p-6 space-y-4">
            <h2 className="text-white font-semibold">About you</h2>

            <div>
              <label className="block text-[#F4EFE3] text-sm font-medium mb-1.5">
                Display name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How you want to appear on Slide"
                required
                className="w-full bg-[#100F0C] border border-[#3a3730] rounded-xl px-4 py-3 text-white placeholder-[#8a8575] focus:outline-none focus:ring-2 focus:ring-[#C6F23E] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-[#F4EFE3] text-sm font-medium mb-1.5">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell brands a little about you and your content style"
                rows={3}
                className="w-full bg-[#100F0C] border border-[#3a3730] rounded-xl px-4 py-3 text-white placeholder-[#8a8575] focus:outline-none focus:ring-2 focus:ring-[#C6F23E] focus:border-transparent transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-[#F4EFE3] text-sm font-medium mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. London, UK"
                className="w-full bg-[#100F0C] border border-[#3a3730] rounded-xl px-4 py-3 text-white placeholder-[#8a8575] focus:outline-none focus:ring-2 focus:ring-[#C6F23E] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Niches */}
          <div className="bg-[#17150F] border border-[#3a3730] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-1">Content niches</h2>
            <p className="text-[#8a8575] text-sm mb-4">
              Select all that apply. This is how brands filter creators.
            </p>
            <div className="flex flex-wrap gap-2">
              {NICHES.map((niche) => {
                const selected = selectedNiches.includes(niche)
                return (
                  <button
                    key={niche}
                    type="button"
                    onClick={() => toggleNiche(niche)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                      selected
                        ? 'bg-[#C6F23E] text-[#100F0C] border-[#C6F23E]'
                        : 'bg-[#100F0C] text-[#F4EFE3] border-[#3a3730] hover:border-[#C6F23E] hover:text-white'
                    }`}
                  >
                    {niche}
                  </button>
                )
              })}
            </div>
            {selectedNiches.length > 0 && (
              <p className="text-[#8a8575] text-xs mt-3">
                {selectedNiches.length} selected
              </p>
            )}
          </div>

          {/* Day rate */}
          <div className="bg-[#17150F] border border-[#3a3730] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-1">Day rate</h2>
            <p className="text-[#8a8575] text-sm mb-4">
              Your standard rate per day. Brands use this as a starting point.
            </p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8575] font-medium">
                £
              </span>
              <input
                type="number"
                value={dayRate}
                onChange={(e) => setDayRate(e.target.value)}
                placeholder="250"
                min="0"
                step="1"
                className="w-full bg-[#100F0C] border border-[#3a3730] rounded-xl pl-8 pr-4 py-3 text-white placeholder-[#8a8575] focus:outline-none focus:ring-2 focus:ring-[#C6F23E] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl px-4 py-3">
              <p className="text-[#ef4444] text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-[#C6F23E] text-[#100F0C] font-semibold rounded-xl px-4 py-3.5 hover:bg-[#ADDA38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            {loading ? 'Setting up your profile...' : 'Complete profile'}
          </button>
        </form>
      </div>
    </main>
  )
}
