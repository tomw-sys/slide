'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { updateProfile, updateAvatarUrl } from '@/app/actions/profile'
import { signOut } from '@/app/actions/auth'

const NICHE_OPTIONS = [
  'Lifestyle', 'Beauty', 'Fashion', 'Food',
  'Travel', 'Gaming', 'Fitness', 'Tech', 'Parenting', 'Finance',
]

const BIO_MAX = 160

type SocialLinks = { instagram?: string; tiktok?: string; youtube?: string }

interface ProfileData {
  display_name: string
  username: string
  bio: string
  niches: string[]
  social_links: SocialLinks
  avatar_url: string | null
  role: string
}

export function ProfileForm({ userId, profile }: { userId: string; profile: ProfileData }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url)
  const [displayName, setDisplayName] = useState(profile.display_name)
  const [username, setUsername] = useState(profile.username)
  const [bio, setBio] = useState(profile.bio)
  const [niches, setNiches] = useState<string[]>(profile.niches)
  const [instagram, setInstagram] = useState(profile.social_links?.instagram ?? '')
  const [tiktok, setTiktok] = useState(profile.social_links?.tiktok ?? '')
  const [youtube, setYoutube] = useState(profile.social_links?.youtube ?? '')

  const [avatarUploading, setAvatarUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initial = (displayName || username || 'U')[0].toUpperCase()

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarUploading(true)
    setError(null)

    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${userId}/avatar.${ext}`
    const supabase = createClient()

    const { data, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError(`Photo upload failed: ${uploadError.message}`)
      setAvatarUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path)
    setAvatarUrl(publicUrl)

    const result = await updateAvatarUrl(publicUrl)
    if (result.error) setError(result.error)

    setAvatarUploading(false)
  }

  function toggleNiche(niche: string) {
    setNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    )
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSuccess(false)

    const result = await updateProfile({
      display_name: displayName,
      username,
      bio,
      niches,
      social_links: { instagram: instagram || undefined, tiktok: tiktok || undefined, youtube: youtube || undefined },
      role: profile.role,
    })

    setSaving(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <div
      className="max-w-lg mx-auto px-5 pb-10"
      style={{ paddingTop: 'max(calc(env(safe-area-inset-top) + 72px), 88px)', paddingBottom: 'max(calc(env(safe-area-inset-bottom) + 84px), 100px)' }}
    >
      {/* Page heading */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-[#17150F] border border-[#3a3730] flex items-center justify-center text-[#8a8575] hover:text-white transition-colors tap-scale flex-shrink-0"
          aria-label="Go back"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
        </button>
        <h1 className="text-white text-2xl font-black">Your profile</h1>
      </div>

      {/* Success banner */}
      {success && (
        <div className="mb-6 flex items-center gap-2.5 bg-[#C6F23E]/10 border border-[#C6F23E]/30 rounded-xl px-4 py-3">
          <svg viewBox="0 0 20 20" fill="#C6F23E" className="w-4 h-4 flex-shrink-0">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
          </svg>
          <p className="text-[#C6F23E] text-sm font-semibold">Profile saved</p>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl px-4 py-3">
          <p className="text-[#ef4444] text-sm">{error}</p>
        </div>
      )}

      {/* Avatar */}
      <div className="flex flex-col items-center mb-10">
        <div
          className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#3a3730] mb-4 flex items-center justify-center text-white text-3xl font-black"
          style={{ backgroundColor: '#3a3730' }}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="Your avatar" className="w-full h-full object-cover" />
          ) : (
            initial
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleAvatarChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={avatarUploading}
          className="text-sm font-bold px-4 py-2 rounded-full tap-scale disabled:opacity-50 transition-colors"
          style={{ background: '#C6F23E', color: '#100F0C', WebkitTapHighlightColor: 'transparent' }}
        >
          {avatarUploading ? 'Uploading...' : 'Change photo'}
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {/* Display name */}
        <div>
          <label className="block text-[#5C584C] text-[10px] uppercase tracking-widest font-bold mb-2">
            Display name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-[#17150F] border border-[#3a3730] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#5C584C] focus:outline-none focus:border-[#C6F23E]/50 transition-colors"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-[#5C584C] text-[10px] uppercase tracking-widest font-bold mb-2">
            Username
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C584C] text-sm select-none">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/[^a-z0-9._]/gi, '').toLowerCase())}
              placeholder="yourhandle"
              className="w-full bg-[#17150F] border border-[#3a3730] rounded-xl pl-8 pr-4 py-3 text-white text-sm placeholder:text-[#5C584C] focus:outline-none focus:border-[#C6F23E]/50 transition-colors"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[#5C584C] text-[10px] uppercase tracking-widest font-bold">
              Bio
            </label>
            <span
              className="text-[10px] font-semibold tabular-nums"
              style={{ color: bio.length > BIO_MAX * 0.9 ? (bio.length >= BIO_MAX ? '#ef4444' : '#f59e0b') : '#5C584C' }}
            >
              {bio.length} / {BIO_MAX}
            </span>
          </div>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
            placeholder="Tell brands a bit about you and what you create..."
            className="w-full bg-[#17150F] border border-[#3a3730] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#5C584C] focus:outline-none focus:border-[#C6F23E]/50 transition-colors resize-none"
          />
        </div>

        {/* Niches */}
        <div>
          <label className="block text-[#5C584C] text-[10px] uppercase tracking-widest font-bold mb-3">
            Niches
          </label>
          <div className="flex flex-wrap gap-2">
            {NICHE_OPTIONS.map((niche) => {
              const active = niches.includes(niche)
              return (
                <button
                  key={niche}
                  onClick={() => toggleNiche(niche)}
                  className="text-xs font-bold px-3.5 py-2 rounded-full transition-all tap-scale"
                  style={{
                    background: active ? '#C6F23E' : '#17150F',
                    color: active ? '#100F0C' : '#8a8575',
                    border: active ? '1px solid transparent' : '1px solid #3a3730',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {niche}
                </button>
              )
            })}
          </div>
        </div>

        {/* Social links */}
        <div>
          <label className="block text-[#5C584C] text-[10px] uppercase tracking-widest font-bold mb-3">
            Social links
          </label>
          <div className="flex flex-col gap-3">
            {/* Instagram */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 select-none">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="#5C584C" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="#5C584C" />
                </svg>
              </span>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@yourhandle"
                className="w-full bg-[#17150F] border border-[#3a3730] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-[#5C584C] focus:outline-none focus:border-[#C6F23E]/50 transition-colors"
              />
            </div>

            {/* TikTok */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 select-none">
                <svg viewBox="0 0 24 24" fill="#5C584C" className="w-4 h-4">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9a8.18 8.18 0 0 0 4.78 1.52V7.07a4.85 4.85 0 0 1-1.01-.38z" />
                </svg>
              </span>
              <input
                type="text"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                placeholder="@yourhandle"
                className="w-full bg-[#17150F] border border-[#3a3730] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-[#5C584C] focus:outline-none focus:border-[#C6F23E]/50 transition-colors"
              />
            </div>

            {/* YouTube */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 select-none">
                <svg viewBox="0 0 24 24" fill="#5C584C" className="w-4 h-4">
                  <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.02 0 12 0 12s0 3.98.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.45 20.5 12 20.5 12 20.5s7.55 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.98 24 12 24 12s0-3.98-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
                </svg>
              </span>
              <input
                type="text"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="Channel URL or handle"
                className="w-full bg-[#17150F] border border-[#3a3730] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-[#5C584C] focus:outline-none focus:border-[#C6F23E]/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-xl text-sm font-bold tracking-wide transition-all tap-scale disabled:opacity-50 mt-2"
          style={{ background: '#C6F23E', color: '#100F0C', WebkitTapHighlightColor: 'transparent' }}
        >
          {saving ? 'Saving...' : 'Save profile'}
        </button>

        {/* Sign out */}
        <form action={signOut} className="flex justify-center">
          <button
            type="submit"
            className="text-[#5C584C] text-sm hover:text-[#8a8575] transition-colors py-2"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
