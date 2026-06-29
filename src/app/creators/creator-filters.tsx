'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

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

const FOLLOWER_RANGES = [
  { label: 'Any size', value: '' },
  { label: '0 – 10k', value: '0' },
  { label: '10k – 50k', value: '10000' },
  { label: '50k – 100k', value: '50000' },
  { label: '100k+', value: '100000' },
]

const TIERS = [
  { label: 'All tiers', value: '' },
  { label: 'Rising', value: 'rising' },
  { label: 'Verified', value: 'verified' },
  { label: 'Elite', value: 'elite' },
  { label: 'Ambassador', value: 'ambassador' },
]

interface Props {
  niche: string
  location: string
  minFollowers: string
  tier: string
}

export function CreatorFilters({ niche, location, minFollowers, tier }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/creators?${params.toString()}`)
    },
    [router, searchParams]
  )

  const hasFilters = niche || location || minFollowers || tier

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {/* Niche */}
      <select
        value={niche}
        onChange={(e) => update('niche', e.target.value)}
        className="bg-[#1c1c1c] border border-[#2a2a2a] text-sm text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1ee231] focus:border-transparent cursor-pointer"
      >
        <option value="">All niches</option>
        {NICHES.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      {/* Tier */}
      <select
        value={tier}
        onChange={(e) => update('tier', e.target.value)}
        className="bg-[#1c1c1c] border border-[#2a2a2a] text-sm text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1ee231] focus:border-transparent cursor-pointer"
      >
        {TIERS.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      {/* Followers */}
      <select
        value={minFollowers}
        onChange={(e) => update('minFollowers', e.target.value)}
        className="bg-[#1c1c1c] border border-[#2a2a2a] text-sm text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1ee231] focus:border-transparent cursor-pointer"
      >
        {FOLLOWER_RANGES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>

      {/* Location */}
      <input
        type="text"
        placeholder="Location"
        defaultValue={location}
        onBlur={(e) => update('location', e.target.value.trim())}
        onKeyDown={(e) => {
          if (e.key === 'Enter') update('location', (e.target as HTMLInputElement).value.trim())
        }}
        className="bg-[#1c1c1c] border border-[#2a2a2a] text-sm text-white placeholder-[#a3a3a3] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1ee231] focus:border-transparent w-36"
      />

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={() => router.push('/creators')}
          className="text-[#a3a3a3] text-sm hover:text-white transition-colors px-2"
        >
          Clear
        </button>
      )}
    </div>
  )
}
